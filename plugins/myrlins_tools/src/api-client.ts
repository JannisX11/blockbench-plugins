/**
 * Myrlin API Client for Blockbench plugin
 *
 * Handles communication with the Myrlin backend for validation,
 * repair, and export operations. Falls back to local-only mode
 * when the API is unreachable.
 */

import { countHytaleNodesInJson } from './utils/hytale_nodes';

// 3.4.3: empty in the store edition (src/edition.d.ts), which makes no network call at all.
const MYRLIN_API = (typeof MYRLIN_STORE_EDITION !== 'undefined' && MYRLIN_STORE_EDITION === true) ? '' : 'https://api.myrlin.io';
const API_TIMEOUT = 10000; // 10s timeout
const HEALTH_TIMEOUT = 3000; // 3s for connection check

/** Severity levels for validation issues */
type Severity = 'error' | 'warning' | 'info';

/** A single validation issue found in a model */
interface ValidationIssue {
    severity: Severity;
    code: string;
    message: string;
    location?: string;
    auto_fixable: boolean;
}

/** Full validation report from the API */
interface ValidationReport {
    valid: boolean;
    issues: ValidationIssue[];
    summary: Record<string, number>;
}

/** Result from a repair operation */
interface RepairResult {
    success: boolean;
    model_data: Record<string, unknown> | null;
    repairs_applied: string[];
    message: string;
}

/** Result from an export operation */
interface ExportResult {
    success: boolean;
    data: string | null;
    format: string;
    message: string;
}

/**
 * Performs basic local validation when the API is unreachable.
 * Checks node count, zero-size cuboids, and structural integrity.
 *
 * @param modelData - The model data object to validate
 * @returns A ValidationReport with any issues found locally
 */
function localValidation(modelData: Record<string, unknown>): ValidationReport {
    const issues: ValidationIssue[] = [];
    console.log('[Myrlin Validate] Starting local validation. Keys:', Object.keys(modelData));

    // Detect format: blockymodel (nodes[]) or bbmodel (elements[] + outliner[])
    const nodes = modelData.nodes as unknown[] | undefined;
    const elements = modelData.elements as unknown[] | undefined;
    const outliner = modelData.outliner as unknown[] | undefined;

    const isBbmodel = !nodes && Array.isArray(elements);
    const isBlockymodel = Array.isArray(nodes);

    console.log('[Myrlin Validate] Format:', isBbmodel ? 'bbmodel' : isBlockymodel ? 'blockymodel' : 'unknown');
    console.log('[Myrlin Validate] elements:', elements?.length || 0, 'nodes:', nodes?.length || 0, 'outliner:', outliner?.length || 0);

    if (!isBlockymodel && !isBbmodel) {
        issues.push({
            severity: 'error',
            code: 'UNKNOWN_FORMAT',
            message: 'Model has no "nodes" array (blockymodel) or "elements" array (bbmodel). Is a model open?',
            auto_fixable: false,
        });
        console.log('[Myrlin Validate] FAIL: unknown format');
        return {
            valid: false,
            issues,
            summary: { error: 1, warning: 0, info: 0 },
        };
    }

    // Count total elements (cubes + groups for bbmodel)
    const cubeCount = elements?.length || 0;
    // Count groups from outliner
    let groupCount = 0;
    function countGroups(entries: any[]): void {
        for (const e of entries) {
            if (typeof e === 'object' && e !== null && e.children) {
                groupCount++;
                countGroups(e.children);
            }
        }
    }
    if (outliner) countGroups(outliner);
    // Hytale nodes by the shared rule (utils/hytale_nodes): until 3.4.1 a .bbmodel counted
    // every cube plus every group and a .blockymodel only its top-level nodes
    const sharedCount = countHytaleNodesInJson(modelData);
    const totalNodes = sharedCount !== null ? sharedCount : (isBbmodel ? (cubeCount + groupCount) : (nodes?.length || 0));

    console.log('[Myrlin Validate] Total nodes:', totalNodes, '(cubes:', cubeCount, 'groups:', groupCount, ')');

    // Check 1: Node count limit (Hytale max is 255; a group's first unrotated cube is free)
    if (totalNodes > 255) {
        issues.push({
            severity: 'error',
            code: 'NODE_LIMIT',
            message: `Model has ${totalNodes} nodes, exceeds Hytale limit of 255`,
            auto_fixable: false,
        });
    } else if (totalNodes > 200) {
        issues.push({
            severity: 'warning',
            code: 'NODE_COUNT_HIGH',
            message: `Model has ${totalNodes} nodes, approaching Hytale limit of 255`,
            auto_fixable: false,
        });
    }

    // Check 2: Zero-size cuboids
    const checkItems = isBbmodel ? (elements || []) : (nodes || []);
    for (let i = 0; i < checkItems.length; i++) {
        const node = checkItems[i] as Record<string, unknown> | undefined;
        if (!node) continue;

        const from = node.from as number[] | undefined;
        const to = node.to as number[] | undefined;
        if (from && to && Array.isArray(from) && Array.isArray(to) && from.length >= 3 && to.length >= 3) {
            const dx = Math.abs(to[0] - from[0]);
            const dy = Math.abs(to[1] - from[1]);
            const dz = Math.abs(to[2] - from[2]);
            // Only flag as zero-size if ALL three dims are zero (truly degenerate)
            // One zero dimension is a quad (flat plane) which is intentional in Hytale
            const zeroCount = (dx === 0 ? 1 : 0) + (dy === 0 ? 1 : 0) + (dz === 0 ? 1 : 0);
            if (zeroCount >= 2) {
                // Two or more zero dims = degenerate (line or point)
                issues.push({
                    severity: 'warning',
                    code: 'DEGENERATE_SHAPE',
                    message: `"${(node.name as string) || 'unnamed'}" has ${zeroCount} zero dimensions (${dx.toFixed(1)} x ${dy.toFixed(1)} x ${dz.toFixed(1)})`,
                    location: (node.name as string) || `element[${i}]`,
                    auto_fixable: false, // 3.4.3: nothing repairs this yet (see repair() below)
                });
            }

            // Check 3: Extreme aspect ratios (> 50:1)
            if (from && to && dx > 0 && dy > 0 && dz > 0) {
                const dims = [dx, dy, dz].sort((a, b) => a - b);
                const ratio = dims[2] / dims[0];
                if (ratio > 50) {
                    issues.push({
                        severity: 'error',
                        code: 'EXTREME_ASPECT_RATIO',
                        message: `"${(node.name as string) || 'unnamed'}" has ${ratio.toFixed(0)}:1 aspect ratio (max 50:1)`,
                        location: (node.name as string) || `element[${i}]`,
                        auto_fixable: false, // 3.4.3: nothing repairs this yet (see repair() below)
                    });
                }
            }
        }
    }

    // Check 4: Naming conventions
    const allNames: string[] = [];
    for (const item of checkItems) {
        const n = item as Record<string, unknown>;
        if (n && n.name) allNames.push(n.name as string);
    }
    // Check outliner groups too
    function collectGroupNames(entries: any[]): void {
        if (!entries) return;
        for (const e of entries) {
            if (typeof e === 'object' && e !== null) {
                if (e.name) allNames.push(e.name);
                if (e.children) collectGroupNames(e.children);
            }
        }
    }
    if (outliner) collectGroupNames(outliner);

    // Check for non-PascalCase names (info level)
    const pascalRe = /^[A-Z][A-Za-z0-9]*([_-][A-Z0-9][A-Za-z0-9]*)*$/;
    let namingIssues = 0;
    for (const name of allNames) {
        if (name && !pascalRe.test(name) && name !== 'cube' && name !== 'group') {
            namingIssues++;
            if (namingIssues <= 5) { // Don't flood with naming issues
                issues.push({
                    severity: 'info',
                    code: 'NAMING',
                    message: `"${name}" does not follow PascalCase convention (expected e.g., "L-Arm", "Head", "Blade")`,
                    location: name,
                    auto_fixable: false, // 3.4.3: nothing repairs this yet (see repair() below)
                });
            }
        }
    }
    if (namingIssues > 5) {
        issues.push({
            severity: 'info',
            code: 'NAMING',
            message: `...and ${namingIssues - 5} more naming convention issues`,
            auto_fixable: false, // 3.4.3: nothing repairs this yet (see repair() below)
        });
    }

    // Check 5: Missing standard attachment points (search FULL hierarchy)
    if (cubeCount > 10) { // Likely a creature, not a simple prop
        const allNamesLower = new Set(allNames.map(n => n.toLowerCase()));
        // Also search outliner group names recursively
        function collectAllNames(entries: any[]): void {
            if (!entries) return;
            for (const e of entries) {
                if (typeof e === 'object' && e !== null) {
                    if (e.name) allNamesLower.add((e.name as string).toLowerCase());
                    if (e.children) collectAllNames(e.children);
                }
            }
        }
        if (outliner) collectAllNames(outliner);

        const stdAttachments = ['r-attachment', 'l-attachment'];
        for (const att of stdAttachments) {
            if (!allNamesLower.has(att)) {
                issues.push({
                    severity: 'info',
                    code: 'MISSING_ATTACHMENT',
                    message: `Missing standard attachment point "${att.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('-')}"`,
                    auto_fixable: false, // 3.4.3: nothing repairs this yet (see repair() below)
                });
            }
        }
    }

    // Log all results
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    const infoCount = issues.filter(i => i.severity === 'info').length;
    console.log(`[Myrlin Validate] Done: ${errorCount} errors, ${warningCount} warnings, ${infoCount} info`);
    for (const issue of issues) {
        console.log(`[Myrlin Validate]   [${issue.severity.toUpperCase()}] ${issue.code}: ${issue.message}`);
    }

    return {
        valid: errorCount === 0,
        issues,
        summary: { error: errorCount, warning: warningCount, info: infoCount },
    };
}

/**
 * API client for Myrlin backend services.
 * Provides validate, repair, and export operations with offline fallback.
 */
class MyrlinApiClient {
    private baseUrl: string;
    private online: boolean;

    constructor(baseUrl: string = MYRLIN_API) {
        this.baseUrl = baseUrl;
        this.online = true;
    }

    /**
     * Check if the API is reachable.
     * Pings the /health endpoint with a short timeout.
     *
     * @returns true if the API responded successfully
     */
    async checkConnection(): Promise<boolean> {
        // 3.4.3: the store edition never asks; it is always offline and every tool runs locally. The ping sits inside the
        // guard so the store build has no request in it at all (src/edition.d.ts).
        if (!(typeof MYRLIN_STORE_EDITION !== 'undefined' && MYRLIN_STORE_EDITION === true)) {
            try {
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), HEALTH_TIMEOUT);

                const resp = await fetch(`${this.baseUrl}/health`, {
                    method: 'GET',
                    signal: controller.signal,
                });
                clearTimeout(timer);

                this.online = resp.ok;
            } catch {
                this.online = false;
            }
            return this.online;
        }
        this.online = false;
        return false;
    }

    /**
     * Validate a model against engine-specific rules.
     * Falls back to local validation when the API is unreachable.
     *
     * @param modelData - The model data object to validate
     * @param engine - Target engine for validation rules (default: 'hytale')
     * @returns Validation report with issues and summary
     */
    async validate(modelData: Record<string, unknown>, engine: string = 'hytale'): Promise<ValidationReport> {
        // Always run local validation (works offline, no auth needed)
        // API validation is supplementary, not required
        return localValidation(modelData);
    }

    /**
     * Request repairs on a model (Phase 28 endpoint).
     * Returns a not-available message when offline.
     *
     * @param modelData - The model data object to repair
     * @param repairs - List of repair operation identifiers to apply
     * @returns Repair result with applied changes
     */
    async repair(modelData: Record<string, unknown>, repairs: string[]): Promise<RepairResult> {
        // 3.4.3 (2026-11-09): no edition repairs anything yet. Before, this returned the model unchanged with success true and
        // "Applied N repair(s) locally", so Fix, Fix All and Auto Repair said they had changed the model when they had not.
        // localValidation no longer marks issues fixable, so these buttons do not appear; this answer only guards a stray call.
        // _repair_remote stays for the day the API repair is wired in.
        console.log('[Myrlin Repair] Automatic repair is not available yet:', repairs);
        return {
            success: false,
            model_data: null,
            repairs_applied: [],
            message: 'Automatic repair is not available yet. Validate lists each issue so you can fix it by hand.',
        };
    }

    async _repair_remote(modelData: Record<string, unknown>, repairs: string[]): Promise<RepairResult> {
        if (!this.online) {
            return {
                success: false,
                model_data: null,
                repairs_applied: [],
                message: 'Repair requires an API connection. Check your network and try again.',
            };
        }

        const result = await this._post<RepairResult>('/api/tools/repair', {
            model: modelData,
            repairs,
        });

        if (!result) {
            return {
                success: false,
                model_data: null,
                repairs_applied: [],
                message: 'Repair request failed. The API may be temporarily unavailable.',
            };
        }

        return result;
    }

    /**
     * Export model to a different format (Phase 29 endpoint).
     * Returns a not-available message when offline.
     *
     * @param modelData - The model data object to export
     * @param targetFormat - Target format identifier (e.g. 'blockymodel', 'gltf')
     * @returns Export result with encoded data
     */
    async export(modelData: Record<string, unknown>, targetFormat: string): Promise<ExportResult> {
        // 3.4.3: the store edition has no export dialogs (plugin.ts); this answer only guards a stray call.
        if (typeof MYRLIN_STORE_EDITION !== 'undefined' && MYRLIN_STORE_EDITION === true) {
            return { success: false, data: null, format: targetFormat, message: 'Export to other formats is not part of this edition.' };
        }
        if (!this.online) {
            return {
                success: false,
                data: null,
                format: targetFormat,
                message: 'Export requires an API connection. Check your network and try again.',
            };
        }

        const result = await this._post<ExportResult>('/api/tools/export', {
            model: modelData,
            format: targetFormat,
        });

        if (!result) {
            return {
                success: false,
                data: null,
                format: targetFormat,
                message: 'Export request failed. The API may be temporarily unavailable.',
            };
        }

        return result;
    }

    /**
     * Internal fetch wrapper with timeout and error handling.
     * Sets Content-Type to JSON and uses AbortController for timeout.
     *
     * @param path - API path to POST to (e.g. '/api/tools/validate')
     * @param body - Request body to send as JSON
     * @returns Parsed response or null on failure
     */
    private async _post<T>(path: string, body: Record<string, unknown>): Promise<T | null> {
        // 3.4.3: no request leaves the store edition; the request sits inside the guard so the store build has none.
        if (!(typeof MYRLIN_STORE_EDITION !== 'undefined' && MYRLIN_STORE_EDITION === true)) {
            try {
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), API_TIMEOUT);

                const resp = await fetch(`${this.baseUrl}${path}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                    signal: controller.signal,
                });
                clearTimeout(timer);

                if (!resp.ok) {
                    console.warn(`[Myrlin API] ${path} returned ${resp.status}`);
                    return null;
                }

                const data = await resp.json();
                return data as T;
            } catch (e) {
                console.warn(`[Myrlin API] Request to ${path} failed:`, e);
                return null;
            }
        }
        return null;
    }
}

// Singleton instance
let _client: MyrlinApiClient | null = null;

/**
 * Get the shared API client instance.
 * Creates the singleton on first call.
 *
 * @returns The shared MyrlinApiClient
 */
function getApiClient(): MyrlinApiClient {
    if (!_client) {
        _client = new MyrlinApiClient();
    }
    return _client;
}

export { MyrlinApiClient, getApiClient, ValidationReport, ValidationIssue, RepairResult, ExportResult, Severity };
