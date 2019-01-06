var plugin_data = {
	id: 'player_statue_generator',
	title: 'Player Statue Generator',  
	icon: 'accessibility',
	author: 'Wither, dragonmaster95 and 3XH6R',
    description: 'Generates player shaped models.',
    version: '2.0.0',
    min_version: '2.1.0',
	variant: 'both'
}

var modelDropdown = `Player Model: 
<select style="color:var(--color-text)" id="player_model_list">
<option value="steve">Steve (Classic)</option>
<option value="alex">Alex (Slim)</option>
<option value="cape">Cape</option>
</select>`;

var playerModelSettings = new Dialog({
    title: 'Choose Model',
    id: 'playerModelSettings',
    lines: [
        modelDropdown,
        '<br>Generate Second Layer <input type="checkbox" id="second_layer" checked>',
        '<p></p>'
    ]
});

var capeInfo = new Dialog({
    title: 'Cape Texture Warning',
    id: 'cape_warning',
    lines: [
        'You might have to edit your cape texture <br>to a square format(32x32) to make it work in-game!<br> <a class="open-in-browser" id="cape-gen-button" style="text-decoration: underline;">Click here</a> to import the texture template.',
        '<p></p>'
    ]
});

MenuBar.addAction(new Action({
    id: 'generate_player_statue',
    name: 'Generate Player Statue',
    icon: 'accessibility',
    description: 'Generate a player shaped model',
    category: 'filter',
    condition: () => !Blockbench.entity_mode,
    click: function(ev) {
        playerModelSettings.show()
    }
}), 'filter');

function setDisplay() {
    if(!display['head']) {
        display['head'] = {scale: [1.6, 1.6, 1.6], translation: [0, -29, 0]}
    }
    else {
        display['head'].scale = [1.6, 1.6, 1.6]
        display['head'].translation = [0, -29, 0]
    }
}

function generateSteve(secondLayer) {
    Undo.initEdit({cubes: Blockbench.elements, outliner: true });
    steveGroup = new Group('steve').addTo('root');
 
    var steveHead = new Cube({name:'head',from:[4,23.5,4],to:[12,31.5,12],autouv:0,faces:{north:{uv:[2,2,4,4]},south:{uv:[6,2,8,4]},west:{uv:[4,2,6,4]},east:{uv:[0,2,2,4]},up:{uv:[4,2,2,0]},down:{uv:[6,0,4,2]}}}).addTo(steveGroup);
    elements.push(steveHead);
    var steveBody = new Cube({name:'body',from:[4,11.5,6],to:[12,23.5,10],autouv:0,faces:{north:{uv:[5,5,7,7.98]},south:{uv:[8,5,10,8]},west:{uv:[7,5,8,7.98]},east:{uv:[4,5,5,8]},up:{uv:[7,5,5,4]},down:{uv:[9,4,7,5]}}}).addTo(steveGroup);
    elements.push(steveBody);
    var steveRightArm = new Cube({name:'right_arm',from:[12,11.5,6],to:[16,23.5,10],autouv:0,faces:{north:{uv:[11,5,12,8]},south:{uv:[13,5,14,8]},west:{uv:[12,5,13,8]},east:{uv:[10,5,11,8]},up:{uv:[12,5,11,4]},down:{uv:[13,4,12,5]}}}).addTo(steveGroup);
    elements.push(steveRightArm);
    var steveLeftArm = new Cube({name:'left_arm',from:[0,11.5,6],to:[4,23.5,10],autouv:0,faces:{north:{uv:[9,13,10,16]},south:{uv:[11,13,12,16]},west:{uv:[10,13,11,16]},east:{uv:[8,13,9,16]},up:{uv:[10,13,9,12]},down:{uv:[11,12,10,13]}}}).addTo(steveGroup);
    elements.push(steveLeftArm);
    var steveRightLeg = new Cube({name:'right_leg',from:[8,-0.5,6],to:[12,11.5,10],autouv:0,faces:{north:{uv:[1,5,2,8]},south:{uv:[3,5,4,8]},west:{uv:[2,5,3,8]},east:{uv:[0,5,1,8]},up:{uv:[2,5,1,4]},down:{uv:[3,4,2,5]}}}).addTo(steveGroup);
    elements.push(steveRightLeg);
    var steveLeftLeg = new Cube({name:'left_leg',from:[4,-0.5,6],to:[8,11.5,10],autouv:0,faces:{north:{uv:[5,13,6,16]},south:{uv:[7,13,8,16]},west:{uv:[6,13,7,16]},east:{uv:[4,13,5,16]},up:{uv:[6,13,5,12]},down:{uv:[7,12,6,13]}}}).addTo(steveGroup);
    elements.push(steveLeftLeg);
    
    if (secondLayer) {
        var steveHead2 = new Cube({name:'head_2nd_layer',from:[3.5,23,3.5],to:[12.5,32,12.5],autouv:0,faces:{north:{uv:[10,2,12,4]},south:{uv:[14,2,16,4]},west:{uv:[12,2,14,4]},east:{uv:[8,2,10,4]},up:{uv:[12,2,10,0]},down:{uv:[14,0,12,2]}}}).addTo(steveGroup);
        elements.push(steveHead2);
        var steveBody2 = new Cube({name:'body_2nd_layer',from:[4,11.02,5.5],to:[12,24.03,10.5],autouv:0,faces:{north:{uv:[5,9,7,12]},south:{uv:[8,9,10,12]},west:{uv:[7,9,8,12]},east:{uv:[4,9,5,12]},up:{uv:[7,9,5,8]},down:{uv:[9,8,7,9]}}}).addTo(steveGroup);
        elements.push(steveBody2);
        var steveRightArm2 = new Cube({name:'right_arm_2nd_layer',from:[11.5,11,5.5],to:[16.49,24,10.5],autouv:0,faces:{north:{uv:[11,9,12,12]},south:{uv:[13,9,14,12]},west:{uv:[12,9,13,12]},east:{uv:[10,9,11,12]},up:{uv:[12,9,11,8]},down:{uv:[13,8,12,9]}}}).addTo(steveGroup);
        elements.push(steveRightArm2);
        var steveLeftArm2 = new Cube({name:'left_arm_2nd_layer',from:[-0.5,11,5.5],to:[4.5,24,10.5],autouv:0,faces:{north:{uv:[13,13,14,16]},south:{uv:[15,13,16,16]},west:{uv:[14,13,15,16]},east:{uv:[12,13,13,16]},up:{uv:[14,13,13,12]},down:{uv:[15,12,14,13]}}}).addTo(steveGroup);
        elements.push(steveLeftArm2);
        var steveRightLeg2 = new Cube({name:'right_leg_2nd_layer',from:[7.5,-1,5.5],to:[12.5,12,10.5],autouv:0,faces:{north:{uv:[1,9,2,12]},south:{uv:[3,9,4,12]},west:{uv:[2,9,3,12]},east:{uv:[0,9,1,12]},up:{uv:[2,9,1,8]},down:{uv:[3,8,2,9]}}}).addTo(steveGroup);
        elements.push(steveRightLeg2);
        var steveLeftLeg2 = new Cube({name:'left_leg_2nd_layer',from:[3.5,-1,5.5],to:[8.5,12,10.5],autouv:0,faces:{north:{uv:[1,13,2,16]},south:{uv:[3,13,4,16]},west:{uv:[2,13,3,16]},east:{uv:[0,13,1,16]},up:{uv:[2,12,1,11]},down:{uv:[3,12,2,13]}}}).addTo(steveGroup);
        elements.push(steveLeftLeg2);
    }
    setDisplay();
    Canvas.updateAll();
    steveGroup.openUp().select();
    playerModelSettings.hide();
    Undo.finishEdit('Generated Steve Statue');
}

function generateAlex(secondLayer) {
    Undo.initEdit({cubes: Blockbench.elements, outliner: true});
    alexGroup = new Group('alex').addTo('root');

    var alexHead = new Cube({name:'head',from:[4,23.5,4],to:[12,31.5,12],autouv:0,faces:{north:{uv:[2,2,4,4]},south:{uv:[6,2,8,4]},west:{uv:[4,2,6,4]},east:{uv:[0,2,2,4]},up:{uv:[4,2,2,0]},down:{uv:[6,0,4,2]}}}).addTo(alexGroup);
    elements.push(alexHead);
    var alexBody = new Cube({name:'body',from:[4,11.5,6],to:[12,23.5,10],autouv:0,faces:{north:{uv:[5,5,7,8]},south:{uv:[8,5,10,8]},west:{uv:[7,5,8,8]},east:{uv:[4,5,5,8]},up:{uv:[7,5,5,4]},down:{uv:[9,4,7,5]}}}).addTo(alexGroup);
    elements.push(alexBody);
    var alexRightArm = new Cube({name:'right_arm',from:[12,11.5,6],to:[15,23.5,10],autouv:0,faces:{north:{uv:[11,5,11.75,8]},south:{uv:[12.75,5,13.5,8]},west:{uv:[11.75,5,12.75,8]},east:{uv:[10,5,11,8]},up:{uv:[11.75,5,11,4]},down:{uv:[12.5,4,11.75,5]}}}).addTo(alexGroup);
    elements.push(alexRightArm);
    var alexLeftArm = new Cube({name:'left_arm',from:[1,11.5,6],to:[4,23.5,10],autouv:0,faces:{north:{uv:[9,13,9.75,16]},south:{uv:[10.75,13,11.5,16]},west:{uv:[9.75,13,10.75,16]},east:{uv:[8,13,9,16]},up:{uv:[9.75,13,9,12]},down:{uv:[10.5,12,9.75,13]}}}).addTo(alexGroup);
    elements.push(alexLeftArm);
    var alexRightLeg = new Cube({name:'right_leg',from:[4,-0.5,6],to:[8,11.5,10],autouv:0,faces:{north:{uv:[5,13,6,16]},south:{uv:[7,13,8,16]},west:{uv:[6,13,7,16]},east:{uv:[4,13,5,16]},up:{uv:[6,13,5,12]},down:{uv:[7,12,6,13]}}}).addTo(alexGroup);
    elements.push(alexRightLeg);
    var alexLeftLeg = new Cube({name:'left_leg',from:[8,-0.5,6],to:[12,11.5,10],autouv:0,faces:{north:{uv:[1,5,2,8]},south:{uv:[3,5,4,8]},west:{uv:[2,5,3,8]},east:{uv:[0,5,1,8]},up:{uv:[2,5,1,4]},down:{uv:[3,4,2,5]}}}).addTo(alexGroup);
    elements.push(alexLeftLeg);

    if (secondLayer) {
        var alexHead2 = new Cube({name:'head_2nd_layer',from:[3.5,23,3.5],to:[12.5,32,12.5],autouv:0,faces:{north:{uv:[10,2,12,4]},south:{uv:[14,2,16,4]},west:{uv:[12,2,14,4]},east:{uv:[8,2,10,4]},up:{uv:[12,2,10,0]},down:{uv:[14,0,12,2]}}}).addTo(alexGroup);
        elements.push(alexHead2);
        var alexBody2 = new Cube({name:'body_2nd_layer',from:[4,11.02,5.49],to:[12,24.03,10.49],autouv:0,faces:{north:{uv:[5,9,7,12]},south:{uv:[8,9,10,12]},west:{uv:[7,9,8,12]},east:{uv:[4,9,5,12]},up:{uv:[7,9,5,8]},down:{uv:[9,8,7,9]}}}).addTo(alexGroup);
        elements.push(alexBody2);
        var alexRightArm2 = new Cube({name:'right_arm_2nd_layer',from:[11.5,11,5.5],to:[15.5,24,10.5],autouv:0,faces:{north:{uv:[10.75,9,11.5,12]},south:{uv:[12.75,9,13.5,12]},west:{uv:[11.75,9,12.75,12]},east:{uv:[10,9,11,12]},up:{uv:[11.75,9,11,8]},down:{uv:[12.5,8,11.75,9]}}}).addTo(alexGroup);
        elements.push(alexRightArm2);
        var alexLeftArm2 = new Cube({name:'left_arm_2nd_layer',from:[0.5,11,5.5],to:[4.5,24,10.5],autouv:0,faces:{north:{uv:[13,13,13.75,16]},south:{uv:[14.75,13,15.5,16]},west:{uv:[13.75,13,14.75,16]},east:{uv:[12,13,13,16]},up:{uv:[13.75,13,13,12]},down:{uv:[14.5,12,13.75,13]}}}).addTo(alexGroup);
        elements.push(alexLeftArm2);
        var alexRightLeg2 = new Cube({name:'right_leg_2nd_layer',from:[7.5,-1,5.5],to:[12.5,12,10.5],autouv:0,faces:{north:{uv:[1,9,2,12]},south:{uv:[3,9,4,12]},west:{uv:[0,9,1,12]},east:{uv:[0,9,1,12]},up:{uv:[2,9,1,8]},down:{uv:[3,8,2,9]}}}).addTo(alexGroup);
        elements.push(alexRightLeg2);
        var alexLeftLeg2 = new Cube({name:'left_leg_2nd_layer',from:[3.5,-1,5.5],to:[8.5,12,10.5],autouv:0,faces:{north:{uv:[1,13,2,16]},south:{uv:[3,13,4,16]},west:{uv:[2,13,3,16]},east:{uv:[0,13,1,16]},up:{uv:[2,13,1,12]},down:{uv:[3,12,2,13]}}}).addTo(alexGroup);
        elements.push(alexLeftLeg2);
    }
    setDisplay();
    Canvas.updateAll();
    alexGroup.openUp().select();
    playerModelSettings.hide();
    Undo.finishEdit('Generated Alex Statue');
}

function generateCape(){
    Undo.initEdit({cubes: Blockbench.elements, outliner: true});
    var cape = new Cube({name:'cape',from:[2.5,6,13],to:[13.5,23,14],autouv:0,faces:{north:{uv:[0.5,0.5,6,9]},south:{uv:[6.5,0.5,12,9]},west:{uv:[6,0.5,6.5,9]},east:{uv:[0,0.5,0.5,9]},up:{uv:[6,0.5,0.5,0]},down:{uv:[11.5,0,6,0.5]}},rotation:[-22.5,0,0],origin:[7.5,14,10.5]}).addTo();
    elements.push(cape);
    Canvas.updateAll();
    setDisplay();
    Undo.finishEdit('Generated Cape Model');
}

playerModelSettings.onConfirm = function() {
    switch($('#player_model_list')[0].value) {
        case 'steve':
            generateSteve($('#second_layer')[0].checked);
            break;
        case 'alex':
            generateAlex($('#second_layer')[0].checked);
            break;
        case 'cape':
            playerModelSettings.hide();
            capeInfo.show();
            document.getElementById('cape-gen-button').onclick = function() {
                var capeTexture = new Texture({name: 'cape_texture', res: 32, mode: 'bitmap', source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAklEQVR4AewaftIAAACRSURBVO3BoQ3CUBSG0e/dNIGEBZpgSBAMwhCMwDIUAQrVCXBMga6pK6JJBbaiqiCK5T0Skt/ccwJvt+oxkqgszqS6lodARNh2xZhXe1Jd7iey3ZNU8/Ux8EXGZJUviGm6no/ZckPM0NbEGGKGmCFmiBlihpghZogZYoaYIWaIGWKGWMak6Xp+MbQ1zjnnnPuHFz1lGpsvFTuyAAAAAElFTkSuQmCC'});
                capeTexture.add();
                capeTexture.load();
            };
            break;
    }
}

capeInfo.onConfirm = function() {
    playerModelSettings.hide();
    capeInfo.hide();
    generateCape();
}

onUninstall = function() {
	MenuBar.removeAction('filter.generate_player_statue');
}