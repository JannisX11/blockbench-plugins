/**
 * Art Style Validator - Checks models against Hytale asset requirements
 *
 * Validates node counts, texture resolution, cube stretch limits,
 * bone naming conventions, and pixel-to-unit ratios to ensure
 * models conform to Hytale's art style guidelines.
 */

import { track } from '../utils/cleanup';
import { hytaleNodeBreakdown } from '../utils/hytale_nodes';
import { markdownLinesToElements } from '../utils/dialog_lines';

// =========================================
// Types
// =========================================

/** Severity levels for validation results */
export type ValidationSeverity = 'pass' | 'warn' | 'fail';

/** Individual validation check result */
export interface ValidationResult {
    /** Unique identifier for the check (e.g. 'node_count', 'pixel_ratio') */
    id: string;
    /** Human-readable name of the check */
    name: string;
    /** Whether the check passed, warned, or failed */
    severity: ValidationSeverity;
    /** Summary message (e.g. "128 / 255 nodes") */
    message: string;
    /** Optional extended details for the dialog display */
    details?: string;
}

/** Full validation report containing all check results */
export interface ValidationReport {
    /** Array of individual check results */
    results: ValidationResult[];
    /** Worst severity across all results ('fail' > 'warn' > 'pass') */
    overallSeverity: ValidationSeverity;
    /** ISO timestamp of when the validation was run */
    timestamp: string;
}

// =========================================
// Constants
// =========================================

/** Hytale maximum node limit (cubes + groups combined) */
const HYTALE_MAX_NODES = 255;

/** Warning threshold - approaching the node limit */
const HYTALE_WARN_NODES = 200;

/** Expected pixels per world unit for character format */
const CHARACTER_PIXELS_PER_UNIT = 64;

/** Expected pixels per world unit for prop format */
const PROP_PIXELS_PER_UNIT = 32;

/** Pixel ratio tolerance - warn if off by more than 50% */
const PIXEL_RATIO_TOLERANCE = 0.5;

/** Minimum acceptable stretch ratio (smallest dim / largest dim) */
const MIN_STRETCH_RATIO = 0.7;

/** Maximum acceptable stretch ratio per axis relative to smallest dimension */
const MAX_STRETCH_RATIO = 1.3;

/** Maximum texture dimension before warning */
const MAX_TEXTURE_DIMENSION = 512;

/** Minimum texture dimension before warning */
const MIN_TEXTURE_DIMENSION = 16;

/**
 * Required bone names for character format.
 * Each entry is an array of acceptable variations (case-insensitive matching).
 */
const REQUIRED_CHARACTER_BONES: { canonical: string; variations: string[] }[] = [
    {
        canonical: 'Head',
        variations: ['head']
    },
    {
        canonical: 'Body',
        variations: ['body', 'torso', 'chest']
    },
    {
        canonical: 'Arm_Right',
        variations: ['arm_right', 'armright', 'arm right', 'right_arm', 'rightarm', 'right arm']
    },
    {
        canonical: 'Arm_Left',
        variations: ['arm_left', 'armleft', 'arm left', 'left_arm', 'leftarm', 'left arm']
    },
    {
        canonical: 'Leg_Right',
        variations: ['leg_right', 'legright', 'leg right', 'right_leg', 'rightleg', 'right leg']
    },
    {
        canonical: 'Leg_Left',
        variations: ['leg_left', 'legleft', 'leg left', 'left_leg', 'leftleg', 'left leg']
    }
];

// =========================================
// Helper Utilities
// =========================================

/**
 * Determine the worst (highest priority) severity from two values.
 * Priority: fail > warn > pass
 */
function worstSeverity(a: ValidationSeverity, b: ValidationSeverity): ValidationSeverity {
    const priority: Record<ValidationSeverity, number> = { pass: 0, warn: 1, fail: 2 };
    return priority[a] >= priority[b] ? a : b;
}

/**
 * Check whether the current format is a Hytale character format.
 */
function isCharacterFormat(): boolean {
    // @ts-ignore - Format is a global from Blockbench
    return Format && Format.id && Format.id.toLowerCase().includes('character');
}

/**
 * Check whether the current format is a Hytale prop format.
 */
function isPropFormat(): boolean {
    // @ts-ignore - Format is a global from Blockbench
    return Format && Format.id && Format.id.toLowerCase().includes('prop');
}

/**
 * Check whether a number is a power of two.
 */
function isPowerOfTwo(n: number): boolean {
    return n > 0 && (n & (n - 1)) === 0;
}

/**
 * Get the severity icon for display in the results dialog.
 */
function severityIcon(severity: ValidationSeverity): string {
    switch (severity) {
        case 'pass': return '\u2705'; // green check
        case 'warn': return '\u26A0\uFE0F'; // warning
        case 'fail': return '\u274C'; // red X
    }
}

/**
 * Get the severity label text for display.
 */
function severityLabel(severity: ValidationSeverity): string {
    switch (severity) {
        case 'pass': return 'PASS';
        case 'warn': return 'WARN';
        case 'fail': return 'FAIL';
    }
}

// =========================================
// Validation Checks
// =========================================

/**
 * Check 1: Node Count
 *
 * Counts nodes exactly as Hytale loads them (utils/hytale_nodes, the same
 * rule as the Hytale Models plugin): every exported group is one node, its
 * first exported cube without rotation is free, every other exported cube
 * (root cubes too) is one node.
 *
 * Until 3.4.1 this freed one cube per group that had a cube anywhere below
 * it, which over-freed nested groups and freed rotated cubes.
 *
 * - fail if > 255 nodes
 * - warn if > 200 nodes
 * - pass otherwise
 */
function checkNodeCount(): ValidationResult {
    const tally = hytaleNodeBreakdown();
    const effectiveCount = tally.nodes;

    let severity: ValidationSeverity = 'pass';
    if (effectiveCount > HYTALE_MAX_NODES) {
        severity = 'fail';
    } else if (effectiveCount > HYTALE_WARN_NODES) {
        severity = 'warn';
    }

    const details = `${tally.groups} group(s) + ${tally.cubes - tally.freeCubes} cube(s) = ${effectiveCount} nodes. ` +
        `${tally.freeCubes} cube(s) are free as their group's shape` +
        (tally.rootCubes > 0 ? `; ${tally.rootCubes} cube(s) sit outside any group.` : '.');

    return {
        id: 'node_count',
        name: 'Node Count',
        severity,
        message: `${effectiveCount} / ${HYTALE_MAX_NODES} nodes`,
        details
    };
}

/**
 * Check 2: Pixel Ratio
 *
 * Verifies that texture dimensions match the expected pixels-per-unit
 * for the current format:
 *   - hytale_character: ~64px per unit
 *   - hytale_prop: ~32px per unit
 *
 * Skipped if no texture is present.
 * - warn if ratio is off by more than 50%
 * - pass otherwise
 */
function checkPixelRatio(): ValidationResult {
    // @ts-ignore - Texture is a global from Blockbench
    const textures = Texture.all;
    if (!textures || textures.length === 0) {
        return {
            id: 'pixel_ratio',
            name: 'Pixel Ratio',
            severity: 'pass',
            message: 'Skipped (no texture)',
            details: 'No texture found in the model. This check requires at least one texture.'
        };
    }

    const texture = textures[0];
    const texWidth = texture.width || 0;
    const texHeight = texture.height || 0;

    if (texWidth === 0 || texHeight === 0) {
        return {
            id: 'pixel_ratio',
            name: 'Pixel Ratio',
            severity: 'pass',
            message: 'Skipped (texture has no dimensions)',
            details: 'Texture dimensions could not be determined.'
        };
    }

    // Determine expected ratio based on format
    let expectedRatio = PROP_PIXELS_PER_UNIT; // default
    let formatName = 'prop';

    if (isCharacterFormat()) {
        expectedRatio = CHARACTER_PIXELS_PER_UNIT;
        formatName = 'character';
    } else if (isPropFormat()) {
        expectedRatio = PROP_PIXELS_PER_UNIT;
        formatName = 'prop';
    } else {
        // Not a recognized Hytale format - skip with a note
        return {
            id: 'pixel_ratio',
            name: 'Pixel Ratio',
            severity: 'pass',
            message: 'Skipped (non-Hytale format)',
            details: 'Pixel ratio check only applies to Hytale character and prop formats.'
        };
    }

    // Calculate the actual model extent to determine unit scale
    // @ts-ignore - Cube is a global from Blockbench
    const cubes = Cube.all.filter((c: any) => c.export !== false);
    if (cubes.length === 0) {
        return {
            id: 'pixel_ratio',
            name: 'Pixel Ratio',
            severity: 'pass',
            message: 'Skipped (no cubes)',
            details: 'No exportable cubes found in the model.'
        };
    }

    // Find the overall bounding box of the model
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

    for (const cube of cubes) {
        minX = Math.min(minX, cube.from[0]);
        minY = Math.min(minY, cube.from[1]);
        minZ = Math.min(minZ, cube.from[2]);
        maxX = Math.max(maxX, cube.to[0]);
        maxY = Math.max(maxY, cube.to[1]);
        maxZ = Math.max(maxZ, cube.to[2]);
    }

    // Use the largest dimension as the representative model size (in units)
    const modelSizeUnits = Math.max(maxX - minX, maxY - minY, maxZ - minZ);
    if (modelSizeUnits <= 0) {
        return {
            id: 'pixel_ratio',
            name: 'Pixel Ratio',
            severity: 'pass',
            message: 'Skipped (zero-size model)',
            details: 'Model has zero extent in all dimensions.'
        };
    }

    // Use the larger texture dimension for the ratio calculation
    const maxTexDim = Math.max(texWidth, texHeight);
    const actualRatio = maxTexDim / modelSizeUnits;
    const deviation = Math.abs(actualRatio - expectedRatio) / expectedRatio;

    let severity: ValidationSeverity = 'pass';
    if (deviation > PIXEL_RATIO_TOLERANCE) {
        severity = 'warn';
    }

    const ratioFormatted = actualRatio.toFixed(1);
    return {
        id: 'pixel_ratio',
        name: 'Pixel Ratio',
        severity,
        message: severity === 'pass'
            ? `${ratioFormatted} px/unit (expected ~${expectedRatio} for ${formatName})`
            : `${ratioFormatted} px/unit (expected ~${expectedRatio}, off by ${(deviation * 100).toFixed(0)}%)`,
        details: `Texture: ${texWidth}x${texHeight}, Model extent: ${modelSizeUnits.toFixed(1)} units, ` +
                 `Actual ratio: ${ratioFormatted} px/unit, Expected: ~${expectedRatio} px/unit for ${formatName} format. ` +
                 `Deviation: ${(deviation * 100).toFixed(1)}% (threshold: ${PIXEL_RATIO_TOLERANCE * 100}%).`
    };
}

/**
 * Check 3: Stretch Limits
 *
 * Examines each cube's dimensions to detect excessive stretching.
 * For each cube, we compute the ratio of each dimension to the
 * smallest dimension. If any ratio exceeds MAX_STRETCH_RATIO (1.3x),
 * the cube is flagged.
 *
 * - fail if any cube exceeds 1.3x stretch ratio
 * - pass otherwise
 */
function checkStretchLimits(): ValidationResult {
    // @ts-ignore - Cube is a global from Blockbench
    const cubes = Cube.all.filter((c: any) => c.export !== false);

    if (cubes.length === 0) {
        return {
            id: 'stretch_limits',
            name: 'Stretch Limits',
            severity: 'pass',
            message: 'No cubes to check',
            details: 'No exportable cubes found in the model.'
        };
    }

    const violatingCubes: string[] = [];

    for (const cube of cubes) {
        const sizeX = Math.abs(cube.to[0] - cube.from[0]);
        const sizeY = Math.abs(cube.to[1] - cube.from[1]);
        const sizeZ = Math.abs(cube.to[2] - cube.from[2]);

        // Skip zero-volume cubes (degenerate)
        const minDim = Math.min(sizeX, sizeY, sizeZ);
        if (minDim <= 0) continue;

        const ratioX = sizeX / minDim;
        const ratioY = sizeY / minDim;
        const ratioZ = sizeZ / minDim;

        const maxRatio = Math.max(ratioX, ratioY, ratioZ);

        if (maxRatio > MAX_STRETCH_RATIO) {
            const cubeName = cube.name || cube.uuid || 'unnamed';
            violatingCubes.push(`${cubeName} (${maxRatio.toFixed(2)}x)`);
        }
    }

    const count = violatingCubes.length;

    if (count > 0) {
        // Show up to 5 violating cubes in details
        const shownCubes = violatingCubes.slice(0, 5);
        const moreCount = count - shownCubes.length;
        let detailList = shownCubes.join(', ');
        if (moreCount > 0) {
            detailList += `, and ${moreCount} more`;
        }

        return {
            id: 'stretch_limits',
            name: 'Stretch Limits',
            severity: 'fail',
            message: `${count} cube${count !== 1 ? 's' : ''} exceed stretch limits`,
            details: `Cubes with stretch ratio > ${MAX_STRETCH_RATIO}x (allowed range: ${MIN_STRETCH_RATIO}x - ${MAX_STRETCH_RATIO}x): ${detailList}. ` +
                     `The stretch ratio is the largest dimension divided by the smallest dimension of each cube.`
        };
    }

    return {
        id: 'stretch_limits',
        name: 'Stretch Limits',
        severity: 'pass',
        message: 'All cubes within stretch limits',
        details: `All ${cubes.length} exportable cubes have stretch ratios within the ${MIN_STRETCH_RATIO}x - ${MAX_STRETCH_RATIO}x range.`
    };
}

/**
 * Check 4: Bone Naming (Character Format Only)
 *
 * Verifies that all required standard bone names are present in
 * the model's group hierarchy. Checks case-insensitive and supports
 * common naming variations (e.g. ArmRight, arm_right, Arm_Right).
 *
 * Skipped for non-character formats.
 * - warn if any required bones are missing
 * - pass if all required bones are present
 */
function checkBoneNaming(): ValidationResult {
    if (!isCharacterFormat()) {
        return {
            id: 'bone_naming',
            name: 'Bone Naming',
            severity: 'pass',
            message: 'Skipped (non-character format)',
            details: 'Bone naming validation only applies to Hytale character formats.'
        };
    }

    // @ts-ignore - Group is a global from Blockbench
    const groups = Group.all;
    if (!groups || groups.length === 0) {
        return {
            id: 'bone_naming',
            name: 'Bone Naming',
            severity: 'warn',
            message: 'No bones found',
            details: 'No groups (bones) were found in the model. Character models require standard bone hierarchy.'
        };
    }

    // Collect all group names in lowercase for comparison
    const groupNamesLower = groups.map((g: any) => (g.name || '').toLowerCase().trim());

    const missingBones: string[] = [];
    const foundBones: string[] = [];

    for (const bone of REQUIRED_CHARACTER_BONES) {
        const found = bone.variations.some(variation =>
            groupNamesLower.includes(variation.toLowerCase())
        );

        if (found) {
            foundBones.push(bone.canonical);
        } else {
            missingBones.push(bone.canonical);
        }
    }

    if (missingBones.length > 0) {
        return {
            id: 'bone_naming',
            name: 'Bone Naming',
            severity: 'warn',
            message: `${missingBones.length} required bone${missingBones.length !== 1 ? 's' : ''} missing`,
            details: `Missing: ${missingBones.join(', ')}. Found: ${foundBones.join(', ') || 'none'}. ` +
                     `Required bones for character format: ${REQUIRED_CHARACTER_BONES.map(b => b.canonical).join(', ')}.`
        };
    }

    return {
        id: 'bone_naming',
        name: 'Bone Naming',
        severity: 'pass',
        message: 'All required bones present',
        details: `Found all ${REQUIRED_CHARACTER_BONES.length} required bones: ${foundBones.join(', ')}.`
    };
}

/**
 * Check 5: Texture Resolution
 *
 * Validates that texture dimensions are power-of-two and within
 * a reasonable size range (16 - 512).
 *
 * Skipped if no texture is present.
 * - fail if not power-of-2
 * - warn if unusually large (>512) or small (<16)
 * - pass otherwise
 */
function checkTextureResolution(): ValidationResult {
    // @ts-ignore - Texture is a global from Blockbench
    const textures = Texture.all;
    if (!textures || textures.length === 0) {
        return {
            id: 'texture_resolution',
            name: 'Texture Resolution',
            severity: 'pass',
            message: 'Skipped (no texture)',
            details: 'No texture found in the model. This check requires at least one texture.'
        };
    }

    const texture = textures[0];
    const width = texture.width || 0;
    const height = texture.height || 0;

    if (width === 0 || height === 0) {
        return {
            id: 'texture_resolution',
            name: 'Texture Resolution',
            severity: 'warn',
            message: 'Texture has no dimensions',
            details: 'Texture dimensions could not be determined. Ensure the texture is loaded correctly.'
        };
    }

    // Check power-of-two
    const widthIsPow2 = isPowerOfTwo(width);
    const heightIsPow2 = isPowerOfTwo(height);

    if (!widthIsPow2 || !heightIsPow2) {
        const nonPow2Dims: string[] = [];
        if (!widthIsPow2) nonPow2Dims.push(`width=${width}`);
        if (!heightIsPow2) nonPow2Dims.push(`height=${height}`);

        return {
            id: 'texture_resolution',
            name: 'Texture Resolution',
            severity: 'fail',
            message: `Non-power-of-2: ${width}x${height}`,
            details: `Texture dimensions must be powers of 2 (e.g. 16, 32, 64, 128, 256, 512). ` +
                     `Non-compliant: ${nonPow2Dims.join(', ')}.`
        };
    }

    // Check size range
    const maxDim = Math.max(width, height);
    const minDim = Math.min(width, height);

    if (maxDim > MAX_TEXTURE_DIMENSION) {
        return {
            id: 'texture_resolution',
            name: 'Texture Resolution',
            severity: 'warn',
            message: `Large texture: ${width}x${height} (>${MAX_TEXTURE_DIMENSION})`,
            details: `Texture dimensions (${width}x${height}) exceed the recommended maximum of ${MAX_TEXTURE_DIMENSION}px. ` +
                     `Large textures increase file size and may cause performance issues in Hytale.`
        };
    }

    if (minDim < MIN_TEXTURE_DIMENSION) {
        return {
            id: 'texture_resolution',
            name: 'Texture Resolution',
            severity: 'warn',
            message: `Small texture: ${width}x${height} (<${MIN_TEXTURE_DIMENSION})`,
            details: `Texture dimensions (${width}x${height}) are below the recommended minimum of ${MIN_TEXTURE_DIMENSION}px. ` +
                     `Small textures may lack detail for the model.`
        };
    }

    return {
        id: 'texture_resolution',
        name: 'Texture Resolution',
        severity: 'pass',
        message: `${width}x${height} (power-of-2)`,
        details: `Texture resolution ${width}x${height} is valid: power-of-2 and within the ${MIN_TEXTURE_DIMENSION}-${MAX_TEXTURE_DIMENSION}px recommended range.`
    };
}

// =========================================
// Main Validation Entry Point
// =========================================

/**
 * Run all validation checks against the current model and return
 * a complete ValidationReport.
 *
 * Checks performed:
 *   1. Node Count (cubes + groups vs 255 limit)
 *   2. Pixel Ratio (texture size vs model scale)
 *   3. Stretch Limits (cube dimension ratios)
 *   4. Bone Naming (character format required bones)
 *   5. Texture Resolution (power-of-2, size range)
 */
export function validateModel(): ValidationReport {
    const results: ValidationResult[] = [
        checkNodeCount(),
        checkPixelRatio(),
        checkStretchLimits(),
        checkBoneNaming(),
        checkTextureResolution()
    ];

    // Determine overall severity (worst across all results)
    let overallSeverity: ValidationSeverity = 'pass';
    for (const result of results) {
        overallSeverity = worstSeverity(overallSeverity, result.severity);
    }

    return {
        results,
        overallSeverity,
        timestamp: new Date().toISOString()
    };
}

// =========================================
// Dialog Formatting
// =========================================

/**
 * Build an array of markdown-formatted lines for the results dialog,
 * presenting each validation result in a readable format.
 */
function formatReportLines(report: ValidationReport): string[] {
    const lines: string[] = [];

    // Overall status header
    const overallIcon = severityIcon(report.overallSeverity);
    const overallLabel = severityLabel(report.overallSeverity);
    lines.push(`## ${overallIcon} Overall: **${overallLabel}**`);
    lines.push('');
    lines.push('---');
    lines.push('');

    // Individual results
    for (const result of report.results) {
        const icon = severityIcon(result.severity);
        lines.push(`${icon} **${result.name}**: ${result.message}`);

        if (result.details) {
            lines.push(`  _${result.details}_`);
        }

        lines.push('');
    }

    // Timestamp footer
    lines.push('---');
    lines.push(`_Validated at ${new Date(report.timestamp).toLocaleTimeString()}_`);

    return lines;
}

// =========================================
// Action Registration
// =========================================

/**
 * Register the "Validate Hytale Model" action in Blockbench.
 *
 * Creates:
 *   - An Action (myrlin_validate) in the tools category
 *   - A Dialog displaying formatted validation results
 *   - A menu entry under Tools via MenuBar.addAction
 *
 * Call this function from the plugin's onload() to activate the validator.
 */
export function setupValidator(): void {
    // @ts-ignore - Action is a global from Blockbench
    const validateAction = new Action('myrlin_validate', {
        name: "Validate Hytale Model",
        description: "Check model against Hytale art style requirements (Myrlin's Tools)",
        icon: 'verified',
        category: 'tools',
        click: () => {
            // Run all validation checks
            const report = validateModel();

            // Build dialog content
            const lines = formatReportLines(report);

            // Determine dialog title based on overall result
            let titleSuffix = '';
            switch (report.overallSeverity) {
                case 'pass':
                    titleSuffix = ' - All Checks Passed';
                    break;
                case 'warn':
                    titleSuffix = ' - Warnings Found';
                    break;
                case 'fail':
                    titleSuffix = ' - Issues Found';
                    break;
            }

            // @ts-ignore - Dialog is a global from Blockbench
            new Dialog({
                id: 'myrlin_validate_dialog',
                title: `Validate Hytale Model${titleSuffix}`,
                // Real elements: Blockbench 5 shows string lines as plain text (3.4.0 showed raw markdown)
                lines: markdownLinesToElements(lines),
                buttons: ['Close'],
                onConfirm: () => {
                    // No action needed on close
                }
            }).show();

            // Also show a quick message summarizing the result
            const passCount = report.results.filter(r => r.severity === 'pass').length;
            const warnCount = report.results.filter(r => r.severity === 'warn').length;
            const failCount = report.results.filter(r => r.severity === 'fail').length;

            // @ts-ignore - Blockbench is a global
            Blockbench.showQuickMessage(
                `Validation: ${passCount} passed, ${warnCount} warnings, ${failCount} failed`,
                2000
            );
        }
    });

    // Track the action for cleanup on plugin unload
    // @ts-ignore
    track(validateAction);

    // Add to the Tools menu
    // @ts-ignore - MenuBar is a global from Blockbench
    MenuBar.addAction(validateAction, 'tools');
}
