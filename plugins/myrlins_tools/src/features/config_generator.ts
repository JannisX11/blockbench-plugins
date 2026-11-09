/**
 * Config Generator - Export models with JSON configs as a Hytale mod package
 *
 * Generates a .zip archive containing:
 *   - manifest.json (mod metadata)
 *   - Server/{type}/{id}.json (item/block/entity config)
 *   - Common/Models/{type}/{id}.blockymodel (the model file)
 *   - Common/Textures/{type}/{id}.png (the texture file)
 *
 * Supports Items, Blocks, and Entities with Hytale-compatible JSON configs.
 */

import { track } from '../utils/cleanup';

// =========================================
// Types
// =========================================

type AssetType = 'Item' | 'Block' | 'Entity';

type ItemQuality = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

type ItemCategory = 'Sword' | 'Axe' | 'Pickaxe' | 'Bow' | 'Shield' | 'Tool' | 'Misc';

interface ConfigFormResult {
    assetType: AssetType;
    assetId: string;
    displayName: string;
    modName: string;
    quality: ItemQuality;
    category: ItemCategory;
}

// =========================================
// Config Templates
// =========================================

/**
 * Generate Item config JSON matching Hytale's item definition format
 */
function generateItemConfig(form: ConfigFormResult): object {
    return {
        TranslationProperties: {
            Name: `server.items.${form.assetId}.name`
        },
        Categories: [`Items.${form.category}`],
        Scale: 1.0,
        Model: `Models/Items/${form.assetId}/${form.assetId}.blockymodel`,
        Texture: `Textures/Items/${form.assetId}/${form.assetId}.png`,
        Icon: `Icons/Items/${form.assetId}.png`,
        Quality: form.quality,
        Tags: {
            Type: [form.category]
        }
    };
}

/**
 * Generate Block config JSON matching Hytale's block definition format
 */
function generateBlockConfig(form: ConfigFormResult): object {
    return {
        Id: `${form.modName}:${form.assetId}`,
        DisplayName: {
            en: form.displayName
        },
        BlockType: {
            Material: 'Solid',
            DrawType: 'Cube',
            Textures: [
                { All: `Textures/Blocks/${form.assetId}.png` }
            ],
            BlockSoundSetId: 'stone'
        }
    };
}

/**
 * Generate Entity config JSON matching Hytale's creature definition format
 */
function generateEntityConfig(form: ConfigFormResult): object {
    return {
        Id: `${form.modName}:${form.assetId}`,
        DisplayName: {
            en: form.displayName
        },
        ModelId: `Models/Creatures/${form.assetId}/${form.assetId}.blockymodel`,
        TextureId: `Textures/Creatures/${form.assetId}/${form.assetId}.png`,
        Stats: {
            Health: 20,
            Speed: 0.25
        },
        Behavior: {
            Type: 'Creature'
        }
    };
}

// =========================================
// Manifest Generation
// =========================================

/**
 * Generate the manifest.json for the mod package
 */
function generateManifest(form: ConfigFormResult): object {
    return {
        name: form.modName,
        version: '1.0.0',
        description: `Mod package containing ${form.displayName} (${form.assetType})`,
        author: 'Myrlin Forge',
        assets: [
            {
                type: form.assetType.toLowerCase(),
                id: form.assetId,
                displayName: form.displayName
            }
        ]
    };
}

// =========================================
// Asset Path Helpers
// =========================================

/**
 * Determine the model directory path based on asset type
 */
function getModelPath(assetType: AssetType, assetId: string): string {
    switch (assetType) {
        case 'Item':
            return `Common/Models/Items/${assetId}/${assetId}.blockymodel`;
        case 'Block':
            return `Common/Models/Blocks/${assetId}/${assetId}.blockymodel`;
        case 'Entity':
            return `Common/Models/Creatures/${assetId}/${assetId}.blockymodel`;
        default:
            return `Common/Models/${assetId}/${assetId}.blockymodel`;
    }
}

/**
 * Determine the texture directory path based on asset type
 */
function getTexturePath(assetType: AssetType, assetId: string): string {
    switch (assetType) {
        case 'Item':
            return `Common/Textures/Items/${assetId}/${assetId}.png`;
        case 'Block':
            return `Common/Textures/Blocks/${assetId}.png`;
        case 'Entity':
            return `Common/Textures/Creatures/${assetId}/${assetId}.png`;
        default:
            return `Common/Textures/${assetId}/${assetId}.png`;
    }
}

/**
 * Determine the config JSON path based on asset type
 */
function getConfigPath(assetType: AssetType, assetId: string): string {
    switch (assetType) {
        case 'Item':
            return `Server/Item/Items/${assetId}.json`;
        case 'Block':
            return `Server/Block/Blocks/${assetId}.json`;
        case 'Entity':
            return `Server/Entity/Entities/${assetId}.json`;
        default:
            return `Server/${assetId}.json`;
    }
}

// =========================================
// Texture Extraction
// =========================================

/**
 * Convert a data URL to a Uint8Array for inclusion in the zip
 */
function dataUrlToUint8Array(dataUrl: string): Uint8Array {
    const base64 = dataUrl.split(',')[1];
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

/**
 * Extract the first texture from the model as a PNG Uint8Array.
 * Returns null if no texture is available.
 */
function extractTextureData(): Uint8Array | null {
    // @ts-ignore - Texture is a global from Blockbench
    const texture = Texture.all[0];
    if (!texture) {
        return null;
    }

    try {
        const dataUrl = texture.canvas.toDataURL('image/png');
        return dataUrlToUint8Array(dataUrl);
    } catch (e) {
        console.warn("[Myrlin's Tools] Failed to extract texture data:", e);
        return null;
    }
}

// =========================================
// ZIP Package Generation
// =========================================

/**
 * Build the zip archive and trigger a download via saveAs
 */
async function generateModPackage(form: ConfigFormResult): Promise<void> {
    // Generate the config JSON based on asset type
    let config: object;
    switch (form.assetType) {
        case 'Item':
            config = generateItemConfig(form);
            break;
        case 'Block':
            config = generateBlockConfig(form);
            break;
        case 'Entity':
            config = generateEntityConfig(form);
            break;
        default:
            config = generateItemConfig(form);
    }

    // Generate manifest
    const manifest = generateManifest(form);

    // Get model data
    // @ts-ignore - Codecs is a global from Blockbench
    const modelData = Codecs.blockymodel ? Codecs.blockymodel.compile() : JSON.stringify({});

    // Get texture data
    const textureData = extractTextureData();

    // Build the zip using JSZip (globally available in Blockbench)
    // @ts-ignore - JSZip is a global in Blockbench
    const zip = new JSZip();

    // Add manifest
    zip.file('manifest.json', JSON.stringify(manifest, null, 2));

    // Add config JSON at the appropriate server path
    const configPath = getConfigPath(form.assetType, form.assetId);
    zip.file(configPath, JSON.stringify(config, null, 2));

    // Add model file at the common models path
    const modelPath = getModelPath(form.assetType, form.assetId);
    zip.file(modelPath, typeof modelData === 'string' ? modelData : JSON.stringify(modelData, null, 2));

    // Add texture file at the common textures path (if available)
    const texturePath = getTexturePath(form.assetType, form.assetId);
    if (textureData) {
        zip.file(texturePath, textureData);
    }

    // Generate the zip blob
    const blob = await zip.generateAsync({ type: 'blob' });

    // Download the zip file
    const filename = `${form.modName}.zip`;

    try {
        // @ts-ignore - Blockbench.export may work for zip blobs
        Blockbench.export({
            type: 'Zip Archive',
            extensions: ['zip'],
            name: filename,
            content: blob,
            savetype: 'zip'
        });
    } catch (_exportError) {
        // Fallback: use saveAs from file-saver (also available in Blockbench)
        try {
            // @ts-ignore - saveAs is a global from file-saver in Blockbench
            saveAs(blob, filename);
        } catch (saveError) {
            console.error("[Myrlin's Tools] Failed to save zip:", saveError);
            // @ts-ignore - Blockbench is a global
            Blockbench.showMessageBox({
                title: 'Export Failed',
                message: `Failed to save the mod package. Error: ${saveError}`,
                icon: 'error'
            });
        }
    }
}

// =========================================
// Dialog & Action Setup
// =========================================

/**
 * Show the config generator dialog with form fields for the user
 */
function showConfigDialog(): void {
    // @ts-ignore - Dialog is a global from Blockbench
    new Dialog({
        id: 'myrlin_config_generator_dialog',
        title: "Export Hytale Mod Package - Myrlin's Tools",
        form: {
            assetType: {
                label: 'Asset Type',
                type: 'select',
                options: {
                    Item: 'Item',
                    Block: 'Block',
                    Entity: 'Entity'
                },
                value: 'Item'
            },
            assetId: {
                label: 'Asset ID',
                type: 'text',
                placeholder: 'e.g., crystal_sword',
                value: ''
            },
            displayName: {
                label: 'Display Name',
                type: 'text',
                placeholder: 'e.g., Crystal Sword',
                value: ''
            },
            modName: {
                label: 'Mod Name',
                type: 'text',
                placeholder: 'e.g., my_weapons_mod',
                value: ''
            },
            quality: {
                label: 'Quality (Items only)',
                type: 'select',
                options: {
                    Common: 'Common',
                    Uncommon: 'Uncommon',
                    Rare: 'Rare',
                    Epic: 'Epic',
                    Legendary: 'Legendary'
                },
                value: 'Common'
            },
            category: {
                label: 'Category (Items only)',
                type: 'select',
                options: {
                    Sword: 'Sword',
                    Axe: 'Axe',
                    Pickaxe: 'Pickaxe',
                    Bow: 'Bow',
                    Shield: 'Shield',
                    Tool: 'Tool',
                    Misc: 'Misc'
                },
                value: 'Sword'
            }
        },
        onConfirm: (formResult: Record<string, string>) => {
            // Validate required fields
            if (!formResult.assetId || formResult.assetId.trim() === '') {
                // @ts-ignore - Blockbench is a global
                Blockbench.showQuickMessage('Asset ID is required.', 2000);
                return;
            }
            if (!formResult.displayName || formResult.displayName.trim() === '') {
                // @ts-ignore
                Blockbench.showQuickMessage('Display Name is required.', 2000);
                return;
            }
            if (!formResult.modName || formResult.modName.trim() === '') {
                // @ts-ignore
                Blockbench.showQuickMessage('Mod Name is required.', 2000);
                return;
            }

            // Sanitize the asset ID (lowercase, underscores only)
            const sanitizedId = formResult.assetId.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');

            const configForm: ConfigFormResult = {
                assetType: formResult.assetType as AssetType,
                assetId: sanitizedId,
                displayName: formResult.displayName.trim(),
                modName: formResult.modName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'),
                quality: formResult.quality as ItemQuality,
                category: formResult.category as ItemCategory
            };

            // Generate and download the mod package
            generateModPackage(configForm)
                .then(() => {
                    // @ts-ignore - Blockbench is a global
                    Blockbench.showQuickMessage(
                        `Mod package "${configForm.modName}.zip" exported successfully!`,
                        3000
                    );
                })
                .catch((err: Error) => {
                    console.error("[Myrlin's Tools] Config generator error:", err);
                    // @ts-ignore
                    Blockbench.showMessageBox({
                        title: 'Export Error',
                        message: `Failed to generate mod package: ${err.message}`,
                        icon: 'error'
                    });
                });
        }
    }).show();
}

// =========================================
// Public Setup
// =========================================

/**
 * Initialize the Config Generator action and register it in the file menu.
 *
 * Call this from the plugin's onload() to enable the "Export Hytale Mod Package"
 * menu item under File.
 */
export function setupConfigGenerator(): void {
    // @ts-ignore - Action is a global from Blockbench
    const configGeneratorAction = new Action('myrlin_config_generator', {
        name: 'Export Hytale Mod Package',
        description: "Export model with JSON configs as a Hytale mod package (.zip) (Myrlin's Tools)",
        icon: 'inventory_2',
        category: 'file',
        condition: () => {
            // @ts-ignore - Cube is a global from Blockbench
            return Cube.all.length > 0;
        },
        click: () => {
            showConfigDialog();
        }
    });

    // Track the action for cleanup on plugin unload
    // @ts-ignore
    track(configGeneratorAction);

    // Register in the File menu
    // @ts-ignore - MenuBar is a global from Blockbench
    MenuBar.addAction(configGeneratorAction, 'file');
}
