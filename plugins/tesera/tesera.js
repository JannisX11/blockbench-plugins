(function() {

    console.log('Loaded Tesera plugin')

    const info = {
        title: 'Tesera game plugin',
        author: 'Tesera',
        description: 'This plugin can add custom properties to all selected cubes',
        icon: 'developer_mode',
        version: '0.0.3',
        variant: 'both',
        about: "This plugin is specifically designed as a tool for the developers of the Tesera game.\n\nIt introduces the following features:\n\n1. **Adding a Display**: The \"Add display\" feature in the \"Edit\" section allows developers to introduce display elements into the game.\n\n2. **Cube Flags Management**: This feature enables developers to assign flags to cubes, providing enhanced flexibility and control over their behavior.\n\n3. **Custom JSON Assignment to Cubes**: With this feature, developers can assign custom JSON to cubes. This opens up creative possibilities for interpreting and utilizing these JSONs within the game as the developers see fit.\n\n4. **Animation Tools Enhancement**: Adds a search bar for quickly finding animations by name and introduces customizable color highlighting for animation groups, improving organization and readability within the animation workspace.\n\nThese features are intended to facilitate the development process and provide expanded customization opportunities in Tesera.",
        tags: ["Plugins", "Tesera"],
        min_version: "4.8.0",
    }

    const removables = []
    const deletables = []
    const toolbars = []
    const listeners = []
    const default_value = {flags: [], json: null, material: 'regular'}
    const default_value_string = JSON.stringify(default_value)
    const tesera_css = `
    .tesera-widget {
        position: relative;
        margin: 4px;
        width: 100%;
    }
    #highlighting {
        position: absolute;
        top: 0;
        left: 0;
        margin: 0;
        padding: 4px;
        width: 100%;
        pointer-events: none;
        background: transparent;
    }
    textarea.input-property {
        background-color: var(--color-back);
        color: transparent;
        caret-color: white;
        padding: 4px;
    }
    textarea.input-property:read-only {
        opacity: .25;
    }
    textarea.input-property, #highlighting-content {
        display: block;
        width: 100%;
        height: 90px;
        font-family: var(--font-code);
        font-size: 14px;
    }
    .tesera-tag {
        padding: 3px 8px;
        border-radius: 2px;
        background-color: var(--color-button);
        display: inline-block;
        margin: 2px;
        line-height: 1em;
    }
    .tesera-tag:hover {
        background-color: rgba(255, 255, 255, .35);
    }
    .select_control_box {
        padding: 4px;
    }
    .tesera-delete-tag {
        border-radius: 50px;
        width: 16px;
        height: 16px;
        margin-left: .25em;
        background-color: rgba(0, 0, 0, .2);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    .tesera-delete-tag:hover {
        background-color: var(--color-close);
    }
    .tesera-select {
        width: 100%;
        border-radius: 4px;
        appearance: auto;
        padding: 0 .5em;
        height: 2em;
    }
    .panel_tab_list > .panel_handle {
        background-color: #3e90ff55;
        color: white;
    }
    .panel_tab_list > .panel_handle.selected {
        background-color: var(--color-accent);
    }
    .panel_tab_bar {
        border-bottom: 1px solid var(--color-accent);
    }
    .panel_menu_button {
        color: white;
    }
    #bb-tesera-anim-search
        margin: 4px;
        width: 100%;
        padding-left: .9em;
        margin: 0px;
    }
    #bb-tesera-anim-colors-button {
        margin: 0px;
        minWidth: auto;
    }
    `

    function CreateBBListener(event, callback) {
        Blockbench.on(event, callback)
        listeners.push({event, callback})
    }

    class TeseraPropertyEditWidget extends Widget {

        controls = []

        constructor(id, data) {
            if (typeof id == 'object') {
                data = id
                id = data.id
            }
            super(id, data)
            this.property_name = data.property_name
            this.value_name = data.value_name
            // deletables.push(this)
        }

        cloneObject(object) {
            return JSON.parse(JSON.stringify(object))
        }

        getProps() {
            return this.element?.[this.property_name] || null
        }

        setElementValue(name, value) {
            if(this.element) {
                const props = this.getProps()
                props[name] = value
                // remove props if equal with default
                if(JSON.stringify(props) == default_value_string) {
                    this.props = this.element[this.property_name] = null
                }
            }
        }

        // When select another cube
        update() {
            const element = Outliner.selected[0]
            this.element = element
            this.props = element ? element[this.property_name] : null
            for(const control of this.controls) {
                control.update()
            }
        }

        createWidgetNode() {
            const nodes = []
            for(const control of this.controls) {
                nodes.push(...control.nodes)
            }
            this.node = Interface.createElement('div', {class: 'widget tesera-widget'}, [
                ...nodes
            ])
            removables.push(this.node)
            deletables.push(new Property(Cube, 'array', this.property_name, {
                default: [],
                exposed: true,
            }))
        }

    }

    /*
    // Edit JSON
    class TeseraJSONWidget extends TeseraPropertyEditWidget {

        constructor(id, data) {
            super(id, data)
            this.type = 'jsonedit'
            this.controls.push(this.createJSONControl(this.value_name))
            this.createWidgetNode()
        }

        createJSONControl(value_name, options) {

            const code = this.jq_code = Interface.createElement('code', {class: 'language-json', id: 'highlighting-content'})
            const textarea = this.jq_textarea = Interface.createElement('textarea', {class: 'dark_bordered focusable_input input-property'})
            textarea.addEventListener('input', () => {
                if(this.element) {
                    const text = textarea.value
                    try {
                        const json = text.trim().length > 0 ? JSON.parse(text) : null
                        this.setElementValue(value_name, json)
                    } catch(e) {
                        // do nothing
                    }
                    this.updateJSON(text)
                }
            })

            const nodes = [
                textarea,
                Interface.createElement('pre', {id: 'highlighting', 'aria-hidden': true}, [
                    code
                ])
            ]

            return {update: () => {
                const element = this.element
                const text = element ? ((this.props && this.props[value_name]) ? JSON.stringify(this.props[value_name]) : '') : ''
                this.updateJSON(text)
            }, nodes}

        }

        updateJSON(text) {
            const ta = this.jq_textarea
            ta.value = text
            const code = this.jq_code
            code.textContent = text
            Prism.highlightElement(code)
            ta.readOnly = !this.element
        }

    }
    */

    // Editor multiselect
    class TeseraMultiselectWidget extends TeseraPropertyEditWidget {

        constructor(id, data) {
            super(id, data)
            this.type = 'flagsedit'
            this.controls.push(this.createMultiSelectPropertyControl(this.property_name, data.options))
            this.createWidgetNode()

        }

        createMultiSelectPropertyControl(property_name, options) {

            const div_flags = Interface.createElement('div', {})
            const select = Interface.createElement('select', {class: 'tesera-select'})
            const select_control_box = Interface.createElement('div', {class: 'select_control_box'}, [div_flags, select])

            removables.push(div_flags)
            removables.push(select)
            removables.push(select_control_box)

            const redrawSelect = () => {
                const props = this.getProps()
                const options_html = []
                options_html.push(`<option value="">Add...</option>`)
                for(const [title, value] of Object.entries(options)) {
                    if(!props || !props.includes(value)) {
                        options_html.push(`<option value="${value}">${title}</option>`)
                    }
                }
                if(props) {
                    div_flags.innerHTML = ''
                    for(const value of props) {
                        let title = value
                        for(let k in options) {
                            if(options[k] == value) {
                                title = k
                                break
                            }
                        }
                        const delete_tag_button = Interface.createElement('span', {class: 'tesera-delete-tag', 'data-value': value}, ['×'])
                        const ttg = Interface.createElement('span', {class: 'tesera-tag'}, [title, delete_tag_button])
                        removables.push(delete_tag_button, ttg)
                        div_flags.appendChild(ttg)
                        delete_tag_button.addEventListener('click', (e) => {
                            if(this.element) {
                                const value = e.srcElement.dataset.value
                                if(value) {
                                    const props = this.getProps()
                                    if(props) {
                                        const list = props
                                        const index = list.indexOf(value)
                                        if(index >= 0) {
                                            Undo.initEdit({ elements: [this.element] })
                                            list.splice(index, 1)
                                            this.element[property_name] = JSON.parse(JSON.stringify(list))
                                            Undo.finishEdit('Edit Tesera Flags', { elements: [this.element] })
                                            redrawSelect()
                                        }
                                    }
                                }
                            }
                        })
                    }
                }
                select.innerHTML = options_html.join('\n')
            }

            //
            select.addEventListener('change', (e) => {
                if(this.element) {
                    const value = e.srcElement.value
                    if(value) {
                        const props = this.getProps()
                        if(props) {
                            const before = JSON.parse(JSON.stringify(this.element[property_name]))
                            Undo.initEdit({ elements: [this.element] })
                            this.element[property_name] = [...before, value]
                            Undo.finishEdit('Edit Tesera Flags')
                            redrawSelect()
                        }
                    }
                }
            })

            redrawSelect()

            CreateBBListener('undo', redrawSelect)
            CreateBBListener('redo', redrawSelect)

            return {update: () => {redrawSelect()}, nodes: [select_control_box]}
        }

    }

    //
    class MyToolbar extends Toolbar {

        constructor(options) {
            super(options)
            this.condition = () => (selected.length && Modes.edit)
        }

        update() {
            super.update()
            for(const control of this.children) {
                control.update()
            }
        }

    }

    // Create toolbar
    function createToolbar(name, widgets) {
        const toolbar = new MyToolbar({
            id:       `tb_${name}`.toLowerCase().replaceAll(' ', '_').trim(),
            name:     name,
            label:    true,
            children: widgets.map((w) => w.id)
        })
        Interface.Panels.element.addToolbar(toolbar)
        toolbars.push(toolbar)
    }

    // добавляем новый режим в UI
    function initViewDisplay() {

        // debugger

        // const tooltipSlot = new DisplaySlot({
        //     id: 'tooltip_view',
        //     name: 'Tooltip View',
        //     translation: [0, 8, 0],
        //     rotation: [30, 225, 0],
        //     scale: [0.65, 0.65, 0.65],
        //     reference: 'player'
        // });

        // DisplayMode

        const ID = 'tooltip_view';

        // 1. Создаём точную копию структуры как у ground/fixed
        DisplayMode[ID] = {
            translation: [0, 8, 0],
            rotation: [30, 225, 0],
            scale: [0.65, 0.65, 0.65]
        };

        // 2. Создаём функцию загрузки — один в один как loadGround()
        DisplayMode['load_' + ID] = function() {
            DisplayMode.selected = ID;
            loadDisp(ID);
            display_preview.loadAnglePreset({
                position: [-30, 45, -30],
                target: [0, 8, 0]
            });
            setDisplayArea(10, 6, 10, 0, 8, 0, 0.65, 0.65, 0.65);
            Canvas.ground_animation = false;
            displayReferenceObjects.bar(['player']);
            updateDisplayPreview();
        };

        /*
            // 3. Добавляем кнопку в боковую панель
            const NAME = 'Tooltip View';
            new Action('display_' + ID, {
                name: NAME,
                icon: 'fa-info-circle',
                click: DisplayMode['load_' + ID]
            }).addTo('#display_panel_bar');

            // 4. Добавляем в экспорт
            const formats = ['bedrock', 'bedrock_old', 'java_block', 'optifine_entity', 'modded_entity'];
            formats.forEach(f => {
                if (Formats[f]?.display_slots) {
                    Formats[f].display_slots.push(ID);
                }
            });

            console.log('%c[tooltip_view] УСПЕШНО ЗАГРУЖЕН В 5.0.3', 'color: #00ff00; font-weight: bold');
        */

        // добавляем сохранение и экспорт
        // const orig_toJSON = Model.prototype.export
        // Model.prototype.export = function(format, options) {
        //     const data = orig_toJSON.call(this, format, options)
        //     if (!data.display) data.display = {}
        //     const disp = DisplayMode.all['custom_view']
        //     if (disp) {
        //         data.display.custom_view = {
        //             rotation: disp.rotation,
        //             translation: disp.translation,
        //             scale: disp.scale,
        //         }
        //     }
        //     return data
        // }

    }

    // Init display
    function initDisplay() {
        try {
            class DisplayElement extends Cube {
                has_uv_cube_face_bar = true;
                constructor(data, uuid) {
                    super(data, uuid)
                    this.name = 'display'
                    this.type = 'display'
                }

                // Если нужно кастомизировать экспорт в JSON (для сохранения модели)
                toJSON() {
                    let json = super.toJSON()
                    // json.customProperty = this.customProperty // кастомные данные
                    json.type = 'display'
                    return json
                }

                // get type() {
                //     // TODO: dirty hack
                //     return new Error().stack.includes('vue.min.js') ? 'cube' : 'display'
                // }
            }
            DisplayElement.prototype.title = 'Display';
            // DisplayElement.prototype.type = 'display';
            DisplayElement.prototype.icon = 'fa fa-image';
            DisplayElement.prototype.needsUniqueName = true;
            // TODO: clone peoperties
            // DisplayElement.properties
            // deletables.push(new Property(DisplayElement, 'string', 'name', {default: 'display'}))
            OutlinerElement.registerType(DisplayElement, 'display')
            let add_action = new Action('add_display', {
                name: 'Add Display',
                icon: 'fa-image',
                category: 'edit',
                condition: () => Modes.edit,
                click() {
                    Undo.initEdit({outliner: true, elements: [], selection: true});
                    var base_display = new DisplayElement().init()
                    var group = getCurrentGroup();
                    base_display.addTo(group)
                    if (Format.bone_rig && group) {
                        var pos1 = group.origin.slice()
                        base_display.extend({
                            position: pos1
                        })
                    }
        
                    if (Group.selected) Group.selected.unselect()
                    base_display.select()
                    Undo.finishEdit('Add display', {outliner: true, elements: selected, selection: true});
                    Blockbench.dispatchEvent( 'add_display', {object: base_display} )
                    return base_display
                }
            })
            Interface.Panels.outliner.menu.addAction(add_action, '3')
            Toolbars.outliner.add(add_action, '3')
            MenuBar.menus.edit.addAction(add_action, '8')
            deletables.push(add_action)
        } catch(e) {
            console.error(e)
        }
    }

    const def_colors = {
        idle:        '#DFCFBE',
        firstperson: '#D65076',
        emote:       '#f4d90a',
        walk:        '#009B77',
        sitting:     '#88B04B',
        levitate:    '#92A8D1',
        sneak:       '#B565A7',
        sleep:       '#EFC050',
        attack:      '#E15D44',
    }

    class TeseraProject {

        constructor(id) {
            this.id = id
            this.groups = {}
            this.save_key = `tesera_project_${id}`
            this.load()
        }

        load() {
            let saved_data = localStorage.getItem(this.save_key)
            saved_data = saved_data ? JSON.parse(saved_data) : null
            if(saved_data) {
                Object.assign(this, saved_data)
            }
        }

        save() {
            const saved_data = {
                groups: this.groups
            }
            localStorage.setItem(this.save_key, JSON.stringify(saved_data))
        }

        getGroup(name) {
            let group = this.groups[name]
            if(!group) {
                group = this.groups[name] = {folded: false}
            }
            return group
        }

    }

    class TeseraPlugin {
        projects = new Map()
        div
        input
        last_query = ''
        anim_colors = {}
        dialog = null
        TeseraProjects = new Map()
        panel = Interface.Panels.animations
        colors_key = 'madcraft-anim_colors'
        storage_name = 'madcraft'

        static on_keydown = async (e) => {

            if(e.code !== 'KeyV' || !e.ctrlKey) return

            const el = document.activeElement
            if(
                !el ||
                !(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') ||
                el.readOnly ||
                el.disabled
            ) return

            e.preventDefault()

            const text = await navigator.clipboard.readText()
            const start = el.selectionStart
            const end   = el.selectionEnd

            el.value =
                el.value.slice(0, start) +
                text +
                el.value.slice(end)

            const pos = start + text.length
            el.setSelectionRange(pos, pos)
            el.dispatchEvent(new Event('input', { bubbles: true }))

        }

        constructor() {

            this.anim_colors = this.loadColors()
            this.createCubeProperties()
            this.createDialog()

            deletables.push(this.panel.on('update', (args) => {
                // console.log('panel:on', args)
                if(args.show) {
                    this.addSearchField()
                }
            }))

        }

        // dialog
        createDialog() {
            const that = this    
            let prop = JSON.stringify(this.anim_colors, null, 4)
            this.dialog = new Dialog({
                id: this.colors_key,
                title: 'Enter JSON Colors',
                form: {
                    custom_text: { label: 'Colors', type: 'textarea', value: prop },
                },
                onConfirm(form_result) {
                    prop = form_result.custom_text
                    that.saveColors(prop)
                }
            })
            deletables.push(this.dialog)
        }

        getProjectID() {
            return Project.name
        }

        getProject() {
            const id = this.getProjectID()
            // return Project.tesera_project
            let project = this.projects.get(id)
            if(project) {
                return project
            }
            project = new TeseraProject(id)
            this.projects.set(project.id, project)
            return project
        }

        loadColors() {
            let str = localStorage.getItem(this.colors_key) || JSON.stringify(def_colors, null, 4)
            let json = JSON.parse(str) || def_colors
            return json
        }

        saveColors(colors) {
            let json = JSON.parse(colors)
            if(json) {
                localStorage.setItem(this.colors_key, colors)
                Object.assign(this.anim_colors, json)
                this.filterAnimations(this.last_query)
            }
        }

        toggleGroup(el, group_name, is_group) {
            const { input } = this
            el.style.backgroundColor = is_group ? '#ffffff22' : 'revert-layer'
            // toggler
            let toggler = el.querySelector('.icon-open-state')
            if(!toggler) {
                toggler = document.createElement('i')
                toggler.classList.add('icon-open-state', 'fa', 'fa-angle-down')
                toggler.style.display = 'flex'
                toggler.style.alignItems = 'center'
                toggler.onclick = () => {
                    const project = this.getProject()
                    const group = project.getGroup(group_name)
                    group.folded = !group.folded
                    project.save()
                    this.filterAnimations(input.value)
                }
                el.prepend(toggler)
            }
            toggler.style.display = is_group ? 'flex' : 'none'
            // 
            for(const child of el.children) {
                const classes = child.classList
                if(classes.contains('material-icons') || classes.contains('in_list_button')) {
                    child.style.display = is_group ? 'none' : 'unset'
                } else if(child.tagName == 'LABEL') {
                    child.style.textAlign = is_group ? 'center' : 'left'
                }
            }
        }

        filterAnimations(query) {
            const lower = this.last_query = query.toLowerCase()
            let group_name = '_root_'
            const project = this.getProject()

            Animator.animations.forEach(anim => {
                const list_elem = this.panel.node.querySelector(`[anim_id="${anim.uuid}"]`)
                if (!list_elem) {
                    console.log('no list_elem')
                    return
                }
                const name = anim.name.toLowerCase()
                let color = '#ffffff22'
                for(const [key, value] of Object.entries(this.anim_colors)) {
                    if(name.startsWith(key)) {
                        color = value
                        break
                    }
                }
                let is_group = name.includes('888') || name.includes('---') || name.includes('===')
                if(is_group) {
                    group_name = name
                }
                const group_visible = !project.getGroup(group_name).folded
                let is_visible = (name.includes(lower) && group_visible) || is_group
                list_elem.style.borderLeft = `4px solid ${color}`
                list_elem.style.display = is_visible ? 'revert-layer' : 'none'
                this.toggleGroup(list_elem, group_name, is_group)
            })
        }

        addSearchField() {
            const anim_list = this.panel.node.querySelector('.toolbar')
            if (!anim_list) return
            let div = this.div
            if (!div /*|| !document.body.contains(div)*/) {
                div = this.div = document.createElement('div')
                div.style.display = 'flex'
                div.style.flexDirection = 'row'
                const input = this.input = document.createElement('input', {id: 'bb-tesera-anim-search'})
                    input.style.margin = '4px'
                    input.style.width = '100%'
                    input.style.paddingLeft = '.9em'
                    input.style.margin = '0px'
                input.placeholder = 'Search animations...'
                input.value = this.last_query
                input.oninput = () => this.filterAnimations(input.value)
                div.appendChild(input)
                const button = document.createElement('button', {id: 'bb-tesera-anim-colors-button'})
                    button.style.margin = '0px'
                    button.style.minWidth = 'auto'
                button.innerHTML = '<i class="material-icons notranslate icon">tune</i>'
                button.onclick = () => this.dialog.show()
                div.appendChild(button)
                removables.push(this.div)
                if (div.parentElement !== anim_list.parentElement) {
                    anim_list.appendChild(div)
                }
                this.filterAnimations(this.input.value)
            }
        }

        /**
         * Create properties for all Cubes
         */
        createCubeProperties() {

            const { storage_name } = this

            // ---------- UI properties ----------

            deletables.push(new Property(Cube, 'string', 'tesera_material', {
                default: 'regular',
                exposed: true,
                label: 'Material',
                inputs: {
                    element_panel: {
                        input: {
                            type: 'select',
                            options: {
                                regular: 'Regular',
                                singleface: 'Singleface',
                                doubleface: 'Doubleface',
                                doubleface_solid: 'Doubleface solid',
                                transparent: 'Transparent',
                                doubleface_transparent: 'Doubleface + Transparent',
                                decal1: 'Decal 1',
                                decal2: 'Decal 2',
                            },
                        },
                    },
                },
            }))

            createToolbar('Tesera flags', [new TeseraMultiselectWidget('tesera_cube_flags_widget', {property_name: 'tesera_flags', options: {
                'ENCHANTED_ANIMATION': 'FLAG_ENCHANTED_ANIMATION',
                'FLUID_ERASE':         'FLAG_FLUID_ERASE',
                'LEAVES':              'FLAG_LEAVES',
                'LIGHT_GRID':          'FLAG_LIGHT_GRID',
                'LOOK_AT_CAMERA':      'FLAG_LOOK_AT_CAMERA',
                'LOOK_AT_CAMERA_HOR':  'FLAG_LOOK_AT_CAMERA_HOR',
                'MIR2_TEX':            'FLAG_MIR2_TEX',
                'NO_CAN_TAKE_AO':      'FLAG_NO_CAN_TAKE_AO',
                'NO_CAN_TAKE_LIGHT':   'FLAG_NO_CAN_TAKE_LIGHT',
                'NO_FOG':              'FLAG_NO_FOG',
                'RAIN_OPACITY':        'FLAG_RAIN_OPACITY',
                'TORCH_FLAME':         'FLAG_TORCH_FLAME',
                'WAVES_VERTEX':        'FLAG_WAVES_VERTEX',
                'NORMAL_UP':           'FLAG_NORMAL_UP',
            }})])

            deletables.push(new Property(Cube, 'string', 'tesera_json', {
                default: '',
                exposed: true,
                label: 'Tesera JSON',
                inputs: {
                    element_panel: {
                        input: { type: 'textarea' },
                    },
                },
            }))

            // ---------- LOAD: tesera -> UI ----------

            CreateBBListener('load_project', (data) => {
                for(const el of data.model.elements) {
                    if(!el[this.storage_name]) continue
                    for(const k in el[this.storage_name]) {
                        switch(k) {
                            case 'json':
                                el.tesera_json = el[this.storage_name].json ? JSON.stringify(el[this.storage_name].json, null, 4) : ''
                                break
                            default:
                                el[`tesera_${k}`] = el[this.storage_name][k]
                                break
                        }
                    }
                    delete(el[this.storage_name])
                }
            })

            // ---------- SAVE: UI -> madcraft ----------
            CreateBBListener('save_project', (data) => {
                for(const el of data.model.elements) {
                    const tesera = {}
                    for(const k in el) {
                        if(!k.startsWith('tesera_')) continue
                        const value = el[k]
                        const ik = k.slice(7)
                        switch(ik) {
                            case 'json': {
                                try {
                                    tesera[ik] = JSON.parse(value) || null
                                } catch {
                                    tesera[ik] = null
                                }
                                break
                            }
                            default: {
                                tesera[ik] = value
                                break
                            }
                        }
                        if(tesera[ik] == null || tesera[ik] === '' || (Array.isArray(tesera[ik]) && tesera[ik].length === 0)) {
                            delete tesera[ik]
                        }
                        delete el[k]
                    }
                    if(Object.keys(tesera).length === 0) {
                        delete el[this.storage_name]
                        continue
                    }
                    if(Object.keys(tesera).length) {
                        el[this.storage_name] = tesera
                    }
                }
            })
        }

    }

    Plugin.register('tesera', {
        ...info,

        onload() {

            console.log('Loading Tesera plugin...')

            const tesera_plugin = new TeseraPlugin()

            // Keydown listener (Fix Ctrl+V and Ctrl+A in textarea and input)
            window.addEventListener('keydown', TeseraPlugin.on_keydown)

            // CSS
            deletables.push(Blockbench.addCSS(tesera_css))

            // Display
            // initDisplay()
            // Init display
            // initViewDisplay()

            /*
                // Create toolbars
                // createToolbar('Tesera JSON', [new TeseraJSONWidget('tesera_cube_json_widget', {property_name, value_name: 'json'})])

                CreateBBListener('load_project', data => {

                    CreateBBListener('load_project', () => {
                        Cube.all.forEach(c => {
                            const old = c[property_name]
                            if(!old) return
                            if(old.material) c.tesera_material = old.material
                            if(Array.isArray(old.flags)) c.tesera_flags = old.flags
                            if(old.json != null) c.tesera_json = JSON.stringify(old.json)
                            c[property_name] = null
                        })
                    })
                })
            */

        },

        onunload() {
            console.log('Unloading Tesera plugin...')
            window.removeEventListener('keydown', TeseraPlugin.on_keydown)
            for(const item of deletables) {
                item.delete()
            }
            for(const item of removables) {
                item.remove()
            }
            for(const toolbar of toolbars) {
                // Interface.Panels.element.removeToolbar(toolbar)
                toolbar.remove()
            }
            for(const listener of listeners) {
                Blockbench.removeListener(listener.event, listener.callback)
            }
            deletables.length = 0
            removables.length = 0
            toolbars.length = 0
            listeners.length = 0

            console.log(Interface.Panels.element.toolbars.length)
            console.log(Interface.Panels.element.toolbars.map(t => t.id))
            console.log(Object.keys(Cube.properties).filter(k => k.startsWith('tesera')))

        }

    })

})()
