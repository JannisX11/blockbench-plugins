Blockbench.addCSS(`
dialog#block_multi_collisions .result-code-container {
    background-color: #181b1f;
    border: 1px solid #101316;
    border-radius: 4px;
    padding: 12px;
    font-family: 'Courier New', 'Noto Sans Mono', monospace;
    font-size: 12px;
    line-height: 1.5;
    color: #d4d4d4;
    max-height: 130px;
    overflow-y: auto;
    overflow-x: auto;
    width: 100%;
    user-select: text;
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    cursor: text;
}
dialog#block_multi_collisions .hljs { 
    background-color: transparent;
    user-select: text;
    -webkit-user-select: text;
}
dialog#block_multi_collisions .hljs-string { color: #ce9178; }
dialog#block_multi_collisions .hljs-number { color: #b5cea8; }
dialog#block_multi_collisions .hljs-attr { color: #9cdcfe; }
dialog#block_multi_collisions .hljs-literal { color: #569cd6; }

#collision_box_controls {
    display: grid;
    grid-template-rows: auto auto;
    row-gap: 6px;
    padding: 8px 0;
    margin: 4px 0;
    width: 80%;
}

#collision_box_controls i{
    margin: unset;
}

#collision_box_controls_row1 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 6px;
    align-items: center;
}

#collision_box_controls_row2 {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    column-gap: 6px;
    align-items: center;
}

#collision_box_controls .tool {
    display: inline-flex;
    align-items: center;
    justify-content: space-around;
    gap: 4px;
    padding: 4px 8px;
    height: 28px;
    font-size: 13px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    outline: none;
    white-space: nowrap;
    width: 100%;
    line-height: 1;
    transition: background 0.1s, filter 0.1s;
    background: var(--color-button);
    color: var(--color-text);
}

#collision_box_controls .tool:hover {
    filter: brightness(1.2);
}

#collision_box_controls .tool:active {
    filter: brightness(0.9);
}

#add_box_btn {
    background: var(--color-accent);
}
#remove_box_btn {
    background: var(--color-button);
}
#auto_cubes_btn {
    background: var(--color-button);
}
#copy_result_btn_inline {
    background: var(--color-button);
}

#copy_result_btn_inline.copied {
    background: #37cf95 !important;
    color: #18321e !important;
}

#box_count_display {
    color: var(--color-subtle_text);
    justify-self: end;
    white-space: nowrap;
    font-size: 12px;
    padding: 0 4px;
}

dialog#block_multi_collisions textarea { tab-size: 40px; }
#collision_box_controls i {
    font-size: 18px;
    width: 18px;
    height: 18px;
}
`);

(function () {

    function highlightJSON(jsonString) {
        jsonString = jsonString
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        return jsonString
            .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*")(\s*:)/g, '<span class="hljs-attr">$1</span>$3')
            .replace(/:\s*("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*")/g, ': <span class="hljs-string">$1</span>')
            .replace(/\b(-?\d+\\.?\\d*)\b/g, '<span class="hljs-number">$1</span>')
            .replace(/\b(true|false|null)\b/g, '<span class="hljs-literal">$1</span>');
    }

    function copyToClipboard(text) {
        return new Promise((resolve, reject) => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(resolve).catch(err => fallbackCopy(text, resolve, reject));
            } else {
                fallbackCopy(text, resolve, reject);
            }
        });
    }
    function fallbackCopy(text, resolve, reject) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            const ok = document.execCommand('copy');
            document.body.removeChild(textarea);
            ok ? resolve() : reject(new Error('Copy command failed'));
        } catch (err) {
            document.body.removeChild(textarea);
            reject(err);
        }
    }

    function triggerCopyFeedback() {
        const btn = $('#copy_result_btn_inline');
        const btnText = btn.find('span');
        const btnIcon = btn.find('i');

        btn.addClass('copied');
        btnText.text('Copied!');
        btnIcon.text('check');

        setTimeout(() => {
            btn.removeClass('copied');
            btnText.text('Copy');
            btnIcon.text('content_copy');
        }, 2000);
    }

    window.BlockCollisionManager = {
        collisionBoxes: [],
        colors: [0xffbd2e, 0xff5733, 0x33ff57, 0x3357ff, 0xff33f5, 0x33fff5, 0xffd700, 0xff1493],
        objects: [],
        currentBoxIndex: 0,
        previousBoxIndex: 0,
        controlsAdded: false,
        validateBox(size, offset) {
            const clampedSize = [
                Math.max(0, Math.min(size[0], 16)),
                Math.max(0, Math.min(size[1], 24)),
                Math.max(0, Math.min(size[2], 16))
            ];
            const origin = [
                offset[0] - clampedSize[0] / 2,
                offset[1],
                offset[2] - clampedSize[2] / 2
            ];
            const minOrigin = [-8, 0, -8];
            const maxOrigin = [8, 24, 8];
            for (let i = 0; i < 3; i++) {
                if (origin[i] < minOrigin[i]) offset[i] += minOrigin[i] - origin[i];
                if (origin[i] + clampedSize[i] > maxOrigin[i]) offset[i] -= (origin[i] + clampedSize[i]) - maxOrigin[i];
            }
            offset[0] = Math.max(-8, Math.min(8, offset[0]));
            offset[1] = Math.max(0, Math.min(24, offset[1]));
            offset[2] = Math.max(-8, Math.min(8, offset[2]));
            return { size: clampedSize, offset };
        },
        dialog: new Dialog({
            id: 'block_multi_collisions',
            title: 'Block Multi-Collisions',
            width: 540,
            form: {
                box_index: { label: 'Box Index', type: 'number', value: 1, min: 1, step: 1 },
                size_block: { label: 'Size (X, Y, Z)', type: 'vector', value: [16, 16, 16], max: 24, min: 0, dimensions: 3 },
                offset_block: { label: 'Offset (X, Y, Z)', type: 'vector', value: [0, 0, 0] },
                result: { type: 'textarea', height: 130, readonly: true }
            },
            singleButton: true,
            keyboard_actions: {
                copy: {
                    keybind: new Keybind({ key: 'c', ctrl: true }),
                    run() {
                        const textToCopy = $('dialog#block_multi_collisions textarea').val();
                        copyToClipboard(textToCopy)
                            .then(() => {
                                triggerCopyFeedback();
                                Blockbench.showQuickMessage('Copied to clipboard');
                            })
                            .catch(() => {
                                Blockbench.showQuickMessage('Failed to copy', 1500);
                            });
                    }
                }
            },
            onFormChange(form) {
                const { size_block, offset_block, box_index } = form;
                const clampedIndex = Math.max(1, Math.min(box_index, window.BlockCollisionManager.collisionBoxes.length));
                if (clampedIndex !== box_index) {
                    setTimeout(() => {
                        window.BlockCollisionManager.dialog.setFormValues({ box_index: clampedIndex }, false);
                    }, 0);
                }
                const newIndex = clampedIndex - 1;
                if (newIndex !== window.BlockCollisionManager.previousBoxIndex) {
                    window.BlockCollisionManager.previousBoxIndex = newIndex;
                    window.BlockCollisionManager.currentBoxIndex = newIndex;
                    window.BlockCollisionManager.loadBoxData(newIndex);
                    return;
                }
                const validated = window.BlockCollisionManager.validateBox(size_block, offset_block);
                if (validated.size.toString() !== size_block.toString() || validated.offset.toString() !== offset_block.toString()) {
                    setTimeout(() => {
                        window.BlockCollisionManager.dialog.setFormValues({
                            size_block: validated.size,
                            offset_block: validated.offset
                        }, false);
                    }, 0);
                }
                window.BlockCollisionManager.updateCurrentBox(validated.size, validated.offset);
                window.BlockCollisionManager.redrawAllBoxes();
                window.BlockCollisionManager.updateResultOutput();
            },
            onOpen() {
                window.BlockCollisionManager.setupControls();
            },
            onConfirm() {
                window.BlockCollisionManager.clearAllBoxes();
                this.hide();
            }
        }),
        updateResultOutput() {
            const boxes = this.collisionBoxes;
            let result;
            if (boxes.length === 1 && boxes[0].size.allEqual(16) && boxes[0].offset.allEqual(0)) {
                result = `"minecraft:collision_box": true`;
            } else if (boxes.length === 1) {
                const box = boxes[0];
                const value = compileJSON({
                    origin: [box.offset[0] - box.size[0] / 2, box.offset[1], box.offset[2] - box.size[2] / 2],
                    size: box.size
                });
                result = `"minecraft:collision_box": ${value}`;
            } else {
                const multi = boxes.map(box => ({
                    origin: [box.offset[0] - box.size[0] / 2, box.offset[1], box.offset[2] - box.size[2] / 2],
                    size: box.size
                }));
                result = `"minecraft:collision_box": ${compileJSON(multi)}`;
            }
            const container = $('dialog#block_multi_collisions textarea');
            const parent = container.parent();
            container.val(result);
            const highlighted = highlightJSON(result);
            let codeBlock = parent.find('.result-code-container code');
            if (!codeBlock.length) {
                container.hide();
                parent.append(`<pre class="result-code-container"><code class="hljs"></code></pre>`);
                codeBlock = parent.find('.result-code-container code');
            }
            codeBlock.html(highlighted);
        },
        setupControls() {
            if (this.controlsAdded) return;
            const container = $('dialog#block_multi_collisions .dialog_content');
            if (!container.length) return;
            $('#collision_box_controls').remove();
            const html = `
        <div id="collision_box_controls" class="form_bar">
            <div id="collision_box_controls_row1">
                <button id="add_box_btn" class="tool"><i class="material-icons">add</i> Add Box</button>
                <button id="remove_box_btn" class="tool"><i class="material-icons">remove</i> Remove Box</button>
            </div>
            <div id="collision_box_controls_row2">
                <button id="auto_cubes_btn" class="tool" title="hide cubes from geometry to exclude them"><i class="material-icons">auto_fix</i> Auto-Generate</button>
                <button id="copy_result_btn_inline" class="tool">
                    <i class="material-icons" style="font-size: 16px;">content_copy</i>
                    <span>Copy</span>
                </button>
                <span id="box_count_display">Total: 1</span>
            </div>
        </div>
        `;
            container.append(html);
            $('#add_box_btn').off('click').on('click', e => {
                e.preventDefault(); e.stopPropagation();
                window.BlockCollisionManager.addBox();
            });
            $('#remove_box_btn').off('click').on('click', e => {
                e.preventDefault(); e.stopPropagation();
                window.BlockCollisionManager.removeBox(window.BlockCollisionManager.currentBoxIndex);
            });
            $('#auto_cubes_btn').off('click').on('click', e => {
                e.preventDefault(); e.stopPropagation();
                window.BlockCollisionManager.autoGenerateFromCubes();
            });
            $('#copy_result_btn_inline').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const textToCopy = $('dialog#block_multi_collisions textarea').val();
                copyToClipboard(textToCopy)
                    .then(() => {
                        triggerCopyFeedback();
                    })
                    .catch(err => {
                        const btn = $(this);
                        const btnText = btn.find('span');
                        btnText.text('Failed');
                        setTimeout(() => { btnText.text('Copy'); }, 2000);
                    });
            });
            this.controlsAdded = true;
            this.updateBoxCount();
        },
        updateBoxCount() {
            $('#box_count_display').text(`Total: ${this.collisionBoxes.length}`);
        },
        loadBoxData(index) {
            if (index < 0 || index >= this.collisionBoxes.length) return;
            const box = this.collisionBoxes[index];
            this.dialog.setFormValues({
                size_block: [...box.size],
                offset_block: [...box.offset],
                box_index: index + 1
            }, false);
            this.previousBoxIndex = index;
            setTimeout(() => {
                this.redrawAllBoxes();
                this.updateResultOutput();
            }, 10);
        },
        updateCurrentBox(size, offset) {
            const idx = this.currentBoxIndex;
            while (this.collisionBoxes.length <= idx) {
                this.collisionBoxes.push({ size: [16, 16, 16], offset: [0, 0, 0] });
            }
            this.collisionBoxes[idx] = { size: [...size], offset: [...offset] };
        },
        autoGenerateFromCubes() {
            const all = Project.elements || [];
            if (all.length === 0) {
                Blockbench.showQuickMessage('No cubes found in the model');
                return;
            }
            this.collisionBoxes = [];
            all.forEach(elm => {
                if (elm instanceof Cube && elm.visibility) {
                    const sizeX = Math.abs(elm.to[0] - elm.from[0]);
                    const sizeY = Math.abs(elm.to[1] - elm.from[1]);
                    const sizeZ = Math.abs(elm.to[2] - elm.from[2]);
                    const centerX = (elm.from[0] + elm.to[0]) / 2;
                    const centerY = elm.from[1];
                    const centerZ = (elm.from[2] + elm.to[2]) / 2;
                    const v = this.validateBox([sizeX, sizeY, sizeZ], [centerX, centerY, centerZ]);
                    if (this.collisionBoxes.length < 16) {
                        this.collisionBoxes.push({ size: v.size, offset: v.offset });
                    }
                }
            });
            if (this.collisionBoxes.length === 0) {
                Blockbench.showQuickMessage('No valid cubes to convert');
                return;
            }
            this.currentBoxIndex = 0;
            this.previousBoxIndex = 0;
            this.updateBoxCount();
            this.loadBoxData(0);
            this.redrawAllBoxes();
            this.updateResultOutput();
            Blockbench.showQuickMessage(`Generated ${this.collisionBoxes.length} collision box`);
        },
        redrawAllBoxes() {
            this.clearAllBoxes();
            this.collisionBoxes.forEach((box, idx) => {
                const color = this.colors[idx % this.colors.length];
                const obj = this.createBoxObject(box.size[0], box.size[1], box.size[2], color);
                obj.position.set(-box.offset[0], box.offset[1], box.offset[2]);
                this.objects.push(obj);
                scene.add(obj);
            });
        },
        addBox() {
            if (this.collisionBoxes.length === 16) return;
            this.collisionBoxes.push({ size: [16, 16, 16], offset: [0, 0, 0] });
            this.currentBoxIndex = this.collisionBoxes.length - 1;
            this.updateBoxCount();
            this.loadBoxData(this.currentBoxIndex);
            this.redrawAllBoxes();
            this.updateResultOutput();
        },
        removeBox(index) {
            if (this.collisionBoxes.length <= 1) return;
            this.collisionBoxes.splice(index, 1);
            this.currentBoxIndex = Math.min(index, this.collisionBoxes.length - 1);
            this.updateBoxCount();
            this.loadBoxData(this.currentBoxIndex);
            this.redrawAllBoxes();
            this.updateResultOutput();
        },
        createBoxObject(w, h, d, color) {
            const geo = new THREE.BufferGeometry();
            const mat = new THREE.LineBasicMaterial({ color });
            const hw = w / 2, hh = h, hd = d / 2;
            const pos = [
                hw, 0, hd, hw, hh, hd,
                hw, 0, -hd, hw, hh, -hd,
                -hw, 0, hd, -hw, hh, hd,
                -hw, 0, -hd, -hw, hh, -hd,
                hw, 0, hd, -hw, 0, hd,
                hw, 0, -hd, -hw, 0, -hd,
                hw, hh, hd, -hw, hh, hd,
                hw, hh, -hd, -hw, hh, -hd,
                hw, 0, hd, hw, 0, -hd,
                -hw, 0, hd, -hw, 0, -hd,
                hw, hh, hd, hw, hh, -hd,
                -hw, hh, hd, -hw, hh, -hd
            ];
            geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
            return new THREE.LineSegments(geo, mat);
        },
        clearAllBoxes() {
            this.objects.forEach(o => {
                scene.remove(o);
                if (o.geometry) o.geometry.dispose();
                if (o.material) o.material.dispose();
            });
            this.objects = [];
        },
        setupObject() {
            if (this.init) return;
            this.collisionBoxes = [{ size: [16, 16, 16], offset: [0, 0, 0] }];
            this.currentBoxIndex = 0;
            this.previousBoxIndex = 0;
            this.init = true;
        }
    };

    let action;
    Plugin.register('block_multi_collisions', {
        title: 'Block Multi-Collision Editor',
        icon: 'icon.svg',
        author: 'minato4743',
        description: 'This Plugin allow you to make and generate multiple collision boxes for Minecraft Bedrock blocks.',
        about: "<style>.collisionPrivate p{width: fit-content;display: inline;margin-left: 10px !important;}.collisionPrivate tr td:nth-child(2){padding-left:10px}.collisionPrivate2 td, .collisionPrivate2 th{padding:0 10px}</style><h1>Block Multi-Collision</h1><p>Create and preview multiple collision boxes for Minecraft Bedrock blocks using the <code>minecraft:collision_box</code> component for block format <code>1.21.130+</code>.</p><h2>Features</h2><ul><li>Visual wireframe preview of up to 16 collision boxes in the Blockbench viewport</li><li>Numeric controls for editing size and offset of each collision box</li><li>Auto-generation of collision boxes from visible cubes in your model</li><li>Real-time preview with proper clamping to valid Bedrock collision bounds</li></ul><h2>Usage</h2><table class=collisionPrivate><tr><td>Setup Block Collisions</td><td>Action: </td><td><p>Opens the collision editor dialog</p></td></tr><tr><td>Navigate Boxes</td><td>Controls: </td><td><p>Use index selector to switch between collision boxes</p></td></tr><tr><td>Edit Size/Offset</td><td>Fields: </td><td><p>Adjust X, Y, Z values numerically</p></td></tr><tr><td>Auto-Generate</td><td>Button: </td><td><p>Creates collision boxes from visible cubes</p></td></tr><tr><td>Copy JSON</td><td>Button: </td><td><p>Copies generated collision component to clipboard</p></td></tr><tr><td>Ctrl+C</td><td>Shortcut: </td><td><p>Copies generated collision component to clipboard</p></td></tr></table><h2>Requirements</h2><table class=collisionPrivate2><tr><th>Requirement</th><th>Value</th></tr><tr><td>Blockbench Format</td><td>Bedrock Block</td></tr><tr><td>Minecraft Version</td><td>1.21.130+</td></tr></table><h2>Output Format</h2><p>The plugin generates JSON compatible with the <code>minecraft:collision_box</code> component. Paste the generated JSON into your block's behavior file under the <code>components</code> section.</p>",

        "tags": [
            "Minecraft: Bedrock Edition",
            "Format: Bedrock Block"
        ], variant: 'both',
        version: '1.0.0',
		min_version: "4.12.6",
        onload() {
            action = new Action('open_block_collision_editor', {
                name: 'Setup Block Collisions',
                icon: 'view_comfy_alt',
                condition: _ => Format.id === 'bedrock_block',
                click: () => {
                    window.BlockCollisionManager.setupObject();
                    window.BlockCollisionManager.dialog.show();
                    $('#blackout').hide(0);
                    window.BlockCollisionManager.redrawAllBoxes();
                    window.BlockCollisionManager.updateResultOutput();
                }
            });
            MenuBar.addAction(action, 'filter');
        },
        onunload() {
            action.delete();
        }
    });

})();