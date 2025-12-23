(function() {

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

    const property_name = 'madcraft'
    const removables = []
    const deletables = []
    const default_value = {flags: [], json: null, material: 'regular'}
    const default_value_string = JSON.stringify(default_value)
    const madcraft_css = `
    .madcraft-widget {
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
    .madcraft-tag {
        padding: 3px 8px;
        border-radius: 2px;
        background-color: var(--color-button);
        display: inline-block;
        margin: 2px;
        line-height: 1em;
    }
    .madcraft-tag:hover {
        background-color: rgba(255, 255, 255, .35);
    }
    .select_control_box {
        padding: 4px;
    }
    .madcraft-delete-tag {
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
    .madcraft-delete-tag:hover {
        background-color: var(--color-close);
    }
    .madcraft-select {
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
    `

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
        }

        cloneObject(object) {
            return JSON.parse(JSON.stringify(object))
        }

        getProps() {
            if(this.props) {
                return this.props
            }
            if(!this.element) {
                return null
            }
            // clone default prop value
            return this.props = this.element[this.property_name] = this.cloneObject(default_value)
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
            this.node = Interface.createElement('div', {class: 'widget madcraft-widget'}, [
                ...nodes
            ])
        }

    }

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

    // Editor multiselect
    class TeseraMultiselectWidget extends TeseraPropertyEditWidget {

        constructor(id, data) {
            super(id, data)
            this.type = 'flagsedit'
            this.controls.push(this.createMultiSelectPropertyControl(this.value_name, data.options))
            this.createWidgetNode()
        }

        createMultiSelectPropertyControl(property_name, options) {

            const div_flags = Interface.createElement('div', {})
            const select = Interface.createElement('select', {class: 'madcraft-select'})
            const select_control_box = Interface.createElement('div', {class: 'select_control_box'}, [div_flags, select])

            const redrawSelect = () => {
                const props = this.getProps()
                const options_html = []
                options_html.push(`<option value="">Add...</option>`)
                for(const [title, value] of Object.entries(options)) {
                    if(!props || !props[property_name].includes(value)) {
                        options_html.push(`<option value="${value}">${title}</option>`)
                    }
                }
                if(props) {
                    div_flags.innerHTML = ''
                    for(const value of props[property_name]) {
                        let title = value
                        for(let k in options) {
                            if(options[k] == value) {
                                title = k
                                break
                            }
                        }
                        const delete_tag_button = Interface.createElement('span', {class: 'madcraft-delete-tag', 'data-value': value}, ['×'])
                        div_flags.appendChild(Interface.createElement('span', {class: 'madcraft-tag'}, [title, delete_tag_button]))
                        delete_tag_button.addEventListener('click', (e) => {
                            if(this.element) {
                                const value = e.srcElement.dataset.value
                                if(value) {
                                    const props = this.getProps()
                                    if(props) {
                                        const list = props[property_name]
                                        const index = list.indexOf(value)
                                        if(index >= 0) {
                                            list.splice(index, 1)
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
                            props[property_name].push(value)
                            redrawSelect()
                        }
                    }
                }
            })

            redrawSelect()

            return {update: () => {redrawSelect()}, nodes: [select_control_box]}
        }

    }

    // Editor select
    class TeseraSelectWidget  extends TeseraPropertyEditWidget {

        constructor(id, data) {
            super(id, data)
            this.type = 'selectedit'
            this.controls.push(this.createSelectPropertyControl(this.value_name, data.options))
            this.createWidgetNode()
        }

        createSelectPropertyControl(property_name, options) {

            const select = Interface.createElement('select', {class: 'madcraft-select'})
            const select_control_box = Interface.createElement('div', {class: 'select_control_box'}, [select])

            const redrawSelect = () => {
                const props = this.getProps()
                const options_html = []
                options_html.push(`<option value="">Select...</option>`)
                for(const [title, value] of Object.entries(options)) {
                    const selected = props ? (props[property_name] == value ? 'selected' : null) : null
                    options_html.push(`<option value="${value}" ${selected}>${title}</option>`)
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
                            props[property_name] = value
                            // redrawSelect()
                        }
                    }
                }
            })

            redrawSelect()

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
        removables.push(toolbar)
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

    Plugin.register('tesera', {
        ...info,

        onload() {
            // Create new property for all Cubes
            deletables.push(new Property(Cube, 'instance', property_name, {default: null, exposed: true, label: "Tesera cube properties" }))
            // CSS
            Blockbench.addCSS(madcraft_css)
            // Display
            initDisplay()
            // Create toolbars
            createToolbar('Tesera JSON', [new TeseraJSONWidget('madcraft_cube_json_widget', {property_name, value_name: 'json'})])
            createToolbar('Tesera material', [new TeseraSelectWidget('madcraft_cube_material_widget', {property_name, value_name: 'material', options: {
                'Regular':                  'regular',
                'Singleface':               'singleface',
                'Doubleface':               'doubleface',
                'Doubleface solid':         'doubleface_solid',
                'Transparent':              'transparent',
                'Doubleface + Transparent': 'doubleface_transparent',
                'Decal 1':                  'decal1',
                'Decal 2':                  'decal2',
            }})])
            createToolbar('Tesera flags', [new TeseraMultiselectWidget('madcraft_cube_flags_widget', {property_name, value_name: 'flags', options: {
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

            // animations search

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
x
                constructor(id) {
                    this.id = id
                    this.groups = {}
                    this.save_key = `madcraft_project_${id}`
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
                MadCraftProjects = new Map()
                panel = Interface.Panels.animations
                colors_key = 'madcraft-anim_colors'
    
                constructor() {
                        
                    this.anim_colors = this.loadColors()

                    this.createDialog()
        
                    this.panel.on('update', (args) => {
                        console.log('panel:on', args)
                        if(args.show) {
                            this.addSearchField()
                        }
                    })

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
                }

                getProjectID() {
                    return Project.name
                }
    
                getProject() {
                    const id = this.getProjectID()
                    // return Project.madcraft_project
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
                    if (!div || !document.body.contains(div)) {
                        div = this.div = document.createElement('div')
                        div.style.display = 'flex'
                        div.style.flexDirection = 'row'
                        const input = this.input = document.createElement('input')
                        input.placeholder = 'Search animations...'
                        input.style.margin = '4px'
                        input.style.width = '100%'
                        input.style.paddingLeft = '.9em'
                        input.style.margin = '0px'
                        input.value = this.last_query
                        input.oninput = () => this.filterAnimations(input.value)
                        div.appendChild(input)
                        const button = document.createElement('button')
                        button.innerHTML = '<i class="material-icons notranslate icon">tune</i>'
                        button.style.margin = '0px'
                        button.style.minWidth = 'auto'
                        button.onclick = () => this.dialog.show()
                        div.appendChild(button)
                    }
                    if (div.parentElement !== anim_list.parentElement) {
                        anim_list.appendChild(div)
                    }
                    this.filterAnimations(this.input.value)
                }

            }

            const madcraft_plugin = new TeseraPlugin()

            Blockbench.on('load_project', data => {
                // Project.madcraft_project = data.model.madcraft_project || {
                //     groups: {}
                // }
                // Project.madcraft_project = data.model.madcraft_project || {
                //     groups: {}
                // }
                madcraft_plugin.addSearchField()
            })
            
            // Blockbench.on('save_project', (event) => {
            //     event.model.madcraft_project = Project.madcraft_project
            // })


        },

        onunload() {
            deletables.forEach(action => {
                action.delete();
            })
            removables.forEach(action => {
                action.remove();
            })
        }

    })

})()
