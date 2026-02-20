let net;
let fs;
let panel;
let requestFileTreeAction;
let connectToHytaleAction;
let menu;
let usedAddress = 'localhost:8651';

// TODO: panel and actions icon

const bridgeState = {
    client: null,
    uuid: null,
    buffer: ''
};

const MESSAGES = {
    CREATE: 'create',
    COMMAND: 'command',
    CREATED: 'created',
    FILE_TREE: 'fileTree',
    FILE: 'file',
    UPDATE: 'update'
};

const COMMANDS = {
    FILE_TREE: 'fileTree',
    FILE: 'file',
    SAVE: 'save',
    RENAME_FOLDER: 'renameFolder',
    DELETE_FOLDER: 'deleteFolder',
    RENAME_FILE: 'renameFile',
    DELETE_FILE: 'deleteFile',
    DISCONNECT: 'disconnect'
};

const EXTENSIONS = {
    MODEL: '.blockymodel',
    TEXTURE: '.png'
}

function is(name, extension) {
    return name.endsWith(extension);
}

BBPlugin.register("hytale_bridge", {
    title: "Hytale Bridge",
    author: "Tazer",
    icon: "icon.png",
    version: "0.1.0",
    description: "A Hytale/Blockbench plugin that bridges the two together seamlessly and effortlessly",
    tags: ["Hytale"],
    dependencies: ["hytale_plugin"],
    variant: "desktop",
    min_version: "5.0.7",
    creation_date: "2026-2-10",
    await_loading: true,
    has_changelog: true,
    repository: "https://github.com/tazercopter/Hytale-Blockbench-Bridge",
    bug_tracker: "https://github.com/tazercopter/Hytale-Blockbench-Bridge/issues",
    onload() {
        createPanel();
        try {
            net = requireNativeModule('net');
        } catch {
            try {
                net = require('net');
            } catch {
                // ERROR
            }
        }

        try {
            fs = requireNativeModule('fs');
        } catch {
            try {
                fs = require('fs');
            } catch {
                // ERROR
            }
        }

        requestFileTreeAction = new Action('request_file_tree', {
            name: 'Request Hytale Files',
            icon: 'add',
            click() {
                if (bridgeState.client) requestFileTree();
            }
        });
        MenuBar.addAction(requestFileTreeAction, 'file');
        connectToHytaleAction = new Action('connect_to_hytale', {
            name: 'Connect to Hytale',
            icon: 'add',
            click() {
                menu.connect();
            }
        });
        MenuBar.addAction(connectToHytaleAction, 'file');
    },
    onunload() {
        if (panel) panel.delete();
        if (requestFileTreeAction) requestFileTreeAction.delete();
        if (connectToHytaleAction) connectToHytaleAction.delete();
        if (bridgeState.client) {
            sendDisconnect();
            bridgeState.client.end();
        }
    }
});

function createPanel() {
    panel = new Panel({
        id: 'hytale_file_browser',
        name: 'Hytale File Browser',
        icon: 'add',
        resizable: true,
        growable: true,
        expand_button: true, default_side: 'left',
        default_position: {
            slot: 'left_bar',
            float_position: [0, 0],
            float_size: [300, 800],
            height: 400,
        },
        component: {
            template: `
            <div ref="treeScroll"
                style="padding:8px;overflow-y:auto;height:100%"
                @click="hideContextMenu"
                @scroll="saveScrollPosition"
                @contextmenu.prevent="onPanelRightClick($event)">

                <button @click="toggleConnection" style="width:100%;margin-bottom:8px">
                    {{ connected ? 'Disconnect from Hytale' : 'Connect to Hytale' }}
                </button>

                <select v-if="packNames.length"
                        v-model="selectedPack"
                        @change="onPackChange"
                        style="width:100%;margin-bottom:8px">
                    <option v-for="p in packNames" :value="p">{{ p }}</option>
                </select>

                <div v-for="n in renderNodes"
                    :key="n.path"
                    @click.stop="onNodeClick(n)"
                    @contextmenu.prevent.stop="onNodeRightClick(n,$event)"
                    :style="{
                        paddingLeft:(n.level*16)+'px',
                        fontWeight:n.type==='folder'?'bold':'normal',
                        cursor:'pointer'
                    }">
                    {{ n.type==='folder'
                        ? (n.expanded ? '📂' : '📁')
                        : (n.fileType==='png'
                            ? '🖼️'
                            : n.fileType==='blockymodel'
                                ? '🧊'
                                : '📄')
                    }}
                    {{ n.name }}
                </div>

                <div v-if="contextMenu.visible"
                    :style="{
                        position:'fixed',
                        top:contextMenu.y+'px',
                        left:contextMenu.x+'px',
                        background:'#2b2b2b',
                        border:'1px solid #444',
                        borderRadius:'4px',
                        zIndex:9999,
                        minWidth:'160px'
                    }">

                    <div v-for="item in contextMenu.options"
                        @click.stop="item.action(); hideContextMenu()"
                        :style="{
                            padding:'6px 12px',
                            cursor:'pointer',
                            whiteSpace:'nowrap'
                        }"
                        @mouseenter="$event.target.style.background='#3a3a3a'"
                        @mouseleave="$event.target.style.background='transparent'">
                        {{ item.label }}
                    </div>
                </div>
            </div>
            `,
            data() {
                return {
                    connected: false,
                    packs: {},
                    packNames: [],
                    selectedPack: null,
                    renderNodes: [],
                    packData: {},
                    contextMenu: {}
                };
            },
            methods: {
                toggleConnection() {
                    if (this.connected) {
                        sendDisconnect();
                        bridgeState.client.end();
                    } else {
                        this.connect();
                    }
                },
                connect() {
                    new Dialog({
                        title: 'Connect',
                        form: {
                            address: { label: 'Address', type: 'text', value: usedAddress },
                            key: { label: 'Key', type: 'text', value: '' }
                        },
                        onConfirm: (formData) => {
                            usedAddress = formData.address;
                            connectToSocket(formData);
                        }
                    }).show();
                },
                getPackState(pack) {
                    if (!this.packData[pack]) {
                        this.packData[pack] = {
                            expanded: new Set(),
                            scroll: 0
                        };
                    }
                    return this.packData[pack];
                },
                saveScrollPosition() {
                    const el = this.$refs.treeScroll;
                    if (!el || !this.selectedPack) return;
                    this.getPackState(this.selectedPack).scroll = el.scrollTop;
                },
                restoreScrollPosition() {
                    const el = this.$refs.treeScroll;
                    if (!el || !this.selectedPack) return;
                    el.scrollTop = this.getPackState(this.selectedPack).scroll || 0;
                },
                onPackChange() {
                    this.rebuildTree();
                },
                updateFileTrees(newPacks) {
                    this.packs = newPacks;
                    this.packNames = Object.keys(newPacks);
                    // mark disconnected when no packs
                    this.connected = this.packNames.length > 0;

                    if (!this.packNames.includes(this.selectedPack)) {
                        this.selectedPack = this.packNames[0];
                    }

                    this.rebuildTree();
                },
                rebuildTree() {
                    this.renderNodes = [];
                    const pack = this.packs[this.selectedPack];
                    if (!pack || !pack.entries) return;

                    this.walkEntries(pack.entries, 0, '');
                    this.$nextTick(this.restoreScrollPosition);
                },
                walkEntries(entries, level, basePath) {
                    const state = this.getPackState(this.selectedPack);

                    const names = Object.keys(entries);

                    names.sort((a, b) => {
                        const aIsFile = entries[a] === true;
                        const bIsFile = entries[b] === true;

                        if (aIsFile !== bIsFile) {
                            return aIsFile ? 1 : -1;
                        }

                        return a.localeCompare(b);
                    });

                    for (const name of names) {
                        const value = entries[name];
                        const path = basePath ? basePath + '/' + name : name;
                        const isFile = value === true;

                        let fileType = '';
                        if (isFile) {
                            if (is(name, EXTENSIONS.TEXTURE)) fileType = 'png';
                            else if (is(name, EXTENSIONS.MODEL)) fileType = 'blockymodel';
                        }

                        const expanded = state.expanded.has(path);

                        this.renderNodes.push({
                            name,
                            path,
                            level,
                            type: isFile ? 'file' : 'folder',
                            expanded,
                            fileType,
                            packImmutable: this.packs[this.selectedPack].immutable === true
                        });

                        if (!isFile && expanded) {
                            this.walkEntries(value, level + 1, path);
                        }
                    }
                },
                onNodeClick(node) {
                    this.hideContextMenu();

                    if (node.type === 'folder') {
                        const state = this.getPackState(this.selectedPack);

                        node.expanded = !node.expanded;

                        if (node.expanded) {
                            state.expanded.add(node.path);
                        } else {
                            state.expanded.delete(node.path);
                        }

                        this.rebuildTree();
                    } else {
                        requestFile(node.path, this.selectedPack);
                    }
                },
                hideContextMenu() {
                    this.contextMenu.visible = false;
                },
                onNodeRightClick(node, event) {
                    // TODO: override asset option?
                    if (node.packImmutable) return;

                    const options = [];

                    if (node.type === 'folder') {
                        options.push(
                            { label: 'Save Model', action: () => this.rightClickFolderSaveModel(node) },
                            { label: 'Save Texture', action: () => this.rightClickFolderSaveTexture(node) },
                            { label: 'Rename Folder', action: () => this.rightClickFolderRename(node) },
                            { label: 'Delete Folder', action: () => this.rightClickFolderDelete(node) }
                        );
                    } else {
                        options.push(
                            { label: 'Rename File', action: () => this.rightClickFileRename(node) },
                            { label: 'Delete File', action: () => this.rightClickFileDelete(node) }
                        );
                    }

                    this.contextMenu = {
                        visible: true,
                        x: event.clientX,
                        y: event.clientY,
                        options
                    };
                },
                onPanelRightClick(event) {
                    if (!this.connected || this.packs[this.selectedPack].immutable) return;

                    const options = [
                        { label: 'Save Model', action: () => this.rightClickFolderSaveModel({ path: '' }) },
                        { label: 'Save Texture', action: () => this.rightClickFolderSaveTexture({ path: '' }) }
                    ];

                    this.contextMenu = {
                        visible: true,
                        x: event.clientX,
                        y: event.clientY,
                        options
                    };
                },
                rightClickFolderSaveModel({ path }) {
                    const filePath = (path === '' ? '' : path + '/') + Project.name + '.blockymodel';
                    const nameDialog = new Dialog({
                        title: 'Save Model',
                        width: 150,
                        form: {
                            file: { label: 'File', type: 'text', value: filePath }
                        },
                        onConfirm: (formData) => {
                            if (!is(formData.file, EXTENSIONS.MODEL)) {
                                Blockbench.showMessageBox({
                                    title: 'Error',
                                    message: 'Invalid file name given'
                                });
                                return;
                            }

                            sendCommand(COMMANDS.SAVE, {
                                path: formData.file,
                                pack: this.selectedPack,
                                // json blockymodel data
                                data: Codecs.blockymodel.compile()
                            });

                            this.applyUpdate(this.selectedPack, [formData.file], [])

                        }
                    });

                    nameDialog.show();
                },
                rightClickFolderSaveTexture({ path }) {
                    const texture = Texture.selected;
                    if (!texture) {
                        Blockbench.showMessageBox({
                            title: 'No Texture Selected',
                            message: 'Please select a texture to save.'
                        });
                        return;
                    }

                    const filePath = (path === '' ? '' : path + '/') + texture.name;
                    const nameDialog = new Dialog({
                        title: 'Save Texture',
                        width: 150,
                        form: {
                            file: { label: 'File', type: 'text', value: filePath }
                        },
                        onConfirm: (formData) => {
                            if (!is(formData.file, EXTENSIONS.TEXTURE)) {
                                Blockbench.showMessageBox({
                                    title: 'Error',
                                    message: 'Invalid file name given'
                                });
                                return;
                            }

                            const source = texture.source;
                            let data;

                            if (source.startsWith("data")) {
                                data = source.split(',')[1];
                            } else {
                                data = fs.readFileSync(source.split('?')[0]).toString('base64');
                            }

                            sendCommand(COMMANDS.SAVE, {
                                path: formData.file,
                                pack: this.selectedPack,
                                // base64 png data
                                data: data
                            });

                            this.applyUpdate(this.selectedPack, [formData.file], [])
                        }
                    });

                    nameDialog.show();
                },
                rightClickFolderRename(node) {
                    const nameDialog = new Dialog({
                        title: 'Rename Folder',
                        width: 150,
                        form: {
                            name: { label: 'Name', type: 'text', value: node.name }
                        },
                        onConfirm: (formData) => {
                            sendCommand(COMMANDS.RENAME_FOLDER, {
                                path: node.path,
                                pack: this.selectedPack,
                                name: formData.name
                            });

                            // move all nodes inside?
                        }
                    });

                    nameDialog.show();
                },
                rightClickFolderDelete(node) {
                    sendCommand(COMMANDS.DELETE_FOLDER, {
                        path: node.path,
                        pack: this.selectedPack
                    });

                    // delete all nodes inside?
                },
                rightClickFileRename(node) {
                    const nameDialog = new Dialog({
                        title: 'Rename File',
                        width: 150,
                        form: {
                            name: { label: 'Name', type: 'text', value: node.name }
                        },
                        onConfirm: (formData) => {
                            sendCommand(COMMANDS.RENAME_FILE, {
                                path: node.path,
                                pack: this.selectedPack,
                                name: formData.name
                            });

                            const newPath = node.path.split('/').slice(0, -1).concat(formData.name).join('/');
                            this.applyUpdate(this.selectedPack, [newPath], [node.path])
                        }
                    });

                    nameDialog.show();
                },
                rightClickFileDelete(node) {
                    sendCommand(COMMANDS.DELETE_FILE, {
                        path: node.path,
                        pack: this.selectedPack
                    });

                    this.applyUpdate(this.selectedPack, [], [node.path])
                },
                addFile(pack, path) {
                    const parts = path.split('/');
                    const name = parts.pop();

                    let current = pack.entries;

                    for (const part of parts) {
                        if (!current[part] || current[part] === true) {
                            current[part] = {};
                        }
                        current = current[part];
                    }

                    current[name] = true;
                },
                deleteFile(pack, path) {
                    const parts = path.split('/');
                    const name = parts.pop();

                    let current = pack.entries;

                    for (const part of parts) {
                        if (!current[part] || current[part] === true) return;
                        current = current[part];
                    }

                    delete current[name];
                },
                applyUpdate(pack, added, deleted) {
                    pack = this.packs[pack];
                    if (!pack) return;

                    added?.forEach(path => {
                        this.addFile(pack, path);
                    });

                    deleted?.forEach(path => {
                        this.deleteFile(pack, path);
                    });

                    this.rebuildTree();
                }
            },
            created() {
                menu = this;
            }
        }
    });
}

function connectToSocket({ address, key }) {
    if (bridgeState.client) bridgeState.client.end();
    bridgeState.client = new net.Socket();

    const ip = address.split(":")[0];
    const port = address.split(":")[1];
    bridgeState.client.connect(port, ip, () => {
        bridgeState.client.write(JSON.stringify({ type: MESSAGES.CREATE, key }) + '\n');
    });

    bridgeState.client.on('close', () => {
        Blockbench.showMessageBox({
            title: 'Disconnected!',
            message: 'The Hytale bridge was closed.'
        });

        menu.updateFileTrees({});
    });

    bridgeState.client.on('error', (err) => {
        Blockbench.showMessageBox({
            title: 'Error!',
            message: 'An error occurred with the bridge.'
        });
    });

    bridgeState.client.on('data', data => {
        bridgeState.buffer += data.toString();
        let i;
        while ((i = bridgeState.buffer.indexOf('\n')) !== -1) {
            const raw = bridgeState.buffer.slice(0, i);
            bridgeState.buffer = bridgeState.buffer.slice(i + 1);
            if (!raw.trim()) continue;
            const message = JSON.parse(raw);

            switch (message.type) {
                case MESSAGES.CREATED: {
                    bridgeState.uuid = message.uuid;
                    requestFileTree();
                    // POPUP
                    break;
                }
                case MESSAGES.FILE_TREE: {
                    menu.updateFileTrees(message.packs);
                    break;
                }
                case MESSAGES.FILE: {
                    openFile(message);
                    break;
                }
                case MESSAGES.UPDATE: {
                    menu.applyUpdate(message.pack, message.added, message.deleted);
                    break;
                }
                default: console.log("Unknown message type received from server", message.type);
            }
        }
    });
}

function sendCommand(command, data = {}) {
    if (!bridgeState.client) return;
    bridgeState.client.write(JSON.stringify({
        type: MESSAGES.COMMAND,
        uuid: bridgeState.uuid,
        command,
        ...data
    }) + '\n');
}

function sendDisconnect() {
    sendCommand(COMMANDS.DISCONNECT);
}

function requestFileTree() {
    sendCommand(COMMANDS.FILE_TREE);
}

function requestFile(path, pack) {
    sendCommand(COMMANDS.FILE, { path, pack });
}

function openFile(message) {
    if (is(message.path, EXTENSIONS.MODEL)) {
        try {
            Codecs.blockymodel.load(message.data, {
                path: message.path,
                origin: 'Hytale Bridge'
            });
        } catch {
            // POPUP
        }
    } else if (is(message.path, EXTENSIONS.TEXTURE)) {
        try {
            if (!Project) return;

            const name = message.path.split('/').pop();
            const dataUrl = 'data:image/png;base64,' + message.data;

            // get or create texture
            let texture = Texture.all.find(t => t.name === name);
            if (!texture) {
                texture = new Texture({ name });
                texture.add(false);
            }

            texture.fromDataURL(dataUrl);

            texture.load(() => {
                // update uv size
                let size = [texture.width, texture.display_height];
                let frames = texture.frameCount;
                if (settings.detect_flipbook_textures.value == false || frames <= 2 || frames % 1) {
                    size[1] = texture.height;
                }
                texture.uv_width = size[0];
                texture.uv_height = size[1];

                texture.select();
                Canvas.updateAll();

                // POPUP
            });

            Canvas.updateAll();
        } catch {

        }
    }
}