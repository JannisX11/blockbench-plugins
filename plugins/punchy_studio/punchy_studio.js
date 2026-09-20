(function() {
    const MC_ITEMS = [
    // --- Buckets (Most important for Punchy!) ---
    "water_bucket", "lava_bucket", "milk_bucket", "powder_snow_bucket",
    "pufferfish_bucket", "salmon_bucket", "cod_bucket", "axolotl_bucket", 
    "tadpole_bucket", "tropical_fish_bucket",

    // --- Weapons & Tools ---
    "wooden_sword", "stone_sword", "iron_sword", "golden_sword", "diamond_sword", "netherite_sword",
    "wooden_pickaxe", "stone_pickaxe", "iron_pickaxe", "golden_pickaxe", "diamond_pickaxe", "netherite_pickaxe",
    "wooden_axe", "stone_axe", "iron_axe", "golden_axe", "diamond_axe", "netherite_axe",
    "wooden_shovel", "stone_shovel", "iron_shovel", "golden_shovel", "diamond_shovel", "netherite_shovel",
    "wooden_hoe", "stone_hoe", "iron_hoe", "golden_hoe", "diamond_hoe", "netherite_hoe",
    "mace", "trident", "bow", "crossbow", "shield", "shears", "brush", "fishing_rod", "lead",

    // --- Wearables & Specials ---
    "elytra", "turtle_helmet", "spyglass", "compass", "recovery_compass", "clock", 
    "totem_of_undying", "bundle", "firework_rocket", "goat_horn",

    // --- Food & Potions ---
    "apple", "golden_apple", "enchanted_golden_apple", "melon_slice", "sweet_berries", 
    "glow_berries", "chorus_fruit", "honey_bottle", "glass_bottle", "potion", 
    "splash_potion", "lingering_potion", "experience_bottle",

    // --- Materials & Utility ---
    "stick", "blaze_rod", "breeze_rod", "feather", "flint", "amethyst_shard", 
    "echo_shard", "nether_star", "trial_key", "ominous_trial_key", "iron_ingot", 
    "gold_ingot", "diamond", "netherite_ingot", "emerald", "coal", "charcoal", 
    "raw_iron", "raw_gold", "raw_copper", "copper_ingot"
    ];

    // keybinds
    const COMMON_KEYS = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
    "MOUSE_4", "MOUSE_5", "R-ALT", "L-SHIFT"
    ];

    //kinds
    const COMPAT_CLASSES = [
        // --- Tools & Weapons ---
    "SWORD", "AXE", "PICKAXE", "HOE", "SHOVEL", "MACE", "SPEAR", "TRIDENT", 
    "SHIELD", "BOW", "CROSSBOW", "ARROW", "FISHING_ROD",

    // --- Block Categories ---
    "BLOCK", "FULL_BLOCK", "BUILDING_BLOCKS", "COLORED_BLOCKS", 
    "NATURAL_BLOCKS", "FUNCTIONAL_BLOCKS", "CHEST", "TORCH", 
    "LANTERN", "TRAPDOOR", "BUTTON_PLATE", "CARPET", "BED",

    // --- Special Physics & Entity Types ---
    "FLOWER_PENDULUM", "CREATURE_BUCKET", "BUCKET", "MINECART", "BOAT",

    // --- Items & Misc ---
    "SPYGLASS", "FLINT", "FOOD", "REDSTONE", "INGREDIENT", "SHUBBA_DUCK"
    ];


    if (typeof punchyExportAction !== 'undefined') punchyExportAction.delete();

    Plugin.register('punchy_studio', {
        title: 'Punchy! Studio',
        author: 'HamzaDev',
        icon: 'view_in_ar',
        version: '1.0.0',
        description: 'A custom-designed item model definition and compat exporter plugin for Punchy!',
        onload() {
            // COMPAT EXPORT ACTION
            this.compatExportAction = new Action('export_punchy_compat', {
                name: 'Punchy! Compat (.json)',
                icon: 'deployed_code_update',
                category: 'file',
                click: () => openCompatDialog()
            });
            MenuBar.addAction(this.compatExportAction, 'file.export');

            
            punchyExportAction = new Action('export_punchy_def_v1', {
                name: 'Punchy! Definition (.json)',
                icon: 'deployed_code_update',
                category: 'file',
                click: () => openExportDialog()
            });
            MenuBar.addAction(punchyExportAction, 'file.export');
        },
        onunload() {
            if (this.punchyExportAction) this.punchyExportAction.delete();
            if (this.compatExportAction) this.compatExportAction.delete();
        }
    });

    // COMPATIBILITY DIALOG

    function openCompatDialog() {
        let projectAnims = Animation.all.map(a => a.name);
        let classOptions = COMPAT_CLASSES.reduce((acc, curr) => ({...acc, [curr]: curr}), {"": "None"});

        let dialog = new Dialog({
            id: 'punchy_compat_dialog',
            title: 'Punchy! Studio - Compat Expoter V1',
            width: 800,
            form: {
                targetType: { 
                    label: 'Target Type', 
                    type: 'select', 
                    options: { itemClass: 'Item Class (SWORD, HOE...)', specificID: 'Specific Item ID' }, 
                    value: 'specificID' 
                },

                specificID: { 
                    label: 'Class/ID Name', 
                    type: 'text', 
                    value: 'minecraft:item',
                    condition: (formData) => formData.targetType === 'specificID'
                },
                itemKind: { 
                    label: 'Kind (Optional)', 
                    type: 'select', 
                    options: classOptions, 
                    value: "",
                    condition: (formData) => formData.targetType === 'specificID'
                },

                className: { 
                    label: 'Class/ID Name', 
                    type: 'select', 
                    options: classOptions, 
                    value: "",
                    condition: (formData) => formData.targetType === 'itemClass'
                }
            },
            
            
            component: {
                template: `
                    <div style="margin-top:15px; font-family: var(--font-stack);">
                        <div style="background: #21252b; border: 1px solid #181a1f; padding: 15px; border-radius: 6px; box-shadow: 0 4px 6px rgba(10, 10, 10, 0.3);">
                            <h5 style="margin: 0 0 12px 0; color: #3e90ff; font-weight: bold; text-transform: uppercase; font-size: 0.8em; letter-spacing: 1px;">Compatibility Event Matrix</h5>
                            <div id="compat_matrix" style="max-height: 450px; overflow-y: auto; background: #181a1f; border-radius: 4px; border: 1px solid #333; padding: 5px;">
                                ${generateEventMatrix(projectAnims)}
                            </div>
                        </div>
                    </div>
                `
            },
            onConfirm: (formData) => {
                saveCompatMaster(formData);
            }
        });
        dialog.show();
    }

    function saveCompatMaster(formData) {
        const targetType = formData.targetType;
        let finalKey, finalKind;

        if (targetType === 'itemClass') {
            finalKey = (formData.className || "UNKNOWN").trim();
            finalKind = null;
        } else {
            finalKey = (formData.specificID || "UNKNOWN").trim();
            finalKind = (formData.itemKind || "").trim();
        }

        let rootKey = targetType === 'itemClass' ? 'item' : 'itemSpecific';

        
        
        let innerContent = {};

        if (targetType === 'specificID' && finalKind) {
            innerContent.kind = finalKind;
        }

        innerContent.customAnimation = [];

        let output = { [rootKey]: { [finalKey]: innerContent } };

        const eventTypes = ['attack', 'mining', 'useItem', 'hand_in', 'hand_out', 'falling_on_ground', 'falling_on_water', 'inspect', 'triggerable'];

        eventTypes.forEach(type => {
            let mainSelect = document.querySelector(`.c_matrix_select[data-type="${type}"]`);
            let leftSelect = document.querySelector(`.c_matrix_left[data-type="${type}"]`);

            let mainClip = mainSelect?.value;
            let leftClip = leftSelect?.value;
            let var2 = type === 'attack' ? document.querySelector('.c_matrix_sub[data-field="var_2"]')?.value : null;
            let var3 = type === 'attack' ? document.querySelector('.c_matrix_sub[data-field="var_3"]')?.value : null;
            let crit = type === 'attack' ? document.querySelector('.c_matrix_sub[data-field="critical_hit"]')?.value : null;

            if (mainClip || leftClip || var2 || var3 || crit) {
                let entry = { type: type };
                if (type === 'attack') {
                    if (mainClip) entry.var_1 = mainClip;
                    if (var2) entry.var_2 = var2;
                    if (var3) entry.var_3 = var3;
                    if (crit) entry.critical_hit = crit;
                } else {
                    if (leftClip && mainClip) { 
                        entry.name_right = mainClip; 
                        entry.name_left = leftClip; 
                    } else if (leftClip) { 
                        entry.name_left = leftClip; 
                    } else if (mainClip) { 
                        entry.name = mainClip; 
                    }

                    if (type === 'triggerable') {
                        entry.key = document.querySelector('.c_matrix_key')?.value || "G";
                    }
                }
                
                output[rootKey][finalKey].customAnimation.push(entry);
            }
        });

        if (output[rootKey][finalKey].customAnimation.length > 0) {
            Blockbench.export({ 
                type: 'JSON', 
                extensions: ['json'], 
                name: 'compat.json', 
                content: JSON.stringify(output, null, 2) 
            });
            Blockbench.showQuickMessage("V16.6 Compat Exported (Ordered)!", 2000);
        } else {
            Blockbench.showQuickMessage("Hata: Klip seçilmedi!", 2000);
        }
    }

    function generateEventMatrix(anims) {
        const events = [
            { id: 'attack', label: 'Attack (Var 1)', special: 'attack' },
            { id: 'mining', label: 'Mining' },
            { id: 'useItem', label: 'Use Item', special: 'hand_split' },
            { id: 'hand_in', label: 'Hand In (Equip)', special: 'hand_split' },
            { id: 'hand_out', label: 'Hand Out', special: 'hand_split' },
            { id: 'falling_on_ground', label: 'Falling on Ground' },
            { id: 'falling_on_water', label: 'Falling in Water' },
            { id: 'inspect', label: 'Inspect', special: 'hand_split' },
            { id: 'triggerable', label: 'Triggerable', special: 'trigger' }
        ];

        let html = '';
        events.forEach(ev => {
            html += `
                <div style="padding: 12px; border-bottom: 1px solid #222; display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.85em; color: #3e90ff; font-weight: bold; width: 150px;">${ev.label}</span>
                        <select class="c_matrix_select" data-type="${ev.id}" style="flex: 1; background: #111; color: #fff; border: 1px solid #444; padding: 4px; border-radius: 3px;">
                            <option value="">None</option>
                            ${anims.map(n => `<option value="${n}">${n}</option>`).join('')}
                        </select>
                    </div>`;
            
            
            if (ev.special === 'hand_split' || ev.id === 'triggerable') {
                html += `
                    <div style="display: flex; gap: 10px; padding-left: 150px;">
                        <select class="c_matrix_left" data-type="${ev.id}" style="flex: 1; background: #111111; font-size: 0.75em; border: 1px solid #333; color: #888;">
                            <option value="">Left Hand Clip (Optional)</option>
                            ${anims.map(n => `<option value="${n}">${n}</option>`).join('')}
                        </select>
                        ${ev.id === 'triggerable' ? ` <label style="color: #666;">Key:</label> <select class="c_matrix_key" style="background: #111; color: #1a6caf; border: 1px solid #444; font-size: 0.8em; padding: 2px;">
                        ${COMMON_KEYS.map(k => `<option value="${k}" ${k === 'G' ? 'selected' : ''}>${k}</option>`).join('')} </select> ` : ''}
                    </div>`;
            }
            

            if (ev.special === 'attack') {
                html += `
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; padding-left: 150px;">
                        <select class="c_matrix_sub" data-type="attack" data-field="var_2" style="background: #111111; font-size: 0.75em; border: 1px solid #333; color: #888;">
                            <option value="">Var 2</option>
                            ${anims.map(n => `<option value="${n}">${n}</option>`).join('')}
                        </select>
                        <select class="c_matrix_sub" data-type="attack" data-field="var_3" style="background: #111111; font-size: 0.75em; border: 1px solid #333; color: #888;">
                            <option value="">Var 3</option>
                            ${anims.map(n => `<option value="${n}">${n}</option>`).join('')}
                        </select>
                        <select class="c_matrix_sub" data-type="attack" data-field="critical_hit" style="background: #111111; font-size: 0.75em; border: 1px solid #333; color: #888;">
                            <option value="">Critical Hit</option>
                            ${anims.map(n => `<option value="${n}">${n}</option>`).join('')}
                        </select>
                    </div>`;
            }

            html += `</div>`;
        });
        return html;
    }

    



    function openExportDialog() {
        let baseName = (Project.file_name && Project.file_name.includes('.')) 
                       ? Project.file_name.split('.')[0] 
                       : (Project.name || "punchy_item");

        let firstTex = Texture.all[0] ? Texture.all[0].name.replace('.png', '') : baseName;
        let projectAnims = Animation.all.map(a => a.name);

        let dialog = new Dialog({
            id: 'punchy_export_dialog',
            title: 'Punchy! Studio - Export Definition',
            width: 650,
            form: {
                namespace: {
                    label: 'Namespace',
                    type: 'text',
                    value: 'minecraft'
                }
            },
            component: {
                template: `
                    <div style="padding: 5px; font-family: var(--font-stack);">
                        
                        <div style="background: #21252b; border: 1px solid #181a1f; padding: 15px; border-radius: 6px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                            <h5 style="margin: 0 0 12px 0; color: #3e90ff; font-weight: bold; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;">Item Identification</h5>
                            <div style="display:flex; align-items:center; gap:12px;">
                                <div style="flex: 1;">
                                    <label style="font-size: 0.75em; color: #888; display: block; margin-bottom: 4px;">Quick Select</label>
                                    <select id="quick_item_select" style="font-size: 13px; width:100%; background:#111; color:white; border:1px solid #333; padding:6px; border-radius: 4px;">
                                        <option value=""> None </option>
                                        ${MC_ITEMS.map(i => `<option value="${i}">${i}</option>`).join('')}
                                    </select>
                                </div>
                                <div style="display: flex; align-items: center; justify-content: center; padding-top: 18px; color: #444; font-weight: bold;">OR</div>
                                <div style="flex: 1.5;">
                                    <label style="font-size: 0.75em; color: #888; display: block; margin-bottom: 4px;">Manual Item ID</label>
                                    <input type="text" id="itemID_manual" placeholder="e.g. dragon_sword" 
                                           style="width:100%; background:#111; color:white; border:1px solid #333; padding:6px; border-radius: 4px; box-sizing: border-box;">
                                </div>
                            </div>
                        </div>

                        <div style="background: #21252b; border: 1px solid #181a1f; padding: 15px; border-radius: 6px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                            <h5 style="margin: 0 0 12px 0; color: #3e90ff; font-weight: bold; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;">Bone Texture Mapping</h5>
                            <div id="diag_bone_list" style="max-height:140px; overflow-y:auto; background:#181a1f; border-radius: 4px; border: 1px solid #333;">
                                ${generateBoneRows()}
                            </div>
                        </div>

                        <div style="background: #21252b; border: 1px solid #181a1f; padding: 15px; border-radius: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                            <h5 style="margin: 0 0 12px 0; color: #3e90ff; font-weight: bold; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;">Animation States</h5>
                            <div id="diag_anim_list" style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                                ${generateAnimSelects(projectAnims)}
                            </div>
                        </div>

                        <div style="margin-top: 20px; font-size: 0.7em; color: #555; text-align: center;">
                            Punchy! System API 1.21.11 Compliant
                        </div>
                    </div>
                `
            },
            onConfirm: (formData) => {
                const results = gatherData(formData, baseName, firstTex);
                saveDefinition(results, baseName);
            }
        });
        dialog.show();
    }

    function generateBoneRows() {
        let html = '';
        Group.all.forEach((group, index) => {
            let options = Texture.all.map(t => `<option value="${t.name.replace('.png', '')}">${t.name}</option>`).join('');
            let bgColor = index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)';
            html += `
                <div style="display:flex; justify-content:space-between; padding:8px 12px; background:${bgColor}; border-bottom:1px solid #222; align-items:center;">
                    <span style="font-size:0.85em; color:#ddd; font-weight: 500;">${group.name}</span>
                    <select class="diag_tex_select" data-bone="${group.name}" style="background:#111; color:#3e90ff; border:1px solid #444; width:180px; padding: 3px; border-radius: 3px; font-size: 0.8em;">
                        <option value="">Default Texture</option>
                        ${options}
                    </select>
                </div>`;
        });
        return html;
    }

    function generateAnimSelects(projectAnims) {
        const types = ['idle', 'useItem', 'mining', 'falling', 'hand_in', 'hand_out'];
        return types.map(type => `
            <div style="background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px; border: 1px solid #333;">
                <label style="font-size:0.7em; color:#888; display:block; margin-bottom: 5px; text-transform: capitalize;">${type}</label>
                <select class="diag_anim_select" data-type="${type}" style="width:100%; background:#111; color:#fff; border:1px solid #444; padding:4px; border-radius: 3px; font-size: 0.85em;">
                    <option value=""> None </option>
                    ${projectAnims.map(name => `<option value="${name}">${name}</option>`).join('')}
                </select>
            </div>
        `).join('');
    }

    function gatherData(formData, baseName, firstTex) {
        let ns = formData.namespace.trim();
        
        // Smart Selection Logic
        let quickID = document.getElementById('quick_item_select').value;
        let manualID = document.getElementById('itemID_manual').value.trim();
        let chosenID = quickID || manualID || baseName;

        let itemsArray = [chosenID.includes(':') ? chosenID : `${ns}:${chosenID}`];
        
        let def = {
            items: itemsArray,
            geo: `${ns}:punchy/model_parts_items/geo/${baseName}.geo.json`,
            texture: `${ns}:punchy/model_parts_items/textures/${firstTex}`,
            animations: [`${ns}:punchy/model_parts_items/animations/${baseName}.animation.json`],
            bone_textures: [],
            modelPartsAnimation: []
        };

        document.querySelectorAll('.diag_tex_select').forEach(select => {
            if (select.value) {
                def.bone_textures.push({
                    texture: `${ns}:punchy/model_parts_items/textures/${select.value}`,
                    bones: [select.dataset.bone]
                });
            }
        });

        document.querySelectorAll('.diag_anim_select').forEach(select => {
            if (select.value) {
                def.modelPartsAnimation.push({
                    type: select.dataset.type,
                    name: select.value
                });
            }
        });

        if (def.bone_textures.length === 0) delete def.bone_textures;
        if (def.modelPartsAnimation.length === 0) delete def.modelPartsAnimation;

        return def;
    }

    function saveDefinition(data, name) {
        Blockbench.export({
            type: 'JSON',
            extensions: ['json'],
            name: name + '.json',
            content: JSON.stringify(data, null, 2)
        });
        Blockbench.showQuickMessage("Punchy Definition Exported!", 2000);
    }
})();