(function() {
    function getElementWidth(jqelement){        
        jqelement.attr('style',`width: fit-content`);
        $(document.body).append(jqelement);
        jqelement.attr('style',`width: max-content`);
        let width = jqelement.width();
        
        jqelement.remove();
        return width;
    }

    class PieMenu extends BarItem{
        /**
         * @type PieMenu
         */
        static active = null;
        static all = {};
        static TWO_PI = 6.283185307179586;
        static HALF_PI = 1.5707963267948966;
        static QUARTER_PI = 0.7853981633974483;
        static mouseEvent = null;
        static debugMode = false;

        /**
         * Create Pie Menu
         * @param {{
         * name: String,
         * id: String,
         * radius: Number,
         * structure: Array<Action | String>,
         * condition: any,
         * keybind: {key:Number,shift:boolean,ctrl:boolean,alt:boolean,meta:boolean},
         * skipExtraName: Boolean
         * }} data 
         */
        constructor(id, data){
            if (typeof id == 'object') {
                data = id;
                id = data.id;
            }
            if (!data.skipExtraName) {
                if (!data.name.endsWith(' Pie Menu')) {
                    data.name = tl(data.name) + ' Pie Menu';
                }
            }

            super(id, data);

            this._radius_ = data.radius !== undefined ? data.radius: -1; // negative radius means auto radius multiplied by the absoulte value
            this.structure = data.structure || [];
            this.node = $(`<div class=pieMenu><div class=pieSlices></div><h4></h4><div class=pieCenter><svg><defs><mask id=AngleIndicator><circle/></mask></defs><foreignObject mask=url(#AngleIndicator)><div class=gradient xmlns=http://www.w3.org/1999/xhtml /></foreignObject></svg></div></div>`);

            this.uuid = guid();

            PieMenu.all[this.uuid] = this;

            this.setName(this.name);

            this.cache = {
                isHold: false,
                lastCenter: [0,0]
            }

            if (this.id) this.setId(this.id);
        }
        get radius(){
            if (this._radius_ < 0) {
                let autoRadius = 0;
                let indices = [
                    this.actionIndexFromAngle(0,'deg'),
                    this.actionIndexFromAngle(90,'deg'),
                    this.actionIndexFromAngle(180,'deg'),
                    this.actionIndexFromAngle(270,'deg'),
                ]
                for (let i = 0; i < 4; i++) {
                        autoRadius += getElementWidth( this.buildAction( this.getActionAt(indices[i]) ) );
                }
                return ( autoRadius/2 ) * Math.abs(this._radius_);
            }
            return this._radius_;
        }
        set radius(value){
            return value;
        }
        equals(otherPieMenu) {
            return this.uuid == otherPieMenu.uuid;
        }
        setName(value) {
            this.name = value;
            this.setNodeTitle(value);
        }
        setNodeTitle(value){
            this.node.children('h4').html(value);
        }
        setId(value){
            this.id = value;
            this.node.attr('id', value);
            return this;
        }
        conditionMet(){
            return Condition(this.condition);
        }
        show(x = mouse_pos.x, y = mouse_pos.y){
            if (Project==0||Format==0) return;
            if (!this.conditionMet()) return;
            if (PieMenu.active && this.equals(PieMenu.active)) return;
            if (PieMenu.active) PieMenu.active.hide();
            PieMenu.active = this;
            this.build();

            let r = this.radius;
            // 30 is action heights
            x = Math.clamp(x, r+30, window.innerWidth - (r+30));
            y = Math.clamp(y, r+30, window.innerHeight - (r+30));

            this.node[0].style.left = x + 'px';
            this.node[0].style.top =  y + 'px';
            this.node[0].style.width = `calc(${r<<1}px + calc(var(--pie-major_radius)*2))` 
            this.node[0].style.height = `calc(${r<<1}px + calc(var(--pie-major_radius)*2))` 
            this.cache.lastCenter = [x,y];

            $(document.body).append(this.node)
        }
        hide(){
            PieMenu.active = undefined;
            this.node.remove();
        }

        // \ - - - /
        getActionAt(i){
            return typeof this.structure[i] == 'string' ? BarItems[this.structure[i]]: this.structure[i];
        }
        actionConditionMetAt(i) {
            return Condition(this.getActionAt(i).condition);
        }
        actionIndexFromAngle(angle, unit = 'rad'){
            if (unit == 'deg') {
                angle = Math.degToRad(angle);
            }
            return Math.floor( (angle / PieMenu.TWO_PI) * this.structure.length);
        }
        getActionFromAngle(angle, unit = 'rad'){
            let index = this.actionIndexFromAngle(angle, unit);
            return this.getActionAt(index);
        }
        // \ - - - /
        buildAction(action, i){
            // Create Action Node
            let actionNode = $('<div></div>');

            // Add Icon
            if (action.icon) {
                let iconParms = action.icon.split(' ');
                actionNode.append(Blockbench.getIconNode(iconParms[0], action.color || iconParms[1]));
            }

            // Add Text
            actionNode.append($('<span></span>').text(tl(action.name)));

            // Add Keybind Label
            actionNode.append( $(`<label class=keybinding_label i=${i}></label>`).text( i < 10 ?i:'' ) );
            return actionNode;
        }
        build(){
            let slices = this.node.children('.pieSlices');
            slices.empty();

            let angleStep = 360 / this.structure.length;
            let angle = -angleStep-90;

            for (let i = 0; i < this.structure.length; i++) {
                angle += angleStep;
                const action = this.getActionAt(i);

                if (!PieMenu.debugMode){
                    if (action instanceof Tool) {
                        let index = Toolbox.children.findIndex(t => t.id == action.id);
                        if (index >= 0) {
                            if (!Toolbox.condition_cache[index]) continue;
                        }
                    } 
                    else {
                        if (!this.actionConditionMetAt(i)) continue;
                    }
                }         
                
                
                // Create Pie Slice Which Handels Rotation And Animation ( Action Container )
                let slice = $(`<div class=pieSlice></div>`);

                slice.attr('style', `transform: translate(-50%,-50%) rotate(${angle}deg);`);

                let actionNode = this.buildAction(action, i);

                // Reverse Rotation
                actionNode.attr('style', `transform: rotate(${360-angle}deg);`);

                slice.append(actionNode);
                slices.append(slice);

            }

            return this.node;
        }
        trigger(event){
            this.cache.isHold = event.repeat;
            if (!this.cache.isHold) {
                this.setNodeTitle(this.name + `<br> ( IsHold: ${tl('dialog.no')})`)
                this.show();
            } else {
                this.setNodeTitle(this.name + `<br> ( IsHold: ${tl('dialog.yes')})`)
            }
        }
        unTrigger(...arg){ // is it even a word?

            let action;

            if (typeof arg[0] === 'number') {
                if (this.actionConditionMetAt(arg[0])) {
                    this.hide();
                    action = this.getActionAt(arg[0]);
                }
            } else if (arg[0] || this.cache.isHold) {
                let angle = this.angleToCursor() - (Math.PI - PieMenu.QUARTER_PI/2);
                angle = (angle + PieMenu.TWO_PI) % PieMenu.TWO_PI;

                action = this.getActionFromAngle(angle);
                
                this.hide();
            }

            if (action) {
                if (Condition(action.condition)) {
                    if (action.click) {
                        action.click();
                    }
                    if (action.select) {
                        action.select();
                    }
                    if (action.children) {
                        this.showActionMenuOf(action);
                    }
                }
            }
        }
        showActionMenuOf(action){
            if (typeof action.children == 'function') {
                new Menu(action.children()).show(PieMenu.mouseEvent);

            } else if (action.children instanceof Array && action.children.length) {
                new Menu(action.children).show(PieMenu.mouseEvent);
            }
        }

        delete() {
            var scope = this;
            this.toolbars.forEach(bar => {
                bar.remove(scope);
            })
            delete BarItems[this.id];
            Keybinds.actions.remove(this);
            delete PieMenu.all[this.uuid];
        }
        angleToCursor(){
            return new THREE.Vector2( mouse_pos.x , mouse_pos.y ).sub(new THREE.Vector2( ...this.cache.lastCenter )).angle();
        }
        static initCSS() {
            let style = $('#pieMenuStyles');
            if (style.length) {
                style.remove();   
            }
            style = $('<style id="pieMenuStyles"></style>');
            style.text(
                // Container
                `:root{--pie-dir_idct_size:10%;--pie-major_radius:30px;--pie-major_thickness:22px}.pieMenu{transform:translate(-50%,-50%);width:50%;height:50%;position: fixed;}.pieCenter{position:relative;top:50%;left:50%;transform:translate(-50%,-50%);width:calc(var(--pie-major_radius) * 2);height:calc(var(--pie-major_radius) * 2)}.pieCenter>svg{height:calc(var(--pie-major_radius) * 2);width:calc(var(--pie-major_radius) * 2)}.pieCenter>svg circle{cx:var(--pie-major_radius);cy:var(--pie-major_radius);r:calc(var(--pie-major_radius) - calc(var(--pie-major_thickness) * 0.5));stroke-width:calc(var(--pie-major_thickness) * .5);fill:none;stroke:white}.pieCenter div.gradient{width:100%;height:100%;border-radius:50%;--l_o:calc(50% - var(--pie-dir_idct_size));--r_o:calc(50% + var(--pie-dir_idct_size));background:conic-gradient(from 0deg at 50% 50%,var(--color-bright_ui) var(--l_o),var(--color-accent) var(--l_o),var(--color-accent) 50%,var(--color-accent) var(--r_o),var(--color-bright_ui) var(--r_o));box-shadow: inset 0px 0px 20px 0px black;}.pieCenter>svg foreignObject{--r:calc(var(--pie-major_radius)*2);width:var(--r);height:var(--r)}`
                +
                // Actions
                `.pieSlice{height:100%;width:fit-content;position: absolute;left: 50%;top: 50%;animation:expandOut .1s linear}.pieSlice div{display:flex;height:30px;padding:4px;padding-left:34px;padding-right:8px;width:max-content;background-color: var(--color-bright_ui);color: var(--color-bright_ui_text);border-radius:5px;box-shadow: 0 0 6px 0px #0005;}.pieSlice div.focused{background-color:var(--color-accent)}.pieSlice div>i{margin-top:1px;margin-right:4px;margin-left:-28px;pointer-events:none}.pieSlice div>img{cursor:default;height:20px;width:20px;color:var(--color-text);white-space:nowrap;margin-bottom:-3px;margin-left:-27px;margin-right:5px;margin-top:1px}.pieSlice div>span{pointer-events:none;flex:1 0 auto}.pieSlices{width:100%;height:100%;position: absolute;}`
                +
                // Animations
                `@keyframes expandOut{0%{height:0%}100%{height:100%}}`
                + 
                // Title
                `.pieMenu h4{position: absolute;left: 50%;top: calc(50% - 75px);transform: translate(-50%,-50%);width: fit-content;color: var(--color-subtle_text);text-align:center}`
            )
            $(document.body).append(style);
        }
        static onkeyup(e){
            if (!PieMenu.active) return;
            if (!PieMenu.active.keybind) return;
            if (e.which == 27) { PieMenu.active.hide(); return; };

            let actionIndex = e.which - 48;
            if (Math.isBetween(actionIndex, 0, 9)) {
                PieMenu.active.unTrigger(actionIndex);
                return;
            }
            if (PieMenu.active.cache.isHold && e.which == PieMenu.active.keybind.key) {
                PieMenu.active.unTrigger(); 
            }
        }
        static onclick(e){
            if (!PieMenu.active) return;
            if (!PieMenu.active.cache.isHold) {
                PieMenu.active.unTrigger(true);
            }
        }
        static onmousemove(e){
            PieMenu.mouseEvent = e;
            if (!PieMenu.active) return;
            
            let pieCenter = PieMenu.active.node.children('.pieCenter');

            let angle = PieMenu.active.angleToCursor();
            pieCenter.attr('style', `transform: translate(-50%, -50%) rotate(calc(${angle}rad - 90deg))`);

            angle -= Math.PI - PieMenu.QUARTER_PI/2;
            angle = (angle + PieMenu.TWO_PI) % PieMenu.TWO_PI;
            
            let index = PieMenu.active.actionIndexFromAngle(angle);
            PieMenu.active.node.find('.pieSlices div').removeClass('focused');
            if (PieMenu.active.actionConditionMetAt(index)) {
                
                PieMenu.active.node
                .children('.pieSlices')
                .find(`label[i=${index}]`)
                .parent()
                .addClass('focused')
            }
        }
        fromAction(action, menu={}) {
            if (typeof action.children == 'function') {
                this.structure = action.children();
            } else {
                this.structure = action.children;
            }
            this.condition = action.condition || menu.condition;
            this.structure = this.structure.filter(e=> e != '_');
            return this;
        }
        fromBarSelect(barselect){
            let actions  = [];
            for (const key in barselect.options) {
                const option = barselect.options[key];
                
                let name = barselect.getNameFor(key)
                let icon = option.icon || '';
                let data = {
                    name,icon,
                    id: key+'_pie_action',
                    private: true,
                    click(){
                        barselect.set(key);
                        barselect.onChange(barselect.value);
                    },
                    condition: undefined
                };
                if (option.condition) data.condition = option.condition;
                actions.push( new Action(data) )
            }
            this.structure=actions;
            return this;
        }
        
    }
    window.PieMenu = PieMenu;

    document.removeEventListener('keyup', PieMenu.onkeyup)
    document.addEventListener('keyup', PieMenu.onkeyup);

    document.removeEventListener('click', PieMenu.onclick)
    document.addEventListener('click', PieMenu.onclick);

    document.removeEventListener('mousemove', PieMenu.onmousemove)
    document.addEventListener('mousemove', PieMenu.onmousemove);

    PieMenu.initCSS();

    let addedPieMenus = [];
    Plugin.register("pie_menu", {
		title: "Pie Menus",
		icon: "fas.fa-chart-pie",
		author: "Malik12tree",
		description: "Add pie shaped menus for faster work.",
		about: "<style>.piePrivate p{width: fit-content;display: inline;margin-left: 10px !important;}.piePrivate tr td:nth-child(2){padding-left:10px}.piePrivate2 td, .piePrivate2 th{padding:0 10px}</style><h1>Built-in Pies</h1><table class=piePrivate><tr>    <td>Add Pie</td>    <td>Keybind: </td>    <td><p><code>ctrl + shift + a</code></p></td></tr><tr>    <td>Import Pie</td>    <td>Keybind: </td>    <td><p><code>shift + q</code></p></td></tr><tr>    <td>Export Pie</td>    <td>Keybind: </td>    <td><p><code>shift + w</code></p></td></tr><tr>    <td>Mode Pie</td>    <td>Keybind: </td>    <td><p><code>shift + tab (web: shift + x)</code></p></td></tr><tr>    <td>View Mode Pie</td>    <td>Keybind: </td>    <td><p><code>alt + z</code></p></td></tr><tr>    <td>Toolbox Pie</td>    <td>Keybind: </td>    <td><p><code>shift + t</code></p></td></tr><tr>    <td>New Pie</td>    <td>Keybind: </td>    <td><p><code>shift + n</code></p></td></tr><tr>    <td>Preferences Pie</td>    <td>Keybind: </td>    <td><p><code>shift + o</code></p></td></tr><tr>    <td>Rotate Pie</td>    <td>Keybind: </td>    <td><p><code>shift + r</code></p></td></tr><tr>    <td>Flip Pie</td>    <td>Keybind: </td>    <td><p><code>shift + f</code></p></td></tr><tr>    <td>Center Pie</td>    <td>Keybind: </td>    <td><p><code>shift + c</code></p></td></tr><tr>    <td>Properties Pie</td>    <td>Keybind: </td>    <td><p><code>shift + p</code></p></td></tr></table><h1>API</h1><h2>CSS Variables</h2><table class=piePrivate2><tr><th>Name</th><th>Default</th><th>Description</th></tr><tr><td>--pie-dir_idct_size</td><td>10%</td><td>sets the angle indicator size</td></tr><tr><td>--pie-major_radius</td><td>30px</td><td>sets the center pie's radius</td></tr><tr><td>--pie-major_thickness</td><td>22px</td><td>sets the center pie's thickness</td></tr></table>",
		version: "1.0.0",
		variant: "both",
        tags: ["Interface"],
		onload() {
            addedPieMenus.push(
                new PieMenu({
                    name: "Add Pie Menu", // NEEDS LANG SUPPORT,
                    id: 'add_pie_menu',
                    radius: -0.75,
                    keybind: {key:65,shift:true,ctrl:true},
                    structure: ['add_cube','add_group','add_locator','add_mesh','add_null_object','add_texture_mesh','add_animation','add_keyframe']
                }),

                new PieMenu({
                    name: 'generic.import',
                    keybind: {key:81,shift:true},
                    id: 'import_pie_menu',
                    radius: -0.75,
                }).fromAction(MenuBar.menus.file.structure.find(e=>e.id=='import')),
                
                new PieMenu({
                    name: 'generic.export',
                    keybind: {key:87,shift:true},
                    id: 'export_pie_menu',
                    radius: -0.7,
                }).fromAction(MenuBar.menus.file.structure.find(e=>e.id=='export')),
                
                new PieMenu({
                    name: 'action.view_mode',
                    id: 'view_mode_pie_menu',
                    keybind: {key:90,alt:true},
                    radius: -1,
                }).fromBarSelect(BarItems['view_mode']),
                
                new PieMenu({
                    name: "Mode Pie Menu", // NEEDS LANG SUPPORT,
                    id: 'mode_pie_menu',
                    radius: -1.5,
                    keybind: Blockbench.isWeb ? {key:88,shift:true}: {key:9,shift:true},
                    structure: (function() {
                        let actions = [];
                        for (const key in Modes.options) {
                            const mode = Modes.options[key];

                            actions.push(
                                new Action({
                                    name: mode.name,
                                    condition: mode.condition,
                                    id: key+'_pie_action',
                                    private: true,

                                    click(){ mode.select() }
                                })
                            )
                        }
                        return actions;
                    })()
                }),

                new PieMenu({
                    name: 'Tool Pie Menu',
                    id: 'main_tools_pie_menu',
                    radius: -1.5,
                    keybind: {key:84,shift:true},
                }).fromAction(MenuBar.menus.filter.structure.find(e=>e.id=='main_tools')),

                new PieMenu({
                    name: 'New Pie Menu',
                    keybind: {key:78,shift:true},
                    id: 'new_pie_menu',
                    radius: -1,
                }).fromAction(MenuBar.menus.file.structure.find(e=>e.id=='new')),

                new PieMenu({
                    name: 'Preferences Pie Menu',
                    keybind: {key:79,shift:true},
                    id: 'preferences_pie_menu',
                    radius: -1,
                }).fromAction(MenuBar.menus.file.structure.find(e=>e.id=="preferences")),

                ...(function() {
                    let pies = [];
                    const keybinds = [
                        {key:82,shift:true},
                        {key:70,shift:true},
                        {key:67,shift:true},
                        {key:80,shift:true}
                    ];
                    const radii = [ -0.75,-1,-1,-0.75 ];

                    for (let i = 1; i < 5; i++) {
                        let action = MenuBar.menus.transform.structure[i];
                        pies.push(
                            new PieMenu({
                                keybind: keybinds[i-1],
                                id: action.id +'_pie_menu',
                                name: tl(action.name),
                                radius: radii[i-1],
                            }).fromAction(MenuBar.menus.transform.structure[i], MenuBar.menus.transform),
                        )
                    }
                    return pies;
                })(),
            );
            addedPieMenus[7].structure.push(BarItems['plugins_window']); // add plugins window in the preferences pie 

        },
        onunload() {
            addedPieMenus.forEach(m => m.delete() );
            addedPieMenus = [];
        }
    });
})()

// 500.