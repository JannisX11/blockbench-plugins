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
    row-gap: 10px;
    padding: 12px 0;
    margin: 8px 0;
    width: 100%;
}

#collision_box_controls_row1 {
    display: grid;
    grid-template-columns: minmax(max-content, 1fr) minmax(max-content, 1fr);
    column-gap: 10px;
    align-items: center;
}

#collision_box_controls_row2 {
    display: grid;
    grid-template-columns: minmax(max-content, 1fr) minmax(max-content, 1fr) auto;
    column-gap: 10px;
    align-items: center;
}

#collision_box_controls .tool {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 14px;
    font-family: 'Noto Sans', sans-serif;
    font-size: 14px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    outline: none;
    white-space: nowrap;
    width: 100%;
    line-height: 1.2;
    transition: background 0.14s, color 0.14s, box-shadow 0.18s;
}

#add_box_btn {
    background: #1b5025;
    color: #fff;
}
#remove_box_btn {
    background: #64222d;
    color: #fff;
}
#auto_cubes_btn {
    background: #4a5a8c;
    color: #fff;
}
#copy_result_btn_inline {
    background: #2d5a8c;
    color: #fff;
}

#collision_box_controls .tool:hover,
#collision_box_controls .tool:focus {
    box-shadow: 0 0 0 3px #23406044;
    filter: brightness(1.13);
}
#add_box_btn:hover, #add_box_btn:focus {
    background: linear-gradient(90deg, #238f42 75%, #48b382);
    color: #243522;
}
#remove_box_btn:hover, #remove_box_btn:focus {
    background: linear-gradient(90deg, #d15163 75%, #fc7b87ff);
    color: #57081f;
}
#auto_cubes_btn:hover, #auto_cubes_btn:focus {
    background: linear-gradient(90deg, #5a7aac 75%, #8aafdc);
    color: #1a2a3a;
}
#copy_result_btn_inline:hover, #copy_result_btn_inline:focus {
    background: linear-gradient(90deg, #38a770 75%, #37cf95);
    color: #18321e;
}

#box_count_display {
    color: #aaa;
    justify-self: end;
    white-space: nowrap;
}

dialog#block_multi_collisions textarea { tab-size: 40px; }
#collision_box_controls i {
    margin: 4px 4px;
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
                const btn = $(this);
                const btnText = btn.find('span');
                const btnIcon = btn.find('i');
                copyToClipboard(textToCopy)
                    .then(() => {
                        btn.css('background', 'linear-gradient(90deg, #38a770 95%, #37cf95)');
                        btn.css('color', '#18321e');
                        btnText.text('Copied!');
                        btnIcon.text('check');
                        setTimeout(() => {
                            btn.css('background', 'linear-gradient(90deg, #2d5a8c 95%, #306db2)');
                            btn.css('color', '#fff');
                            btnText.text('Copy');
                            btnIcon.text('content_copy');
                        }, 2000);
                    })
                    .catch(err => {
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
    const logo = "data:image/png;base64,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"
    Plugin.register('block_multi_collisions', {
        title: 'Block Multi-Collision Editor',
        icon: logo,
        author: 'minato4743',
        description: 'This Plugin allow you to make and generate multiple collision boxes for blocks (format version must be 1.21.130+)',
        tags: ["Minecraft: Bedrock Edition"],
        variant: 'both',
        version: '1.0.0',
        onload() {
            action = new Action('open_block_collision_editor', {
                name: 'Setup Block Collisions',
                icon: logo,
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
