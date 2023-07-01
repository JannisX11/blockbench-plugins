/** sam3DJ | aka. Sammy's .3DJ (format implementation)
 *  ==================================================
 *  Author:     Sammy L. Koch (1Turtle)
 *  Licence:    Apache-2.0 (see https://www.apache.org/licenses/LICENSE-2.0.txt)
*/

(function() {    
    const pluginProperties = {
        
        title: 'sam3DJ',
        author: '1Turtle',
        tags: ['Minecraft: Java Edition', 'Format', 'Exporter'],
        version: '1.0.2',
        variant: 'both',
        description: 'Generate 3D prints in MC (Java Edition) via the .3DJ format within the SC-Peripherals mod!',
        about: "This plugin allows you to **export a model into the .3DJ format**.  \nThe .3DJ format is _mostly_ used with the `3D Printer` from the **SC-Peripherals** Java Edition mod.  \n  \n**Tip:** Cubes in a `state_on` folder will be _only_ displayed whenever the model is toggled on!    \n> **Note:** _The format does not support the following attributes:_  \n> * Rotated cubes  \n> * One cube with multiple textures  \n> * Cubes outside the given block space *(16x16x16 Grid / 1x1x1 Block)*  \n  \nTry to avoid those things, or else you might run into weird results.  \nMeshes are also not supported due to the limitations of the format and Minecraft.\n> For the full format documentations, see the [SwitchCraft3 Wiki](https://docs.sc3.io/whats-new/sc-peripherals.html#_3dj-format)  \n",
        icon: 'print',
        onload() {
            MenuBar.addAction(btnExport, 'file.export');
        },
        onunload() {
            MenuBar.removeAction('file.export.export_3dj');
        }
    };
    
    const SC_TEXTURE_BLANK = 'sc-peripherals:block/white';
    
    /**
     * Returns a fitting texture for a given cube.
     * @param {*} cube The cube, which holds the wanted texture.
     * @returns The wanted texture, fitting to the cube. (+ some booleans) in a object.
     */
    

    function getTint(cube) {  //Get Tint function
        let tmp = cube.faces['up'].getTexture();  //Gets texture for top face
        targetRectangle = cube.faces['up'].getBoundingRect();  
        
        targetCanvas = Painter.getCanvas(tmp);
        targetContext = targetCanvas.getContext('2d');
        buffer = targetContext.getImageData(targetRectangle.ax, targetRectangle.ay, 1, 1);
        
        var hex = [  //converts RGB to hex value and adds to array
            Math.round(buffer.data[0]).toString(16),
            Math.round(buffer.data[1]).toString(16),
            Math.round(buffer.data[2]).toString(16)
        ];
        for (var i = 0; i < hex.length; i++) {  //standardises values to 2, by adding zero if not long enough
            if (hex[i].length === 1) {
                hex[i] = '0' + hex[i];
            }
        }

        return hex.join("");
    }

    function getSingleTexture(cube) {
        let faces = 0;
        let missing = false;
        let texture = SC_TEXTURE_BLANK;
        let Tint = getTint(cube);  //Calls to get Cube Top Face colour
    
        for (let dir in cube.faces) { //in ['north', 'east', 'south', 'west', 'up', 'down']
            let tmp = cube.faces[dir].getTexture();
    
            if (!tmp) {
                if (typeof cube.parent === 'object' && cube.parent.name.includes(":block/")) {
                    texture = cube.parent.name;
                    tmp = true;
                }

                if (cube.name.includes(":block/")) {
                    texture = cube.name;
                    tmp = true;
                }

                if (!tmp) {
                    missing = true;
                }
            } else {
                // Generate actual ID
                let id = tmp.namespace + ':' + tmp.folder + '/' + (tmp.name.replace(/\.[^/.]+$/, ""))
    
                if (texture !== id)
                    faces++;
                texture = id;
            }
        }
        
        return {
            texture: texture,
            textureTint: Tint,
            missingTexture: missing,
            multipleTexture: (faces > 1),
        };
    }
    
    /**
     * Converts a given element to a shape in .3DJ format.
     * @param {*} obj The given element (e.g. Cube).
     * @returns The fianl shape (+ some booleans) in a object.
     */
    function genShape(cube, raw = false, useTint = false) {
        

        let result = getSingleTexture(cube);
        
        let shape = {
            bounds: [
                cube.from[0],
                cube.from[1],
                cube.from[2],
    
                cube.to[0],
                cube.to[1],
                cube.to[2],
            ],
            texture: result.texture,
        };
    
        if (!raw)
            if (useTint){  //if Use Tint checkbox then assign as Tint, remove Texture
                shape.tint = result.textureTint;  
                shape.texture = SC_TEXTURE_BLANK;
            } else{  //default behaviour
                shape.tint = 'FFFFFF';
            }
            
    
        return {
            shape: shape,
            missingTexture: result.missingTexture,
            multipleTexture: result.multipleTexture,
        };
        
    }
    
    function isStateON(group) {
        if (group.name === 'state_on') {
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Generates the object that contains the shapes in .3DJ format (off state only).
     * @param {*} objects Contains all elements.
     * @returns The final shapes (+ some booleans) in a object.
     */
    function genModel(elements, raw = false, useTint) {
        let shapeOFF = [];
        let shapeON = [];
        
        for (const cube of elements)
            if (cube instanceof Cube && cube.visibility) {
                let stateON = false;
                if (typeof cube.parent === 'object')
                    stateON = isStateON(cube.parent)
                    
                let result = genShape(cube, raw, useTint);
                if (stateON)
                    shapeON.push(result.shape);
                else
                    shapeOFF.push(result.shape);
    
                if (result.missingTexture || result.multipleTexture)
                    Blockbench.showQuickMessage('Some cubes got a blank texture', 4000);
            }
    
        return {on: shapeON, off: shapeOFF};
    }
    
    /**
     * Returns the given value or undefined, whenever the string is usable or not.
     * @param {*} value
     * @returns The value or undefined.
     */
    function aditionalValue(value) {
        return (typeof value === 'string' && value.trim() !== '') ? value : undefined;
    }
    
    /**
     * Compiles a whole project to the .3DJ format (Used for exporting).
     * @param {*} options
     * @returns The final object in the .3DJ format.
     */
    function compile3DJ(options = {}) {
        let output = { }
    
        if (!options.raw) {
            output.label            =  aditionalValue(options.label);
            output.tooltip          =  aditionalValue(options.tooltip);
            output.isButton         =  options.isBtn;
            output.collideWhenOn    =  options.collideOn;
            output.collideWhenOff   =  options.collideOff;
            output.lightLevel       =  options.lightLvl;
            output.redstoneLevel    =  options.redstoneLvl;
        }
        
        const shapes = genModel(Project.elements, options.raw, options.useTint);
        output.shapesOff = shapes.off;
        output.shapesOn = shapes.on;
    
        return output;
    }
    
    const codec3dj = new Codec('codec_3dj', {
        name: "3DJ model",
        remember: true,
        remember: false,
        extension: "3dj",
        load_filter: {
            type: 'json',
            extensions: ['3dj'],
            condition(model) {
                return model.shapesOff;
            }
        },
    
        compile(options) { return autoStringify(compile3DJ(options)); },
        export(options = {}) {
            Blockbench.export({
                resource_id: 'model',
                type: this.name,
                extensions: [this.extension],
                name: this.fileName(),
                startpath: this.startPath(),
                content: this.compile(options),
                custom_writer: isApp ? (a, b) => this.write(a, b) : null,
            }, path => this.afterDownload(path))
        },
    });
    
    const popConfigModel = new Dialog({
        id: 'popConfig_3dj',
        title: 'Model Propities',
        form: {
            raw: {
                label: 'Raw mode (ON = ignore all below)',
                type: 'checkbox',
                value: false,
            },
            label: {
                label: 'Label',
                type: 'input',
                value: codec3dj.fileName(),
            },
            tooltip: {
                label: 'Tooltip',
                type: 'input',
                value: Project.credit || settings.credit.value || '',
            },
            isBtn: {
                label: 'Act as Button',
                type: 'checkbox',
                value: false,
            },
            lightLvl: {
                label: 'Light Level',
                type: 'number',
                value: 0,
                min: 0, max: 15, step: 1,
            },
            redstoneLvl: {
                label: 'Redstone Power',
                type: 'number',
                value: 0,
                min: 0, max: 15, step: 1,
            },
            collideOff: {
                label: 'Collision (OFF state)',
                type: 'checkbox',
                value: true,
            },
            collideOn: {
                label: 'Collision (ON state)',
                type: 'checkbox',
                value: true,
            },
            useTint: {
                label: 'Use Colour for Tint',
                type: 'checkbox',
                value: false,
            },
        },
        onConfirm(formData) {
            codec3dj.export(formData);
        }
    });
    
    /**
     * Checks if all given cubes meet the requirements.
     * @param {Cube} elements The cubes.
     * @returns Object containing booleans for whenever a condition is met.
     */
    function checkCubes(elements) {
        let rotation = false;
        let texture = false;
        let border = false;
        let mesh = false;
    
        for (const cube of elements) {
            if (cube instanceof Cube) {
                if (cube.visibility) {
                    if (!rotation)
                        rotation =(cube.rotation[0] !== 0
                                || cube.rotation[1] !== 0
                                || cube.rotation[2] !== 0);
                        
                    if (!texture)
                        texture = (getSingleTexture(cube).multipleTexture);
                        
                    if (!border) {
                        function checkNum(num) {
                            if (!border)
                                border = (num < 0 || num > 16);
                        }
                        cube.from.forEach(checkNum)
                        cube.to.forEach(checkNum)
                    }
                
                    // We are done here
                    if (rotation && texture && border)
                        break
                }
            } else { mesh = true; }
        }
    
        return {rotation: rotation, texture: texture, border: border, mesh: mesh};
    }
    
    const btnExport = new Action('export_3dj', {
        name: 'Export 3DJ Model',
        description: 'Export model as a .3DJ (.json) file for 3D Printers',
        icon: 'print',
        category: 'file',
        condition: () => (Project !== 0),
        click() {
            // Check for stuff we dont want
            const result = checkCubes(Project.elements);

            // Generate warnings
            if ( result.rotation || result.texture || result.border || result.mesh) {
                let warning = new Dialog({
                    id: 'popWarn_3dj',
                    title: "Holdup..",
                    form: {
                        header: {
                            type: 'info',
                            text: 'Exporting your model like that might give weird results because of the following things:',
                        },
                        introduction: {
                            type: 'info',
                            text: 'Cubes that...',
                        }
                    },
                    onConfirm() {
                        popConfigModel.show();
                    }
                });
                // Actual messages
                if (result.rotation)
                    warning.form.rotation = {
                        type: 'info',
                        text: '... have rotation',
                    }
                if (result.texture)
                    warning.form.texture = {
                        type: 'info',
                        text: '... use multiple textures',
                    }
                if (result.border)
                    warning.form.border = {
                        type: 'info',
                        text: '... are out of bounce (16x16x16 Grid / 1x1x1 Block)',
                    }
                if (result.mesh)
                    warning.form.border = {
                        type: 'info',
                        text: '... are actually a Mesh and not a Cube',
                    }
    
                warning.form.nextstep = {
                    type: 'info',
                    text: '*Press \'Confirm\' if you still want to proceed.*',
                }
    
                warning.show();
            // Or just export if everything is right :)
            } else
                popConfigModel.show();
        }
    });
    
    Plugin.register('sam3dj', pluginProperties);
    })();
