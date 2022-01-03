(function() {
    var button;
	var start;
	var expor;

    Plugin.register('animator', {
        title: 'Java Item Model Animator',
        author: 'Command Master',
        description: `Takes two java item models and outputs a zip with a resourcepack and a datapack to make a clear transaction between them in the players hand (the plugin can also work for other animations but the datapack have to be coded manually).`,
        about: `The animation is activated using "/scoreboard players set @s animation 0".
To use click Filter -> Save starting model the save the first model, and then click on File -> Export -> Export animation to download the ZIP file of the animation`,
        tags: ["Minecraft: Java Edition"],
        icon: 'compare',
        version: '1.0.1',
        variant: 'both',
        onload() {
            types = ['thirdperson_righthand', 'thirdperson_lefthand', 'firstperson_righthand', 'firstperson_lefthand', 'gui', 'head', 'ground', 'fixed'];
            button = new Action('save_start', {
                name: 'Save Starting Model',
                description: 'Saves the current model as the starting model for the animation',
                icon: 'filter_cetner_focus',
                condition: {formats: ['java_block']},
                click: function() {
					start = JSON.parse(JSON.stringify(Codecs.java_block.compile({raw: true})));
                }
            });
            MenuBar.addAction(button, 'filter');
			expor = new Action('export_animation', {
                name: 'Export Java Item Animation',
                description: 'Exports the animation to a zip',
                icon: 'compare',
                condition: {formats: ['java_block']},
                click: function() {
                    if (!start) {
                        Blockbench.showQuickMessage('You didn\'t configured a starting model', 2000);
                    } else
                        new Dialog({
                            id: 'generate_animation',
                            title: 'Animation Generator',
                            form: {
                                ticks: {label: 'Time in ticks of the animation (20 ticks = 1 second)', type: 'number', value: 20, step: 1, min: 3, max: 1000}
                            },
                            onConfirm: function(formData) {
                                generate_animation(start, Codecs.java_block.compile({raw: true}),+formData.ticks);
                                this.hide()
                            }
                        }).show()
                }
            });
            MenuBar.addAction(expor, 'file.export');
        },
        onunload() {
            MenuBar.removeAction('file.export.export_animation')
            button.delete();
        }
    });
    
    function line(y1, x1, y2, x2) {
        var m = (y2-y1)/(x2-x1);
        
        return `${m}x+${y1-m*x1}`;
    }
	
    function generate_linear_arr(start, end, time) {
        var linear = [];
        for (var i = 0; i < start.length; i++) {
            linear.push(line(start[i], 0, end[i], time-1));
        }
        return linear;
    }
    
    function generate_linear(start, end, time) {
        var linear = {};
        for (var key of Object.keys(start)) {
            linear[key] = generate_linear_arr(start[key], end[key], time);
        }
        return linear;
    }
    
    function generate_element_linear(start, end, time) {
        var linear = JSON.parse(JSON.stringify(start));
        linear['from'] = generate_linear_arr(start['from'], end['from'], time);
        linear['to'] = generate_linear_arr(start['to'], end['to'], time);
        return linear;
    }
    
    function calculate_string(string, x) {
        var match = string.match(/(.+)x\+(.+)/);
        if (match) {
            var a = parseFloat(match[1]);
            var b = parseFloat(match[2]);
            return a*x+b;
        } else {
            return string;
        }
    }
    
    
    function calculate_model(current, x) {
        if (typeof current == 'string') {
            return calculate_string(current, x);
        }
        else if (current instanceof Array) {
            for (var i = 0; i < current.length; i++) {
                current[i] = calculate_model(current[i], x);
            }
            return current;
        } else if (current instanceof Object) {
            for (var key of Object.keys(current)) {
                current[key] = calculate_model(current[key], x);
            }
            return current;
        } else {
            return current;
        }
    }
	
	function generate_animation(start, end, models) {
        start = JSON.parse(JSON.stringify(start));
        end = JSON.parse(JSON.stringify(end));
	start['display'] = start['display']?start['display']:{};
	end['display'] = end['display']?end['display']:{};
	for (var i = 0; i < types.length; i++) {
                start['display'][types[i]] = Object.assign({
                    rotation: [0, 0, 0],
                    translation: [0, 0, 0],
                    scale: [1, 1, 1]
                }, start['display'][types[i]]);
		end['display'][types[i]] = Object.assign({
                    rotation: [0, 0, 0],
                    translation: [0, 0, 0],
                    scale: [1, 1, 1]
                }, start['display'][end[i]]);
         }
        start['display']['firstperson_righthand']['translation'][1] += 10;
        end['display']['firstperson_righthand']['translation'][1] += 10;
        start['display']['firstperson_lefthand']['translation'][1] += 10;
        end['display']['firstperson_lefthand']['translation'][1] += 10;
		var linear = JSON.parse(JSON.stringify(start));
        var zip = JSZip();
        zip.file("resourcepack/pack.mcmeta", `{
  "pack": {
    "pack_format": 5,
    "description": "This is an animated resource pack generated using Command Master's generator."
  }
}`);
        zip.file("datapack/pack.mcmeta", `{
  "pack": {
    "pack_format": 5,
    "description": "This is a datapack for an animation generated using Command Master's generator."
  }
}`);
        zip.file('datapack/data/minecraft/tags/functions/load.json', `{
  "replace": false,
  "values": [
    "anim:load"
  ]
}`);
        zip.file('datapack/data/minecraft/tags/functions/tick.json', `{
  "replace": false,
  "values": [
    "anim:tick"
  ]
}`);
        zip.file('datapack/data/anim/functions/load.mcfunction', "scoreboard objectives add animation dummy");
        if (start.hasOwnProperty('display')) {
            linear['display'] = {};
            for (var key of Object.keys(start['display'])) {
                linear['display'][key] = generate_linear(start['display'][key], end['display'][key], models);
            }
        }
        if (start.hasOwnProperty('elements')) {
            linear['elements'] = [];
            for (var i = 0; i < start['elements'].length; i++) {
                linear['elements'].push(generate_element_linear(start['elements'][i], end['elements'][i], models));
            }
        }
        var overrides = [];
        var tick = '';
        for (var i = 0; i < models; i++) {
            var model = JSON.parse(JSON.stringify(linear));
            zip.file(`resourcepack/assets/minecraft/models/item/model${i}.json`, JSON.stringify(calculate_model(model, i)));
            overrides.push({'predicate':{'custom_model_data': i+1}, 'model': `item/model${i}`});
            tick += `replaceitem entity @p[scores={animation=${i+1}}] weapon.mainhand minecraft:knowledge_book{CustomModelData:${i+1},AttributeModifiers:[{AttributeName:"generic.attackSpeed",Name:"generic.attackSpeed",Amount:-1000000,Operation:0,UUIDLeast:255057,UUIDMost:170750}]}
`;
        }
        zip.file('resourcepack/assets/minecraft/models/item/knowledge_book.json', JSON.stringify({"parent": "item/generated","textures": {"layer0":"item/knowledge_book"},"overrides": overrides}));
        tick += 'scoreboard players add @a animation 1';
        zip.file('datapack/data/anim/functions/tick.mcfunction', tick);
        zip.generateAsync({type: 'blob'}).then(content => {
            Blockbench.export({
                type: 'Zip Archive',
                extensions: ['zip'],
                name: 'animation',
                startpath: Project.export_path,
                content: content,
                savetype: 'zip'
            })
        });
    }

})();
