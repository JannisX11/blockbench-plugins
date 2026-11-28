/**
 * Status Bar - Always-visible indicator showing node count
 */

import { track } from '../utils/cleanup';
import { countHytaleNodes, HYTALE_MAX_NODES, HYTALE_WARN_NODES } from '../utils/hytale_nodes';

/**
 * Get status color based on node count
 */
function getStatusColor(count: number): string {
    if (count > HYTALE_MAX_NODES) return '#ef4444'; // Red - over limit
    if (count > HYTALE_WARN_NODES) return '#f59e0b'; // Yellow - warning
    return '#22c55e'; // Green - good
}

/**
 * Get status emoji based on count
 */
function getStatusEmoji(count: number): string {
    if (count > HYTALE_MAX_NODES) return '❌';
    if (count > HYTALE_WARN_NODES) return '⚠️';
    return '✅';
}

export function setupStatusBar(): void {
    let statusElement: HTMLElement | null = null;

    /**
     * Update the status bar text
     */
    function updateStatus(): void {
        // Blockbench 5 re-renders its status bar (opening or switching a project drops our element): put it back
        if (statusElement && !statusElement.isConnected) {
            statusElement = null;
        }
        if (!statusElement) {
            createStatusElement();
            if (!statusElement) return;
        }

        // Hytale nodes, the same number the panel and the Hytale Models plugin show
        // (until 3.4.1 this counted cubes only: 144 on the teapot where Hytale counts 149)
        const count = countHytaleNodes();
        const emoji = getStatusEmoji(count);
        const color = getStatusColor(count);

        if (statusElement) {
            statusElement.innerHTML = `
                <span style="color: ${color}">
                    📦 ${count}/${HYTALE_MAX_NODES}
                </span>
            `;
            statusElement.title = `Hytale nodes: ${count} / ${HYTALE_MAX_NODES} (Myrlin's Tools). Every group is one node, its first unrotated cube is free, every other cube is one node.`;
        }
    }

    /**
     * Create the status bar element
     */
    function createStatusElement(): void {
        if (statusElement && statusElement.isConnected) return;

        // Find status bar
        // @ts-ignore
        const statusBar = document.querySelector('#status_bar');
        if (!statusBar) {
            console.warn('[Myrlin\'s Tools] Status bar not found');
            return;
        }

        // Create our element
        statusElement = document.createElement('div');
        statusElement.id = 'myrlin_status';
        statusElement.className = 'f_left';
        statusElement.style.cssText = `
            padding: 0 8px;
            font-size: 12px;
            display: flex;
            align-items: center;
            cursor: pointer;
        `;

        // Click to open panel
        statusElement.addEventListener('click', () => {
            // @ts-ignore
            const panel = Panels.myrlins_tools_panel;
            if (panel) {
                if (panel.slot === 'hidden') {
                    panel.moveTo('right_bar');
                }
                if (panel.folded) {
                    panel.fold();
                }
            }
        });

        // Insert after the first element
        const firstChild = statusBar.firstChild;
        if (firstChild) {
            statusBar.insertBefore(statusElement, firstChild.nextSibling);
        } else {
            statusBar.appendChild(statusElement);
        }
    }

    // Create status element when edit mode is active
    // @ts-ignore - Blockbench is a global
    const modeListener = Blockbench.on('select_mode', (data: any) => {
        // Blockbench 5 passes the Mode object ({ mode: { id: 'edit' } }); 3.4.0 compared it to the string 'edit'
        // and so never re-created the element after the status bar re-rendered
        const mode = data && data.mode;
        const modeId = typeof mode === 'string' ? mode : (mode && mode.id);
        if (modeId === 'edit') {
            updateStatus();
        }
    });
    track({ delete: () => modeListener.delete() });

    // Update on model changes
    // @ts-ignore
    const updateListener = Blockbench.on('update_selection', updateStatus);
    track({ delete: () => updateListener.delete() });

    // @ts-ignore
    const undoListener = Blockbench.on('undo', updateStatus);
    track({ delete: () => undoListener.delete() });

    // @ts-ignore
    const redoListener = Blockbench.on('redo', updateStatus);
    track({ delete: () => redoListener.delete() });

    // Opening or switching a project re-renders the status bar
    // @ts-ignore
    const projectListener = Blockbench.on('select_project', () => setTimeout(updateStatus, 50));
    track({ delete: () => projectListener.delete() });

    // Cleanup handler
    track({
        delete: () => {
            if (statusElement && statusElement.parentNode) {
                statusElement.parentNode.removeChild(statusElement);
            }
            statusElement = null;
        }
    });

    // Try to create immediately if in edit mode
    // @ts-ignore
    if (Modes.edit) {
        setTimeout(updateStatus, 100);
    }
}
