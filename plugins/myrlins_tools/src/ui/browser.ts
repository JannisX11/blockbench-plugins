/**
 * Voxel Model Browser - Browse, import, and optimize models from Myrlin gallery
 *
 * Features:
 * - Browse public gallery from forge.myrlin.io
 * - Preview models before import
 * - One-click import into Blockbench
 * - Auto-optimize on import option
 */

import { track } from '../utils/cleanup';
import { optimizeBoxes } from '../optimizer/box_merge';
// (3.4.1 imported hollowInterior here without calling it; Hollow is off in 3.4.2)

const MYRLIN_API = 'https://api.myrlin.io';
const MYRLIN_GALLERY = 'https://forge.myrlin.io/gallery';
const PAGE_SIZE = 24;

export interface GalleryItem {
    id: string;
    name: string;
    thumbnailUrl: string;
    blockymodelUrl?: string;
    textureUrl?: string;
    /** Box count when the API sends one (it does not today) */
    boxCount?: number | null;
    category: string;
    creator?: string;
    /** 'hytale' | 'minecraft' | '' */
    gameTarget?: string;
    /** Forge's subject tag (prop, block, item, character, creature, ...), may be empty */
    subject?: string;
    /** False for a paid model: import it from forge.myrlin.io instead */
    isFree: boolean;
}

export interface GalleryPage {
    items: GalleryItem[];
    hasMore: boolean;
    /** Set when the gallery could not be reached (shown instead of "No models found") */
    error?: string;
}

/**
 * Map one /api/gallery item to what the browser shows.
 *
 * The API sends snake_case (thumbnail_url, blockymodel_url, texture_url,
 * display_name, featured_category); 3.4.0 read camelCase fields the API never
 * sent, so thumbnails were empty and Import did nothing.
 */
export function mapGalleryItem(raw: any): GalleryItem {
    const r = raw || {};
    const creator = r.creator && typeof r.creator === 'object' ? (r.creator.name || '') : (r.creator || '');
    const price = r.price;
    const isFree = !price || typeof price !== 'object' || !price.kind || price.kind === 'free';
    return {
        id: String(r.card_id || r.id || ''),
        name: String(r.display_name || r.asset_name || r.name || 'Untitled model'),
        thumbnailUrl: r.thumbnail_url || r.thumbnailUrl || '',
        blockymodelUrl: r.blockymodel_url || r.blockymodelUrl || undefined,
        textureUrl: r.texture_url || r.textureUrl || undefined,
        boxCount: typeof r.box_count === 'number' ? r.box_count : (typeof r.boxCount === 'number' ? r.boxCount : null),
        category: String(r.featured_category || r.subject || r.category || ''),
        creator: creator || undefined,
        gameTarget: r.game_target || '',
        subject: String(r.subject || '').toLowerCase(),
        isFree
    };
}

// Forge authors placed things at 32 units per block (native_size_intent defaults; vehicles too), entities and held
// items at 64. Hytale ignores the file's "format" key; Blockbench uses it only for the view scale.
const PLACED_SUBJECTS = ['prop', 'block', 'structure', 'vehicle'];

/**
 * True when the model should open as Hytale Prop (32 units per block) instead of Character (64).
 * Forge files carry no "format" key, so the Hytale Models plugin would open every one as Character;
 * for placed subjects the browser gives the codec a path inside a "Blocks" folder, its own rule for Prop.
 * Only the view scale depends on this (UVs are the same in both formats).
 */
export function opensAsProp(item: GalleryItem): boolean {
    return PLACED_SUBJECTS.includes(String(item.subject || '').toLowerCase());
}

/**
 * The gallery's file links are presigned storage URLs, which only answer CORS
 * for forge.myrlin.io. The API's file proxy answers any origin for presigned
 * links (Access-Control-Allow-Origin *, no credentials), so downloads go
 * through it in web and desktop Blockbench alike.
 */
export function proxiedFileUrl(url: string): string {
    return `${MYRLIN_API}/api/proxy?url=${encodeURIComponent(url)}`;
}

/**
 * Fetch one page of the public gallery from the Myrlin API.
 * GET only, no credentials, no custom headers (a simple CORS request).
 */
async function fetchGalleryPage(category?: string, search?: string, page: number = 1): Promise<GalleryPage> {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            page_size: PAGE_SIZE.toString(),
            ...(category && { category }),
            ...(search && { search })
        });

        const response = await fetch(`${MYRLIN_API}/api/gallery?${params}`);

        if (!response.ok) {
            throw new Error(`the gallery answered ${response.status}`);
        }

        const data = await response.json();
        const items = Array.isArray(data.items) ? data.items.map(mapGalleryItem) : [];
        return { items, hasMore: !!data.has_more };
    } catch (error) {
        console.error('[Myrlin Browser] Failed to fetch gallery:', error);
        const detail = error && (error as any).message ? (error as any).message : String(error);
        return { items: [], hasMore: false, error: `Could not reach the Myrlin gallery (${detail}).` };
    }
}

/**
 * The gallery's categories (name and count), for the filter. Empty on failure.
 */
async function fetchGalleryCategories(): Promise<Array<{ name: string; count: number }>> {
    try {
        const response = await fetch(`${MYRLIN_API}/api/gallery/categories`);
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data.categories) ? data.categories.filter((c: any) => c && c.name) : [];
    } catch (error) {
        console.warn('[Myrlin Browser] Could not load categories:', error);
        return [];
    }
}

/**
 * Fetch gallery items from Myrlin API (first page; kept for callers of 3.4.0)
 */
async function fetchGalleryItems(category?: string, search?: string, limit: number = 20): Promise<GalleryItem[]> {
    const page = await fetchGalleryPage(category, search, 1);
    return page.items.slice(0, Math.max(1, limit));
}

function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
}

/**
 * Add the model's texture to the open project. In Hytale formats the UV size
 * is set to the image size (what the Hytale Models plugin's "Fix UV Size" does).
 */
async function importTexture(url: string, name: string): Promise<boolean> {
    try {
        const response = await fetch(proxiedFileUrl(url));
        if (!response.ok) throw new Error(`texture download answered ${response.status}`);
        const dataUrl = await blobToDataUrl(await response.blob());
        // @ts-ignore - Texture is a global from Blockbench
        const texture = new Texture({ name: `${name}.png` }).fromDataURL(dataUrl).add(false);
        // Wait for the image to decode (width is 0 until then), at most 5 s
        for (let i = 0; i < 50 && !(texture.width > 0); i++) {
            await new Promise(r => setTimeout(r, 100));
        }
        // @ts-ignore - Format is a global from Blockbench
        const isHytale = typeof Format !== 'undefined' && Format && String(Format.id || '').startsWith('hytale');
        if (isHytale && texture.width > 0) {
            texture.uv_width = texture.width;
            texture.uv_height = texture.height;
        }
        // @ts-ignore - Canvas is a global from Blockbench
        if (typeof Canvas !== 'undefined' && Canvas.updateAll) Canvas.updateAll();
        return true;
    } catch (error) {
        console.warn('[Myrlin Browser] Texture import failed:', error);
        return false;
    }
}

/**
 * Download and import a gallery model (and its texture).
 */
async function importGalleryItem(item: GalleryItem, autoOptimize: boolean = false): Promise<boolean> {
    if (!item.isFree) {
        // @ts-ignore
        Blockbench.showMessageBox({
            title: 'Get this model on Myrlin',
            message: `"${item.name}" is a paid model. Get it on forge.myrlin.io, then open the downloaded file here.`,
            icon: 'info'
        });
        return false;
    }
    if (!item.blockymodelUrl) {
        // @ts-ignore
        Blockbench.showMessageBox({
            title: 'Import Failed',
            message: `"${item.name}" has no Hytale model file to import.`,
            icon: 'error'
        });
        return false;
    }
    const ok = await importBlockyModel(item.blockymodelUrl, item.name, autoOptimize, opensAsProp(item));
    if (ok && item.textureUrl) {
        const textured = await importTexture(item.textureUrl, item.name);
        if (!textured) {
            // @ts-ignore
            Blockbench.showQuickMessage('Model imported, but its texture could not be downloaded.', 3000);
        }
    }
    return ok;
}

/**
 * Download and import a blockymodel file
 */
async function importBlockyModel(url: string, name: string, autoOptimize: boolean = false, asProp: boolean = false): Promise<boolean> {
    try {
        // Check if Hytale format is available (before downloading)
        // @ts-ignore
        if (!Formats.hytale_character && !Formats.hytale_prop) {
            // @ts-ignore
            Blockbench.showMessageBox({
                title: 'Hytale Plugin Required',
                message: 'Please install the official Hytale Models plugin (File > Plugins) to import .blockymodel files.',
                icon: 'warning'
            });
            return false;
        }

        // @ts-ignore - Blockbench global
        Blockbench.showQuickMessage(`Downloading ${name}...`, 2000);

        // Through the API's file proxy: the storage link itself has no CORS for Blockbench
        const response = await fetch(/^https:\/\/api\.myrlin\.io\//.test(url) ? url : proxiedFileUrl(url));

        if (!response.ok) {
            throw new Error(response.status === 403 || response.status === 410
                ? 'the download link expired; close and reopen the Model Browser'
                : `download failed (${response.status})`);
        }

        const data = await response.json();

        // @ts-ignore
        const codec = typeof Codecs !== 'undefined' ? Codecs.blockymodel : null;
        if (!codec) {
            throw new Error('the Hytale Models plugin has no blockymodel codec loaded');
        }

        // The codec opens its own project and picks Hytale Prop or Character from
        // the file ("format" key), else from a "Blocks" folder in the path;
        // 3.4.0 opened an extra empty Character project first.
        const safeName = String(name).replace(/[\\/:*?"<>|]+/g, ' ').trim() || 'model';
        const path = asProp ? `Blocks/${safeName}.blockymodel` : `${safeName}.blockymodel`;
        codec.load(data, { path, no_file: true });
        // @ts-ignore - Project is a global from Blockbench
        if (typeof Project !== 'undefined' && Project) Project.name = safeName;

        // Auto-optimize if requested
        if (autoOptimize) {
            // @ts-ignore
            Blockbench.showQuickMessage('Optimizing model...', 1500);
            setTimeout(() => {
                const result = optimizeBoxes();
                // @ts-ignore
                Blockbench.showQuickMessage(result.message, 3000);
            }, 500);
        }

        // @ts-ignore
        Blockbench.showQuickMessage(`Imported: ${name}`, 2000);
        return true;
    } catch (error) {
        console.error('[Myrlin Browser] Import failed:', error);
        // @ts-ignore
        Blockbench.showMessageBox({
            title: 'Import Failed',
            message: `Could not import model: ${error.message}`,
            icon: 'error'
        });
        return false;
    }
}

/**
 * Show the model browser dialog
 */
export function showModelBrowser(): void {
    // @ts-ignore
    const dialog = new Dialog({
        id: 'myrlin_model_browser',
        title: "Myrlin Model Browser",
        width: 800,
        singleButton: false,
        component: {
            template: `
                <div class="myrlin-browser">
                    <div class="myrlin-browser-header">
                        <div class="myrlin-browser-search">
                            <input
                                type="text"
                                v-model="searchQuery"
                                placeholder="Search models..."
                                @input="debouncedSearch"
                            />
                        </div>
                        <div class="myrlin-browser-filters">
                            <select v-model="selectedCategory" @change="loadItems">
                                <option value="">All Categories</option>
                                <option v-for="c in categories" :key="c.name" :value="c.name">{{ c.name }} ({{ c.count }})</option>
                            </select>
                        </div>
                        <label class="myrlin-browser-option" title="Merges only boxes whose paint stays the same; painted Myrlin models usually have nothing to merge">
                            <input type="checkbox" v-model="autoOptimize" />
                            Auto-optimize on import
                        </label>
                    </div>

                    <div class="myrlin-browser-content">
                        <div v-if="loading && items.length === 0" class="myrlin-browser-loading">
                            Loading models...
                        </div>

                        <div v-else-if="error && items.length === 0" class="myrlin-browser-empty">
                            <p>{{ error }}</p>
                            <p><button class="myrlin-btn-link" @click="loadItems">Try again</button></p>
                            <p>Browse the gallery at <a href="${MYRLIN_GALLERY}" target="_blank">forge.myrlin.io</a></p>
                        </div>

                        <div v-else-if="items.length === 0" class="myrlin-browser-empty">
                            <p>No models found.</p>
                            <p>Browse the full gallery at <a href="${MYRLIN_GALLERY}" target="_blank">forge.myrlin.io</a></p>
                        </div>

                        <div v-else class="myrlin-browser-grid">
                            <div
                                v-for="item in items"
                                :key="item.id"
                                class="myrlin-browser-item"
                                :class="{ selected: selectedItem?.id === item.id }"
                                @click="selectItem(item)"
                                @dblclick="importItem(item)"
                            >
                                <div class="myrlin-browser-thumbnail">
                                    <img :src="item.thumbnailUrl" :alt="item.name" />
                                </div>
                                <div class="myrlin-browser-item-info">
                                    <div class="myrlin-browser-item-name">{{ item.name }}</div>
                                    <div class="myrlin-browser-item-meta">
                                        <span class="myrlin-browser-item-boxes" v-if="item.boxCount">{{ item.boxCount }} boxes</span>
                                        <span class="myrlin-browser-item-category">{{ item.category || item.gameTarget }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="myrlin-browser-footer">
                        <div class="myrlin-browser-selected" v-if="selectedItem">
                            Selected: <strong>{{ selectedItem.name }}</strong>
                            <span v-if="selectedItem.boxCount">({{ selectedItem.boxCount }} boxes)</span>
                        </div>
                        <button v-if="hasMore && items.length > 0" @click="loadMore" :disabled="loading" class="myrlin-btn-link">
                            {{ loading ? 'Loading...' : 'Load more' }}
                        </button>
                        <div class="myrlin-browser-actions">
                            <button @click="openGallery" class="myrlin-btn-link">
                                Browse Full Gallery
                            </button>
                            <button
                                @click="importSelected"
                                :disabled="!selectedItem || importing"
                                class="myrlin-btn-primary"
                            >
                                Import Model
                            </button>
                        </div>
                    </div>
                </div>
            `,
            data() {
                return {
                    items: [] as GalleryItem[],
                    categories: [] as Array<{ name: string; count: number }>,
                    selectedItem: null as GalleryItem | null,
                    selectedCategory: '',
                    searchQuery: '',
                    // Off by default: Optimize leaves painted boxes alone, and Myrlin models are painted
                    autoOptimize: false,
                    loading: false,
                    importing: false,
                    error: '',
                    page: 1,
                    hasMore: false,
                    requestId: 0,
                    searchTimeout: null as any
                };
            },
            methods: {
                async loadItems() {
                    // A newer search wins over a slower older one
                    const requestId = ++this.requestId;
                    this.loading = true;
                    this.error = '';
                    this.page = 1;
                    this.items = [];
                    this.selectedItem = null;
                    const result = await fetchGalleryPage(
                        this.selectedCategory || undefined,
                        this.searchQuery || undefined,
                        1
                    );
                    if (requestId !== this.requestId) return;
                    this.items = result.items;
                    this.hasMore = result.hasMore;
                    this.error = result.error || '';
                    this.loading = false;
                },
                async loadMore() {
                    if (this.loading || !this.hasMore) return;
                    const requestId = this.requestId;
                    this.loading = true;
                    const result = await fetchGalleryPage(
                        this.selectedCategory || undefined,
                        this.searchQuery || undefined,
                        this.page + 1
                    );
                    if (requestId !== this.requestId) return;
                    if (!result.error) {
                        this.page += 1;
                        this.items = this.items.concat(result.items);
                        this.hasMore = result.hasMore;
                    } else {
                        // @ts-ignore
                        Blockbench.showQuickMessage(result.error, 3000);
                    }
                    this.loading = false;
                },
                selectItem(item: GalleryItem) {
                    this.selectedItem = item;
                },
                async importItem(item: GalleryItem) {
                    if (this.importing) return;
                    this.importing = true;
                    try {
                        const success = await importGalleryItem(item, this.autoOptimize);
                        if (success) {
                            dialog.close();
                        }
                    } finally {
                        this.importing = false;
                    }
                },
                importSelected() {
                    if (this.selectedItem) {
                        this.importItem(this.selectedItem);
                    }
                },
                openGallery() {
                    // @ts-ignore
                    Blockbench.openLink(MYRLIN_GALLERY);
                },
                debouncedSearch() {
                    if (this.searchTimeout) {
                        clearTimeout(this.searchTimeout);
                    }
                    this.searchTimeout = setTimeout(() => {
                        this.loadItems();
                    }, 300);
                }
            },
            mounted() {
                this.loadItems();
                fetchGalleryCategories().then(categories => {
                    this.categories = categories;
                });
            }
        }
    });

    dialog.show();
}

// Browser CSS - injected once in setupBrowser(), not per dialog open
const BROWSER_CSS = `
        .myrlin-browser {
            display: flex;
            flex-direction: column;
            height: 500px;
            gap: 12px;
        }

        .myrlin-browser-header {
            display: flex;
            gap: 12px;
            align-items: center;
            flex-wrap: wrap;
        }

        .myrlin-browser-search {
            flex: 1;
            min-width: 200px;
        }

        .myrlin-browser-search input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid var(--color-border);
            border-radius: 4px;
            background: var(--color-back);
            color: var(--color-text);
        }

        .myrlin-browser-filters select {
            padding: 8px 12px;
            border: 1px solid var(--color-border);
            border-radius: 4px;
            background: var(--color-back);
            color: var(--color-text);
        }

        .myrlin-browser-option {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            color: var(--color-subtle_text);
        }

        .myrlin-browser-content {
            flex: 1;
            overflow-y: auto;
            border: 1px solid var(--color-border);
            border-radius: 4px;
            background: var(--color-back);
        }

        .myrlin-browser-loading,
        .myrlin-browser-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: var(--color-subtle_text);
        }

        .myrlin-browser-empty a {
            color: var(--color-accent);
        }

        .myrlin-browser-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 12px;
            padding: 12px;
        }

        .myrlin-browser-item {
            border: 2px solid transparent;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            transition: border-color 0.15s, transform 0.15s;
            background: var(--color-button);
        }

        .myrlin-browser-item:hover {
            border-color: var(--color-border);
            transform: translateY(-2px);
        }

        .myrlin-browser-item.selected {
            border-color: var(--color-accent);
        }

        .myrlin-browser-thumbnail {
            aspect-ratio: 1;
            background: var(--color-back);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .myrlin-browser-thumbnail img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }

        .myrlin-browser-item-info {
            padding: 8px;
        }

        .myrlin-browser-item-name {
            font-weight: 500;
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .myrlin-browser-item-meta {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: var(--color-subtle_text);
            margin-top: 4px;
        }

        .myrlin-browser-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
        }

        .myrlin-browser-selected {
            font-size: 12px;
            color: var(--color-subtle_text);
        }

        .myrlin-browser-actions {
            display: flex;
            gap: 8px;
        }

        .myrlin-btn-link {
            background: transparent;
            border: 1px solid var(--color-border);
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            color: var(--color-text);
        }

        .myrlin-btn-link:hover {
            border-color: var(--color-accent);
            color: var(--color-accent);
        }

        .myrlin-btn-primary {
            background: var(--color-accent);
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            color: white;
            font-weight: 500;
        }

        .myrlin-btn-primary:hover:not(:disabled) {
            filter: brightness(1.1);
        }

        .myrlin-btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
`;

/**
 * Setup browser action and inject CSS once
 */
export function setupBrowser(): void {
    // Inject CSS once on plugin load, not per dialog open
    // @ts-ignore
    const browserCSS = Blockbench.addCSS(BROWSER_CSS);
    track({ delete: () => browserCSS.delete() });
    const browserAction = new Action('myrlin_model_browser', {
        name: "Model Browser",
        description: "Browse and import models from Myrlin gallery (Myrlin's Tools)",
        icon: 'view_module',
        category: 'tools',
        click: () => {
            showModelBrowser();
        }
    });
    // @ts-ignore
    track(browserAction);

    // Add to menu
    // @ts-ignore
    MenuBar.addAction(browserAction, 'tools');
}
