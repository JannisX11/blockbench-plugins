/**
 * Actions - Menu items, toolbar buttons, and keyboard shortcuts
 */

import { track } from './utils/cleanup';
import { optimizeBoxes, estimateSavings, nothingToMergeReason } from './optimizer/box_merge';
import { hollowInterior, countInteriorCubes, HOLLOW_ENABLED, HOLLOW_OFF_MESSAGE } from './optimizer/hollow';
import { convertToPalette, quantizeColors, PaletteType } from './tools/palette';
import { HYTALE_MAX_NODES } from './utils/hytale_nodes';

/** One piece of a dialog line: plain text, or { strong } for a bold number */
type LinePart = string | { strong: string };

/**
 * A dialog line as a real element. Blockbench 5 shows string "lines" as plain
 * text (3.4.0 passed **markdown**, which showed its asterisks and ran the
 * lines together); elements render the same in Blockbench 4 and 5.
 */
function dialogLine(parts: LinePart[], muted: boolean = false): HTMLElement {
    const p = document.createElement('p');
    p.style.margin = '0 0 8px 0';
    if (muted) p.style.color = 'var(--color-subtle_text)';
    for (const part of parts) {
        if (typeof part === 'string') {
            p.append(document.createTextNode(part));
        } else {
            const strong = document.createElement('strong');
            strong.textContent = part.strong;
            p.append(strong);
        }
    }
    return p;
}

/**
 * Show optimization results dialog
 */
function showResultDialog(title: string, result: { success: boolean; message: string }): void {
    // @ts-ignore - Blockbench is a global
    Blockbench.showQuickMessage(result.message, 3000);

    if (!result.success) {
        // @ts-ignore
        Blockbench.showMessageBox({
            title: title,
            message: result.message,
            icon: 'warning'
        });
    }
}

export function setupActions(): void {
    // =========================================
    // Box Optimizer Action
    // =========================================
    const optimizeAction = new Action('myrlin_optimize_boxes', {
        name: "Optimize Boxes",
        description: "Merge adjacent boxes with same material to reduce box count (Myrlin's Tools)",
        icon: 'compress',
        category: 'tools',
        // 3.4.3 (2026-11-08): the default shortcut Ctrl+Shift+O is given here, the way Blockbench reads it. Action has no
        // setKeybind method; 3.0.0 called it and failed to install ("optimizeAction.setKeybind is not a function", Blockbench
        // plugins PR 884), and 3.4.x only skipped the call, so the shortcut never existed. A shortcut the person set in
        // Keybindings still wins over this default.
        // @ts-ignore - Keybind is a global from Blockbench
        keybind: new Keybind({ key: 'o', ctrl: true, shift: true }),
        condition: () => {
            // @ts-ignore
            return Cube.all.length > 0;
        },
        click: () => {
            // A dry run of the same merge Optimize makes, so these numbers are what will happen
            const estimate = estimateSavings();
            const canMerge = estimate.savings > 0;

            const lines: HTMLElement[] = [
                dialogLine(['Hytale nodes now: ', { strong: `${estimate.nodesBefore} / ${HYTALE_MAX_NODES}` }]),
                dialogLine(['After Optimize: ', { strong: `${estimate.nodesAfter} / ${HYTALE_MAX_NODES}` },
                    ` (saves ${estimate.nodeSavings} ${estimate.nodeSavings === 1 ? 'node' : 'nodes'})`]),
                dialogLine(['Boxes: ', { strong: `${estimate.current}` }, ' now, ', { strong: `${estimate.potential}` }, ' after'])
            ];
            if (!canMerge) {
                lines.push(dialogLine([`Nothing to merge. ${nothingToMergeReason({ paintedSkipped: estimate.paintedSkipped, boxCount: estimate.current, sharedGroups: estimate.sharedGroups, stretchedSkipped: estimate.stretchedSkipped })}`]));
            } else if (estimate.paintedSkipped > 0) {
                lines.push(dialogLine([`${estimate.paintedSkipped} painted box(es) are left alone so their paint stays where it is.`]));
            }
            if (canMerge && estimate.stretchedSkipped > 0) {
                lines.push(dialogLine([`${estimate.stretchedSkipped} stretched box(es) are left alone so their shape stays the same.`]));
            }
            lines.push(dialogLine([
                'Optimize merges unstretched boxes in the same group that share a full face, the same rotation and the same texture or flat color.' +
                (canMerge ? ' Undo with Ctrl+Z.' : '')
            ], true));

            // @ts-ignore - Blockbench is a global
            new Dialog({
                id: 'myrlin_optimize_dialog',
                title: "Optimize Boxes - Myrlin's Tools",
                lines,
                buttons: canMerge ? ['Optimize', 'Cancel'] : ['Close'],
                onConfirm: () => {
                    if (!canMerge) return;
                    const result = optimizeBoxes();
                    showResultDialog('Optimize Boxes', result);
                }
            }).show();
        }
    });
    // @ts-ignore
    track(optimizeAction);

    // =========================================
    // Hollow Interior Action
    // =========================================
    const hollowAction = new Action('myrlin_hollow_interior', {
        name: HOLLOW_ENABLED ? "Hollow Interior" : "Hollow Interior (coming back soon)",
        description: HOLLOW_ENABLED
            ? "Remove boxes that are completely hidden inside the model (Myrlin's Tools)"
            : "Switched off in this version and coming back soon (Myrlin's Tools)",
        icon: 'select_all',  // Using available icon
        category: 'tools',
        condition: () => {
            // Off in 3.4.2: hidden from the Tools menu
            if (!HOLLOW_ENABLED) return false;
            // @ts-ignore
            return Cube.all.length > 0;
        },
        click: () => {
            // Off in 3.4.2: never remove anything, whatever calls this
            if (!HOLLOW_ENABLED) {
                // @ts-ignore - Blockbench is a global
                Blockbench.showQuickMessage(HOLLOW_OFF_MESSAGE, 3000);
                return;
            }
            const interiorCount = countInteriorCubes();
            // @ts-ignore
            const totalCount = Cube.all.length;

            if (interiorCount === 0) {
                // @ts-ignore
                Blockbench.showQuickMessage('No interior cubes found - model is already hollow.', 2000);
                return;
            }

            // @ts-ignore
            new Dialog({
                id: 'myrlin_hollow_dialog',
                title: "Hollow Interior - Myrlin's Tools",
                lines: [
                    dialogLine(['Current box count: ', { strong: `${totalCount}` }]),
                    dialogLine(['Interior boxes found: ', { strong: `${interiorCount}` }]),
                    dialogLine(['Final count after hollowing: ', { strong: `${totalCount - interiorCount}` }]),
                    dialogLine(['This will remove boxes that are completely surrounded by other boxes. Undo with Ctrl+Z.'], true)
                ],
                buttons: ['Hollow', 'Cancel'],
                onConfirm: () => {
                    const result = hollowInterior(true);
                    showResultDialog('Hollow Interior', result);
                }
            }).show();
        }
    });
    // @ts-ignore
    track(hollowAction);

    // =========================================
    // Palette Converter Action
    // =========================================
    const paletteAction = new Action('myrlin_palette_converter', {
        name: "Palette Converter",
        description: "Remap texture colors to a Hytale-style palette (Myrlin's Tools)",
        icon: 'palette',
        category: 'tools',
        condition: () => {
            // @ts-ignore - Texture is a global from Blockbench
            return Texture.all.length > 0;
        },
        click: () => {
            // @ts-ignore - Dialog is a global from Blockbench
            new Dialog({
                id: 'myrlin_palette_dialog',
                title: "Palette Converter - Myrlin's Tools",
                form: {
                    palette: {
                        label: 'Target Palette',
                        type: 'select',
                        options: {
                            official: 'Hytale Official',
                            warm: 'Warm Tones',
                            cool: 'Cool Tones',
                            nature: 'Nature'
                        },
                        value: 'official'
                    },
                    quantize: {
                        label: 'Quantize Colors',
                        type: 'checkbox',
                        value: false,
                        description: 'Reduce unique color count before palette conversion'
                    },
                    quantize_count: {
                        label: 'Target Color Count',
                        type: 'number',
                        value: 8,
                        min: 2,
                        max: 64
                    }
                },
                onConfirm: (formResult: Record<string, any>) => {
                    // Optionally quantize first
                    if (formResult.quantize) {
                        const qResult = quantizeColors(formResult.quantize_count || 8);
                        if (qResult.success) {
                            // @ts-ignore
                            Blockbench.showQuickMessage(qResult.message, 2000);
                        }
                    }

                    // Convert to selected palette
                    const result = convertToPalette(formResult.palette as PaletteType);
                    showResultDialog('Palette Converter', result);
                }
            }).show();
        }
    });
    // @ts-ignore
    track(paletteAction);

    // =========================================
    // Add to Tools Menu
    // =========================================
    // @ts-ignore - MenuBar is a global from Blockbench
    MenuBar.addAction(optimizeAction, 'tools');
    MenuBar.addAction(hollowAction, 'tools');
    MenuBar.addAction(paletteAction, 'tools');

    // =========================================
    // Keyboard Shortcuts
    // =========================================
    // Optimize Boxes: Ctrl+Shift+O, set as the action's `keybind` option above (3.4.3). Blockbench registers an action's
    // default shortcut when the action is built; there is no method to add one afterwards. Before 3.4.3 this block built a
    // Keybind here and called optimizeAction.setKeybind(...), which does not exist (3.0.0 threw; 3.4.x skipped it).
}
