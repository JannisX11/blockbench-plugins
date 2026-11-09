/**
 * Template Wizard - Create correctly structured Hytale starter models
 *
 * Provides a dialog-based wizard that generates new projects with the
 * correct bone hierarchy, cube geometry, and texture dimensions for
 * common Hytale asset types (weapons, furniture, characters, creatures).
 */

import { track } from '../utils/cleanup';

// =====================================================================
// Blockbench global declarations
// =====================================================================

// @ts-ignore - Formats is a global from Blockbench
declare const Formats: any;
// @ts-ignore - Cube is a global from Blockbench
declare const Cube: any;
// @ts-ignore - Group is a global from Blockbench
declare const Group: any;
// @ts-ignore - Texture is a global from Blockbench
declare const Texture: any;
// @ts-ignore - Project is a global from Blockbench
declare const Project: any;
// @ts-ignore - newProject is a global from Blockbench
declare const newProject: any;
// @ts-ignore - Dialog is a global from Blockbench
declare const Dialog: any;
// @ts-ignore - Action is a global from Blockbench
declare const Action: any;
// @ts-ignore - MenuBar is a global from Blockbench
declare const MenuBar: any;
// @ts-ignore - Blockbench is a global
declare const Blockbench: any;
// @ts-ignore - Undo is a global from Blockbench
declare const Undo: any;
// @ts-ignore - Canvas is a global from Blockbench
declare const Canvas: any;

// =====================================================================
// Template Definitions
// =====================================================================

interface CubeDef {
    name: string;
    /** [x, y, z] offset from parent bone origin */
    from: [number, number, number];
    /** [x, y, z] far corner relative to origin */
    to: [number, number, number];
}

interface BoneDef {
    name: string;
    /** [x, y, z] origin for the bone/group */
    origin: [number, number, number];
    /** Optional cube to create inside this bone */
    cube?: CubeDef;
    /** Child bones */
    children?: BoneDef[];
}

interface TemplateDef {
    /** Display name in the dropdown */
    label: string;
    /** Blockbench format id - 'hytale_prop' or 'hytale_character' */
    format: 'hytale_prop' | 'hytale_character';
    /** Texture width in pixels */
    textureWidth: number;
    /** Texture height in pixels */
    textureHeight: number;
    /** Root-level bone hierarchy */
    bones: BoneDef[];
}

/**
 * Helper: build a cube definition from center position and dimensions.
 * position = center of the cube, size = full width/height/depth.
 */
function cubeDef(
    name: string,
    posX: number,
    posY: number,
    posZ: number,
    sizeX: number,
    sizeY: number,
    sizeZ: number
): CubeDef {
    return {
        name,
        from: [
            posX - sizeX / 2,
            posY - sizeY / 2,
            posZ - sizeZ / 2,
        ],
        to: [
            posX + sizeX / 2,
            posY + sizeY / 2,
            posZ + sizeZ / 2,
        ],
    };
}

// ----- Template catalogue -----

const TEMPLATES: Record<string, TemplateDef> = {
    sword: {
        label: 'Sword',
        format: 'hytale_prop',
        textureWidth: 64,
        textureHeight: 64,
        bones: [
            {
                name: 'R-Attachment',
                origin: [0, 0, 0],
                children: [
                    {
                        name: 'Handle',
                        origin: [0, 6, 0],
                        cube: cubeDef('Handle', 0, 6, 0, 4, 3, 3),
                        children: [
                            {
                                name: 'Blade',
                                origin: [0, 20, 0],
                                cube: cubeDef('Blade', 0, 20, 0, 3, 20, 3),
                            },
                        ],
                    },
                ],
            },
        ],
    },

    axe: {
        label: 'Axe',
        format: 'hytale_prop',
        textureWidth: 64,
        textureHeight: 64,
        bones: [
            {
                name: 'R-Attachment',
                origin: [0, 0, 0],
                children: [
                    {
                        name: 'Handle',
                        origin: [0, 12, 0],
                        cube: cubeDef('Handle', 0, 12, 0, 3, 24, 3),
                        children: [
                            {
                                name: 'Head',
                                origin: [0, 22, 0],
                                cube: cubeDef('Head', 0, 22, 0, 8, 8, 4),
                            },
                        ],
                    },
                ],
            },
        ],
    },

    pickaxe: {
        label: 'Pickaxe',
        format: 'hytale_prop',
        textureWidth: 64,
        textureHeight: 64,
        bones: [
            {
                name: 'R-Attachment',
                origin: [0, 0, 0],
                children: [
                    {
                        name: 'Handle',
                        origin: [0, 12, 0],
                        cube: cubeDef('Handle', 0, 12, 0, 3, 24, 3),
                        children: [
                            {
                                name: 'Head',
                                origin: [0, 24, 0],
                                cube: cubeDef('Head', 0, 24, 0, 12, 6, 4),
                            },
                        ],
                    },
                ],
            },
        ],
    },

    bow: {
        label: 'Bow',
        format: 'hytale_prop',
        textureWidth: 64,
        textureHeight: 64,
        bones: [
            {
                name: 'R-Attachment',
                origin: [0, 0, 0],
                children: [
                    {
                        name: 'Body',
                        origin: [0, 0, 0],
                        cube: cubeDef('Body', 0, 12, 0, 2, 24, 2),
                        children: [
                            {
                                name: 'TopLimb',
                                origin: [0, 24, 0],
                                cube: cubeDef('TopLimb', 0, 30, 0, 2, 12, 2),
                            },
                            {
                                name: 'BottomLimb',
                                origin: [0, 0, 0],
                                cube: cubeDef('BottomLimb', 0, -6, 0, 2, 12, 2),
                            },
                        ],
                    },
                ],
            },
        ],
    },

    shield: {
        label: 'Shield',
        format: 'hytale_prop',
        textureWidth: 64,
        textureHeight: 64,
        bones: [
            {
                name: 'L-Attachment',
                origin: [0, 0, 0],
                children: [
                    {
                        name: 'Body',
                        origin: [0, 8, 0],
                        cube: cubeDef('Body', 0, 8, 0, 12, 16, 3),
                        children: [
                            {
                                name: 'Handle',
                                origin: [0, 8, -1.5],
                                cube: cubeDef('Handle', 0, 8, -1.5, 3, 6, 2),
                            },
                        ],
                    },
                ],
            },
        ],
    },

    furniture: {
        label: 'Furniture',
        format: 'hytale_prop',
        textureWidth: 64,
        textureHeight: 64,
        bones: [
            {
                name: 'Root',
                origin: [0, 0, 0],
                children: [
                    {
                        name: 'Body',
                        origin: [0, 8, 0],
                        cube: cubeDef('Body', 0, 8, 0, 16, 16, 16),
                    },
                ],
            },
        ],
    },

    decoration: {
        label: 'Decoration',
        format: 'hytale_prop',
        textureWidth: 32,
        textureHeight: 32,
        bones: [
            {
                name: 'Root',
                origin: [0, 0, 0],
                children: [
                    {
                        name: 'Body',
                        origin: [0, 4, 0],
                        cube: cubeDef('Body', 0, 4, 0, 8, 8, 8),
                    },
                ],
            },
        ],
    },

    character: {
        label: 'Character',
        format: 'hytale_character',
        textureWidth: 256,
        textureHeight: 256,
        bones: [
            {
                name: 'Root',
                origin: [0, 0, 0],
                children: [
                    {
                        name: 'Body',
                        origin: [0, 12, 0],
                        children: [
                            {
                                name: 'Head',
                                origin: [0, 28, 0],
                                cube: cubeDef('Head', 0, 28, 0, 8, 8, 8),
                            },
                            {
                                name: 'Chest',
                                origin: [0, 18, 0],
                                cube: cubeDef('Chest', 0, 18, 0, 8, 12, 4),
                            },
                            {
                                name: 'Pelvis',
                                origin: [0, 12, 0],
                                cube: cubeDef('Pelvis', 0, 12, 0, 8, 4, 4),
                            },
                            {
                                name: 'Arm_Right',
                                origin: [8, 18, 0],
                                cube: cubeDef('Arm_Right', 8, 18, 0, 4, 12, 4),
                            },
                            {
                                name: 'Arm_Left',
                                origin: [-8, 18, 0],
                                cube: cubeDef('Arm_Left', -8, 18, 0, 4, 12, 4),
                            },
                            {
                                name: 'Leg_Right',
                                origin: [2, 6, 0],
                                cube: cubeDef('Leg_Right', 2, 6, 0, 4, 12, 4),
                            },
                            {
                                name: 'Leg_Left',
                                origin: [-2, 6, 0],
                                cube: cubeDef('Leg_Left', -2, 6, 0, 4, 12, 4),
                            },
                        ],
                    },
                ],
            },
        ],
    },

    creature: {
        label: 'Creature',
        format: 'hytale_character',
        textureWidth: 128,
        textureHeight: 128,
        bones: [
            {
                name: 'Root',
                origin: [0, 0, 0],
                children: [
                    {
                        name: 'Body',
                        origin: [0, 8, 0],
                        cube: cubeDef('Body', 0, 8, 0, 10, 8, 6),
                    },
                    {
                        name: 'Head',
                        origin: [0, 14, 0],
                        cube: cubeDef('Head', 0, 14, 4, 8, 8, 8),
                    },
                    {
                        name: 'Leg_Front_Right',
                        origin: [3, 4, 3],
                        cube: cubeDef('Leg_Front_Right', 3, 3, 3, 3, 6, 3),
                    },
                    {
                        name: 'Leg_Front_Left',
                        origin: [-3, 4, 3],
                        cube: cubeDef('Leg_Front_Left', -3, 3, 3, 3, 6, 3),
                    },
                    {
                        name: 'Leg_Back_Right',
                        origin: [3, 4, -3],
                        cube: cubeDef('Leg_Back_Right', 3, 3, -3, 3, 6, 3),
                    },
                    {
                        name: 'Leg_Back_Left',
                        origin: [-3, 4, -3],
                        cube: cubeDef('Leg_Back_Left', -3, 3, -3, 3, 6, 3),
                    },
                ],
            },
        ],
    },

    helmet: {
        label: 'Helmet',
        format: 'hytale_character',
        textureWidth: 64,
        textureHeight: 64,
        bones: [{
            name: 'Head-Attachment',
            origin: [0, 0, 0],
            children: [{
                name: 'Helmet',
                origin: [0, 28, 0],
                cube: cubeDef('Helmet', 0, 28, 0, 10, 10, 10),
            }],
        }],
    },

    chestplate: {
        label: 'Chestplate',
        format: 'hytale_character',
        textureWidth: 128,
        textureHeight: 128,
        bones: [{
            name: 'Body-Attachment',
            origin: [0, 0, 0],
            children: [
                {
                    name: 'Torso',
                    origin: [0, 18, 0],
                    cube: cubeDef('Torso', 0, 18, 0, 10, 12, 6),
                },
                {
                    name: 'Shoulder_Right',
                    origin: [7, 24, 0],
                    cube: cubeDef('Shoulder_Right', 7, 24, 0, 6, 4, 6),
                },
                {
                    name: 'Shoulder_Left',
                    origin: [-7, 24, 0],
                    cube: cubeDef('Shoulder_Left', -7, 24, 0, 6, 4, 6),
                },
            ],
        }],
    },

    boots: {
        label: 'Boots',
        format: 'hytale_character',
        textureWidth: 64,
        textureHeight: 64,
        bones: [{
            name: 'Feet-Attachment',
            origin: [0, 0, 0],
            children: [
                {
                    name: 'Boot_Right',
                    origin: [2, 2, 0],
                    cube: cubeDef('Boot_Right', 2, 2, 0, 6, 4, 6),
                },
                {
                    name: 'Boot_Left',
                    origin: [-2, 2, 0],
                    cube: cubeDef('Boot_Left', -2, 2, 0, 6, 4, 6),
                },
            ],
        }],
    },

    gauntlets: {
        label: 'Gauntlets',
        format: 'hytale_character',
        textureWidth: 64,
        textureHeight: 64,
        bones: [{
            name: 'Hands-Attachment',
            origin: [0, 0, 0],
            children: [
                {
                    name: 'Gauntlet_Right',
                    origin: [8, 12, 0],
                    cube: cubeDef('Gauntlet_Right', 8, 12, 0, 6, 6, 6),
                },
                {
                    name: 'Gauntlet_Left',
                    origin: [-8, 12, 0],
                    cube: cubeDef('Gauntlet_Left', -8, 12, 0, 6, 6, 6),
                },
            ],
        }],
    },

    staff: {
        label: 'Staff',
        format: 'hytale_prop',
        textureWidth: 64,
        textureHeight: 64,
        bones: [{
            name: 'R-Attachment',
            origin: [0, 0, 0],
            children: [{
                name: 'Shaft',
                origin: [0, 16, 0],
                cube: cubeDef('Shaft', 0, 16, 0, 2, 32, 2),
                children: [{
                    name: 'Orb',
                    origin: [0, 34, 0],
                    cube: cubeDef('Orb', 0, 34, 0, 6, 6, 6),
                }],
            }],
        }],
    },

    spear: {
        label: 'Spear',
        format: 'hytale_prop',
        textureWidth: 64,
        textureHeight: 64,
        bones: [{
            name: 'R-Attachment',
            origin: [0, 0, 0],
            children: [{
                name: 'Shaft',
                origin: [0, 18, 0],
                cube: cubeDef('Shaft', 0, 18, 0, 2, 36, 2),
                children: [{
                    name: 'Tip',
                    origin: [0, 38, 0],
                    cube: cubeDef('Tip', 0, 38, 0, 4, 6, 2),
                }],
            }],
        }],
    },

    hammer: {
        label: 'Hammer',
        format: 'hytale_prop',
        textureWidth: 64,
        textureHeight: 64,
        bones: [{
            name: 'R-Attachment',
            origin: [0, 0, 0],
            children: [{
                name: 'Handle',
                origin: [0, 12, 0],
                cube: cubeDef('Handle', 0, 12, 0, 3, 24, 3),
                children: [{
                    name: 'Head',
                    origin: [0, 24, 0],
                    cube: cubeDef('Head', 0, 24, 0, 10, 6, 8),
                }],
            }],
        }],
    },

    wand: {
        label: 'Wand',
        format: 'hytale_prop',
        textureWidth: 32,
        textureHeight: 32,
        bones: [{
            name: 'R-Attachment',
            origin: [0, 0, 0],
            children: [{
                name: 'Stick',
                origin: [0, 8, 0],
                cube: cubeDef('Stick', 0, 8, 0, 2, 16, 2),
                children: [{
                    name: 'Crystal',
                    origin: [0, 17, 0],
                    cube: cubeDef('Crystal', 0, 17, 0, 3, 3, 3),
                }],
            }],
        }],
    },

    tree: {
        label: 'Tree',
        format: 'hytale_prop',
        textureWidth: 128,
        textureHeight: 128,
        bones: [{
            name: 'Root',
            origin: [0, 0, 0],
            children: [
                {
                    name: 'Trunk',
                    origin: [0, 12, 0],
                    cube: cubeDef('Trunk', 0, 12, 0, 6, 24, 6),
                },
                {
                    name: 'Canopy',
                    origin: [0, 28, 0],
                    cube: cubeDef('Canopy', 0, 28, 0, 16, 14, 16),
                },
            ],
        }],
    },

    rock: {
        label: 'Rock',
        format: 'hytale_prop',
        textureWidth: 32,
        textureHeight: 32,
        bones: [{
            name: 'Root',
            origin: [0, 0, 0],
            children: [{
                name: 'Body',
                origin: [0, 4, 0],
                cube: cubeDef('Body', 0, 4, 0, 10, 8, 10),
            }],
        }],
    },

    crate: {
        label: 'Crate',
        format: 'hytale_prop',
        textureWidth: 64,
        textureHeight: 64,
        bones: [{
            name: 'Root',
            origin: [0, 0, 0],
            children: [
                {
                    name: 'Body',
                    origin: [0, 6, 0],
                    cube: cubeDef('Body', 0, 6, 0, 12, 12, 12),
                },
                {
                    name: 'Lid',
                    origin: [0, 13, 0],
                    cube: cubeDef('Lid', 0, 13, 0, 14, 2, 14),
                },
            ],
        }],
    },

    bird: {
        label: 'Bird',
        format: 'hytale_character',
        textureWidth: 64,
        textureHeight: 64,
        bones: [{
            name: 'Root',
            origin: [0, 0, 0],
            children: [
                {
                    name: 'Body',
                    origin: [0, 6, 0],
                    cube: cubeDef('Body', 0, 6, 0, 6, 5, 8),
                },
                {
                    name: 'Head',
                    origin: [0, 10, 5],
                    cube: cubeDef('Head', 0, 10, 5, 5, 5, 5),
                },
                {
                    name: 'Wing_Right',
                    origin: [4, 8, 0],
                    cube: cubeDef('Wing_Right', 6, 7, 0, 6, 2, 6),
                },
                {
                    name: 'Wing_Left',
                    origin: [-4, 8, 0],
                    cube: cubeDef('Wing_Left', -6, 7, 0, 6, 2, 6),
                },
                {
                    name: 'Tail',
                    origin: [0, 6, -4],
                    cube: cubeDef('Tail', 0, 7, -6, 4, 2, 4),
                },
            ],
        }],
    },

    fish: {
        label: 'Fish',
        format: 'hytale_character',
        textureWidth: 64,
        textureHeight: 64,
        bones: [{
            name: 'Root',
            origin: [0, 0, 0],
            children: [
                {
                    name: 'Body',
                    origin: [0, 4, 0],
                    cube: cubeDef('Body', 0, 4, 0, 4, 6, 12),
                },
                {
                    name: 'Head',
                    origin: [0, 5, 8],
                    cube: cubeDef('Head', 0, 5, 8, 5, 5, 4),
                },
                {
                    name: 'Tail',
                    origin: [0, 5, -8],
                    cube: cubeDef('Tail', 0, 5, -8, 2, 6, 4),
                },
                {
                    name: 'Fin_Top',
                    origin: [0, 9, 0],
                    cube: cubeDef('Fin_Top', 0, 9, 0, 1, 3, 4),
                },
            ],
        }],
    },
};

// =====================================================================
// Template Builder
// =====================================================================

/**
 * Recursively creates bone groups and their cubes from a BoneDef tree.
 * Returns the created Group so callers can attach it as a child.
 */
function buildBoneHierarchy(boneDef: BoneDef, parent?: any): any {
    // @ts-ignore - Group is a global from Blockbench
    const group = new Group({
        name: boneDef.name,
        origin: boneDef.origin,
    }).init();

    if (parent) {
        group.addTo(parent);
    }

    // Create the cube inside this bone if one is defined
    if (boneDef.cube) {
        // @ts-ignore - Cube is a global from Blockbench
        new Cube({
            name: boneDef.cube.name,
            from: boneDef.cube.from,
            to: boneDef.cube.to,
        }).init().addTo(group);
    }

    // Recurse into children
    if (boneDef.children) {
        for (const childDef of boneDef.children) {
            buildBoneHierarchy(childDef, group);
        }
    }

    return group;
}

/**
 * Resolves the correct Blockbench format object for a template.
 * Falls back to Formats.free if the Hytale plugin formats are unavailable.
 */
function resolveFormat(formatId: string): any {
    // @ts-ignore - Formats is a global from Blockbench
    if (Formats[formatId]) {
        // @ts-ignore
        return Formats[formatId];
    }

    // Hytale plugin not installed - fall back to free format
    // @ts-ignore
    if (Formats.free) {
        // @ts-ignore
        Blockbench.showQuickMessage(
            `Hytale plugin format "${formatId}" not found. Using free format instead.`,
            3000
        );
        // @ts-ignore
        return Formats.free;
    }

    return null;
}

/**
 * Create a new project from a template definition.
 */
function createFromTemplate(template: TemplateDef, assetName: string): void {
    const format = resolveFormat(template.format);

    if (!format) {
        // @ts-ignore
        Blockbench.showMessageBox({
            title: "Template Wizard - Error",
            message: 'Could not find a compatible format. Please ensure the Hytale Model Creator plugin is installed.',
            icon: 'error',
        });
        return;
    }

    // Create a new project with the resolved format
    // @ts-ignore - newProject is a global from Blockbench
    newProject(format);

    // Set project texture dimensions
    // @ts-ignore - Project is a global from Blockbench
    Project.texture_width = template.textureWidth;
    // @ts-ignore
    Project.texture_height = template.textureHeight;

    // Set project name to the user-provided asset name
    // @ts-ignore
    if (assetName) {
        Project.name = assetName;
    }

    // Build the bone hierarchy
    for (const rootBone of template.bones) {
        buildBoneHierarchy(rootBone);
    }

    // Create a starter texture filled with a neutral grey
    // @ts-ignore - Texture is a global from Blockbench
    const tex = new Texture({
        name: assetName || template.label,
        width: template.textureWidth,
        height: template.textureHeight,
    }).add(false).fillRecursive('#808080');

    // Update the canvas so the texture is visible
    // @ts-ignore - Canvas is a global from Blockbench
    if (typeof Canvas !== 'undefined' && Canvas.updateAll) {
        Canvas.updateAll();
    }

    // @ts-ignore
    Blockbench.showQuickMessage(
        `Created ${template.label} template "${assetName || 'Untitled'}" (${template.textureWidth}x${template.textureHeight})`,
        3000
    );
}

// =====================================================================
// Wizard Dialog & Action Registration
// =====================================================================

/**
 * Build the dropdown options object from the template catalogue.
 * Returns { key: label } for use in Dialog form fields.
 */
function buildTemplateOptions(): Record<string, string> {
    const CATEGORIES: Record<string, string[]> = {
        'Weapons': ['sword', 'axe', 'pickaxe', 'bow', 'staff', 'spear', 'hammer', 'wand'],
        'Defense': ['shield'],
        'Armor': ['helmet', 'chestplate', 'boots', 'gauntlets'],
        'Props': ['furniture', 'decoration', 'crate'],
        'Environment': ['tree', 'rock'],
        'Characters': ['character'],
        'Creatures': ['creature', 'bird', 'fish'],
    };

    const options: Record<string, string> = {};
    for (const [category, keys] of Object.entries(CATEGORIES)) {
        for (const key of keys) {
            const tpl = TEMPLATES[key];
            if (tpl) {
                const formatLabel = tpl.format === 'hytale_character' ? 'Character' : 'Prop';
                options[key] = `[${category}] ${tpl.label}  (${formatLabel} - ${tpl.textureWidth}x${tpl.textureHeight})`;
            }
        }
    }
    return options;
}

/**
 * Show the Template Wizard dialog.
 */
function showTemplateWizardDialog(): void {
    // @ts-ignore - Dialog is a global from Blockbench
    new Dialog({
        id: 'myrlin_template_wizard_dialog',
        title: "New Hytale Asset - Myrlin's Tools",
        form: {
            asset_type: {
                label: 'Asset Type',
                type: 'select',
                options: buildTemplateOptions(),
                value: 'sword',
            },
            asset_name: {
                label: 'Asset Name',
                type: 'text',
                value: '',
                placeholder: 'e.g. Diamond Sword',
            },
        },
        onConfirm(formData: { asset_type: string; asset_name: string }) {
            const templateKey = formData.asset_type;
            const template = TEMPLATES[templateKey];

            if (!template) {
                // @ts-ignore
                Blockbench.showQuickMessage('Unknown template type selected.', 2000);
                return;
            }

            createFromTemplate(template, formData.asset_name);
        },
    }).show();
}

// =====================================================================
// Public Setup
// =====================================================================

/**
 * Register the Template Wizard action and add it to the file menu.
 * Call this once from the plugin's onload().
 */
export function setupTemplateWizard(): void {
    // Check if the Hytale plugin is available and warn early if not
    // @ts-ignore - Formats is a global from Blockbench
    const hytaleAvailable = !!(Formats && (Formats.hytale_prop || Formats.hytale_character));

    if (!hytaleAvailable) {
        console.warn(
            "[Myrlin's Tools] Hytale Model Creator plugin not detected. " +
            "Template Wizard will fall back to free format."
        );
    }

    // @ts-ignore - Action is a global from Blockbench
    const wizardAction = new Action('myrlin_template_wizard', {
        name: 'New Hytale Asset',
        description: "Create a new Hytale model from a structured template (Myrlin's Tools)",
        icon: 'note_add',
        category: 'file',
        click: () => {
            // Re-check at click time in case the Hytale plugin was loaded after ours
            // @ts-ignore
            const hytaleReady = !!(Formats && (Formats.hytale_prop || Formats.hytale_character));

            if (!hytaleReady) {
                // @ts-ignore
                Blockbench.showMessageBox({
                    title: "Hytale Plugin Required",
                    message:
                        'The Hytale Model Creator plugin is not installed.\n\n' +
                        'Templates will use the "free" format instead, which may not ' +
                        'include Hytale-specific features like attachment points.\n\n' +
                        'Install the Hytale Model Creator plugin from the Blockbench ' +
                        'plugin store for the best experience.',
                    icon: 'warning',
                    buttons: ['Continue Anyway', 'Cancel'],
                    confirm: 0,
                    cancel: 1,
                    // @ts-ignore
                    onConfirm: () => {
                        showTemplateWizardDialog();
                    },
                });
                return;
            }

            showTemplateWizardDialog();
        },
    });

    // Track for cleanup on plugin unload
    // @ts-ignore
    track(wizardAction);

    // Add to the File menu so it appears alongside New / Open
    // @ts-ignore - MenuBar is a global from Blockbench
    MenuBar.addAction(wizardAction, 'file');
}
