(function () {
    let pluginAction;
    let hotkeySetting;

    const RENDER_ORDER_BONE = 500;
    const RENDER_ORDER_HELPER = 400;

    // Visual constants
    const BONE_RADIUS = 0.3;          // bone thickness
    const AXES_HELPER_SIZE = 3;        // axis helper size
    const JOINT_RADIUS = 0.3;         // joint sphere radius

    // --- RESOURCE MANAGER ---

    const ResourceManager = {
        boneMaterial: new THREE.MeshBasicMaterial({ depthTest: false, depthWrite: false }),
        jointMaterial: new THREE.MeshBasicMaterial({ depthTest: false, depthWrite: false }),
        transparentMaterial: new THREE.MeshPhongMaterial({ transparent: true, opacity: 0.25, side: THREE.DoubleSide }),

        boneGeometry: new THREE.CylinderGeometry(0, 1, 1, 8),
        jointGeometry: new THREE.SphereGeometry(JOINT_RADIUS, 12, 12),

        lastAccentColor: null,
        lastTextColor: null,

        init() { this.updateColors(); },
        updateColors() {
            try {
                const styles = getComputedStyle(document.documentElement);
                const accentColor = (styles.getPropertyValue('--color-accent') || '#74c7f7').trim();
                const textColor = (styles.getPropertyValue('--color-text') || '#E0E0E0').trim();

                if (accentColor !== this.lastAccentColor || textColor !== this.lastTextColor) {
                    this.boneMaterial.color.set(accentColor);
                    this.jointMaterial.color.set(accentColor);
                    this.transparentMaterial.color.set(textColor);
                    this.lastAccentColor = accentColor;
                    this.lastTextColor = textColor;
                }
            } catch (err) { console.error("Bone View: Could not update theme colors.", err); }
        },
        dispose() {
            this.boneMaterial.dispose();
            this.jointMaterial.dispose();
            this.transparentMaterial.dispose();
            this.boneGeometry.dispose();
            this.jointGeometry.dispose();
        }
    };

    // --- INDICATOR MANAGER ---

    const IndicatorManager = (function () {
        const pool = new Map(); // group.uuid -> {arrow, axes, joint}

        function makeIndicators() {
            const arrow = new THREE.Mesh(ResourceManager.boneGeometry, ResourceManager.boneMaterial);
            arrow.isBoneIndicator = true;
            arrow.renderOrder = RENDER_ORDER_BONE;

            const axes = new THREE.AxesHelper(AXES_HELPER_SIZE);
            axes.isBoneIndicator = true;
            axes.renderOrder = RENDER_ORDER_HELPER;

            const joint = new THREE.Mesh(ResourceManager.jointGeometry, ResourceManager.jointMaterial);
            joint.isBoneIndicator = true;
            joint.renderOrder = RENDER_ORDER_BONE;

            scene.add(arrow, axes, joint);
            return { arrow, axes, joint };
        }

        function disposeIndicators(entry) {
            if (!entry) return;
            scene.remove(entry.arrow, entry.axes, entry.joint);
        }

        function ensureFor(group) {
            let entry = pool.get(group.uuid);
            if (!entry) {
                entry = makeIndicators();
                pool.set(group.uuid, entry);
            }
            return entry;
        }

        function removeMissing() {
            const alive = new Set(Group.all.map(g => g.uuid));
            for (const [id, entry] of pool) {
                if (!alive.has(id)) {
                    disposeIndicators(entry);
                    pool.delete(id);
                }
            }
        }

        // Compute transforms for bone that connects child pivot -> parent pivot
        function computeBone(group) {
            if (!group.visibility || !group.mesh) return null;

            const worldPos = new THREE.Vector3();
            const worldQuat = new THREE.Quaternion();
            group.mesh.getWorldPosition(worldPos);
            group.mesh.getWorldQuaternion(worldQuat);

            const parentGroup = (group.parent && group.parent.type === 'group' && group.parent.mesh) ? group.parent : null;

            if (!parentGroup) {
                return { worldPos, worldQuat, valid: false };
            }

            const parentName = parentGroup.name?.toLowerCase();
            if (parentName === 'root') {
                return { worldPos, worldQuat, valid: false };
            }

            const parentPos = new THREE.Vector3();
            parentGroup.mesh.getWorldPosition(parentPos);
            const length = worldPos.distanceTo(parentPos);
            if (length <= 0.001) {
                return { worldPos, worldQuat, valid: false };
            }

            const dir = new THREE.Vector3().subVectors(parentPos, worldPos).normalize();
            return { worldPos, worldQuat, dir, length, parentPos, valid: true };
        }

        function updateTransforms() {
            ResourceManager.updateColors();
            const active = pluginAction && pluginAction.value;
            // offset by root x,y,z
            const rootOffset = new THREE.Vector3(0, 0, 0);
            if (Group.all.length) {
                var group = Group.all[0];
                var origin = group.origin;
                rootOffset.set(origin[0], origin[1], origin[2]);
            }

            for (const group of Group.all) {
                const entry = ensureFor(group);

                if (!active) {
                    entry.arrow.visible = false;
                    entry.axes.visible = false;
                    entry.joint.visible = false;
                    continue;
                }

                const data = computeBone(group);
                if (!data || !data.valid) {
                    entry.arrow.visible = false;
                    entry.axes.visible = false;
                    entry.joint.visible = false;
                    continue;
                }

                const offsetWorldPos = new THREE.Vector3().copy(data.worldPos).add(rootOffset);

                entry.axes.visible = true;
                entry.axes.position.copy(offsetWorldPos);
                entry.axes.quaternion.copy(data.worldQuat);

                entry.joint.visible = true;
                entry.joint.position.copy(offsetWorldPos);

                entry.arrow.visible = true;
                const qToDir = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), data.dir);
                entry.arrow.quaternion.copy(qToDir);

                const mid = new THREE.Vector3().copy(offsetWorldPos).addScaledVector(data.dir, data.length / 2);
                entry.arrow.position.copy(mid);

                entry.arrow.scale.set(BONE_RADIUS, data.length, BONE_RADIUS);
            }
        }

        return {
            refresh() { for (const g of Group.all) ensureFor(g); removeMissing(); updateTransforms(); },
            refreshPerFrame() { updateTransforms(); },
            hideAll() {
                for (const [, entry] of pool) {
                    entry.arrow.visible = false;
                    entry.axes.visible = false;
                    entry.joint.visible = false;
                }
            },
            removeAll() { for (const [, entry] of pool) disposeIndicators(entry); pool.clear(); }
        };
    })();

    // --- VIEW MANAGER ---

    const ViewManager = {
        enable() {
            for (const el of Outliner.elements) {
                el.hidden = true;
                el.unselect();
                if (el.faces || el instanceof TextureMesh) {
                    el.mesh.material = ResourceManager.transparentMaterial;
                    if (el.preview_controller?.updateUV) el.preview_controller.updateUV(el);
                }
            }
            Canvas.updateVisibility();
            IndicatorManager.refresh();
        },
        disable() {
            for (const el of Outliner.elements) el.hidden = false;
            Canvas.updateAllFaces();
            IndicatorManager.hideAll();
        }
    };

    // --- HOTKEY MANAGER ---

    const HotkeyManager = {
        hotkeyDesc: null,
        init() { this.update(); document.addEventListener('keydown', this.handler, true); },
        update() {
            const hotkeyStr = hotkeySetting ? hotkeySetting.value : 'Shift+B';
            this.hotkeyDesc = this.parse(hotkeyStr);
            this.updateActionLabel(hotkeyStr);
        },
        parse(str) {
            const desc = { ctrl: false, alt: false, shift: false, key: '' };
            const parts = str.toLowerCase().split('+').map(p => p.trim());
            desc.ctrl = parts.includes('ctrl');
            desc.alt = parts.includes('alt');
            desc.shift = parts.includes('shift');
            desc.key = parts.pop() || '';
            return desc;
        },
        handler(e) {
            if (document.activeElement?.matches('input, textarea')) return;
            const eventDesc = { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey, key: e.key.toLowerCase() };
            if (eventDesc.ctrl === HotkeyManager.hotkeyDesc.ctrl &&
                eventDesc.alt === HotkeyManager.hotkeyDesc.alt &&
                eventDesc.shift === HotkeyManager.hotkeyDesc.shift &&
                eventDesc.key === HotkeyManager.hotkeyDesc.key) {
                pluginAction.click();
            }
        },
        updateActionLabel(hotkeyStr) {
            if (pluginAction) { pluginAction.name = `Toggle Bone View (${hotkeyStr})`; MenuBar.update(); }
        },
        dispose() { document.removeEventListener('keydown', this.handler, true); }
    };

    // --- PLUGIN ---

    BBPlugin.register('bone_view', {
        title: 'Bone View',
        author: 'codename-B',
        description: 'Toggleable view to visualize group pivots and their connections as bones (Blender-like).',
        icon: 'icon.png',
        tags: ["Animation", "Rigging", "Viewport"],
        version: '1.0.0',
        min_version: '4.12.6',
        variant: 'both',
        has_changelog: true,
        creation_date: "2025-09-17",
        repository: "https://github.com/codename-B/bone-view",

        onload() {
            ResourceManager.init();

            hotkeySetting = new Setting('bone_view_hotkey', {
                name: 'Bone View Hotkey',
                description: 'Set the hotkey (e.g., "Ctrl+B", "Shift+Alt+V").',
                category: 'keybindings',
                value: 'Shift+B', type: 'string',
                onChange: () => HotkeyManager.update(),
            });

            pluginAction = new Toggle('toggle_bone_view', {
                name: 'Toggle Bone View (Shift+B)',
                icon: 'fa-bone',
                category: 'view',
                condition: () => !Project.box_uv,
                onChange: (is_enabled) => { is_enabled ? ViewManager.enable() : ViewManager.disable(); }
            });

            MenuBar.addAction(pluginAction, 'view');
            HotkeyManager.init();

            const hierarchyEvents = 'add_group remove_group undo redo update_outliner update_properties';
            Blockbench.on(hierarchyEvents, () => IndicatorManager.refresh());
            Blockbench.on('render_frame', () => IndicatorManager.refreshPerFrame());
        },

        onunload() {
            if (pluginAction && pluginAction.value) pluginAction.click();
            IndicatorManager.removeAll();
            pluginAction?.delete();
            hotkeySetting?.delete();
            HotkeyManager.dispose();
            ResourceManager.dispose();
        }
    });
})();