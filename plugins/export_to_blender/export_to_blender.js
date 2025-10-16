(function() {

const windows = Blockbench.operating_system === 'Windows';
const linux   = Blockbench.operating_system === 'macOS';
const macos   = Blockbench.operating_system === 'Linux';

const requireUserPermission = Blockbench.isNewerThan('4.99');
let fsModule           = requireUserPermission ? undefined : require('fs');
let childProcessModule = requireUserPermission ? undefined : require('child_process');

// Python code to be run by Blender
// 1. Imports a GLTF file
// 2. Adds the file to a root node and a collection
// 3. Saves the blend file
const blenderScript = [
    'import bpy                                             ',
    'import sys                                             ',
    '                                                       ',
    'args = sys.argv[sys.argv.index("--") + 1:]             ',
    'name = args[0]                                         ',
    'gltf_path = args[1]                                    ',
    'blend_path = args[2]                                   ',
    '                                                       ',
    'print("Creating blend...")                             ',
    'bpy.ops.wm.read_factory_settings(use_empty=True)       ',
    '                                                       ',
    '# Create collections                                   ',
    'collection = bpy.data.collections.new(name)            ',
    'bpy.context.scene.collection.children.link(collection) ',
    '                                                       ',
    '# Import gltf                                          ',
    'print("Importing gltf...")                             ',
    'bpy.ops.import_scene.gltf(filepath=gltf_path)          ',
    '                                                       ',
    '# Root node                                            ',
    'root_node = bpy.data.objects.new(name, None)           ',
    'bpy.context.collection.objects.link(root_node)         ',
    'collection.objects.link(root_node)                     ',
    'bpy.context.scene.collection.objects.unlink(root_node) ',
    '                                                       ',
    '# Add imported objects to collection and root node     ',
    'for obj in bpy.context.selected_objects:               ',
    '    # Add to collection                                ',
    '    collection.objects.link(obj)                       ',
    '    bpy.context.scene.collection.objects.unlink(obj)   ',
    '    # Add root object to prop node                     ',
    '    if obj.parent == None:                             ',
    '        obj.parent = root_node                         ',
    '                                                       ',
    '# Save blend file                                      ',
    'bpy.ops.wm.save_as_mainfile(filepath=blend_path)       ',
    'print(f"Saved blend file: {blend_path}")               ',
].join('\n');

// Because we need to send the code through a command line argument,
// It's very hard to encode double quotes and newlines
// We cheat by base-64 encoding the script,
// Then having Python decode it and run it
const encodedBlenderScript = `import base64; exec(base64.b64decode('${btoa(blenderScript)}'))`;

let deferred = [];

Plugin.register('export_to_blender', {
    title:         'Export to Blender',
    author:        '0x13F',
    description:   'Export your project as a Blender scene (.blend)',
    icon:          'icon.png',
    creation_date: '2025-04-16',
    version:       '2.0.0',
    variant:       'desktop',
    min_version:   '4.12.4',
    has_changelog: false,
    tags:          [ 'Exporter' ],
	repository:    'https://github.com/JannisX11/blockbench-plugins/tree/master/plugins/export_as_blender',

    onload() {

        deferDelete(new Setting('blender_path', {
            name: 'Blender path',
            description: 'Path to the Blender executable',
            category: 'export',
            type: 'text',
        }));

        let blenderSetPathDialog = deferDelete(new Dialog('blender_set_path', {
            title: 'Set Blender path',
            form: {
                ['info']: {
                    type: 'info',
                    text: 'The Blender installation could not be located. Please choose the path to the Blender executable.',
                },
                ['path']: {
                    type: 'file',
                    label: 'Blender path',
                    extensions: windows ? [ 'exe' ] : [],
                },
            },
            async onConfirm(form_result) {

                let blenderPath = form_result['path'];

                if (blenderPath != null && blenderPath != ''
                  && getFs().existsSync(blenderPath) && await validateBlender(blenderPath)) {
                    // New path is valid!
                    Settings.structure.export.items['blender_path'].value = blenderPath;
                    blenderCodec.export_action.trigger();

                } else {
                    // New path is not valid, show message box and try again
                    Blockbench.showMessageBox({
                        title:   'Blender path',
                        message: 'Provided path does not point to a valid Blender executable, please try again.',
                        icon:    'error',
                    }, () => blenderCodec.export_action.trigger());
                }
            },
        }));

        let blenderPatienceDialog = deferDelete(new Dialog('blender_patience', {
            title: 'Exporting as Blender Scene...',
            progress_bar: {},
            buttons: [],
            cancel_on_click_outside: false,
            onOpen() {
                // Forcefully remove the close button
                let closeButton = this.object.querySelector('.dialog_close_button');
                if (closeButton != undefined)
                    this.object.removeChild(closeButton);

                // Keep increasing the progress bar
                // speed keeps decreasing
                this.progress_bar.setProgress(0);
                let progressUpdateFramerate = 60;
                let dt = 1/progressUpdateFramerate;

                this.updateProgressInterval = setInterval(() => {
                    let remainingProgress = 1 - this.progress_bar.progress;
                    let addProgress = remainingProgress * remainingProgress * dt;
                    let newProgress = Math.min(this.progress_bar.progress + addProgress, 0.95);
                    this.progress_bar.setProgress(newProgress);
                }, 1000/progressUpdateFramerate);
            },
            onClose() {
                clearInterval(this.updateProgressInterval);
            },
        }));

        let blenderCodec = deferDelete(new Codec('blender', {
            name: 'Blender Scene',
            extension: 'blend',
            export_action: deferDelete(new Action({
                id: 'export_blender',
                name: 'Export Blender Scene',
                icon: 'blender',
                category: 'file',
                click() {

                    let blenderPath = Settings.get('blender_path');
                    if (blenderPath == undefined || blenderPath == '') {
                        setBlenderPath(this, blenderSetPathDialog);
                    } else {
                        blenderCodec.export();
                    }
                },
            })),
            export_options: {
                ['scale']: {
                    label: 'settings.model_export_scale',
                    type: 'number',
                    value: Settings.get('model_export_scale'),
                },
                ['embed_textures']: {
                    type: 'checkbox',
                    label: 'codec.common.embed_textures',
                    value: true,
                },
                ['armature']: {
                    type: 'checkbox',
                    label: 'codec.common.armature',
                    value: false,
                },
                ['animations']: {
                    label: 'codec.common.export_animations',
                    type: 'checkbox',
                    value: true,
                },
            },
            async compile(options) {
                return await compileBlend(options);
            },
            async export() {
                let options = await this.promptExportOptions();
                if (options === null) return;

                await exportBlend(this, options, blenderPatienceDialog);
            },
        }));

        // Insert into export menu after last item with id 'export_...'
        let exportMenu = MenuBar.menus.file.structure.find(x => x.id === 'export');
        let lastExportItem = exportMenu.children
            .filter(x => (typeof x === 'string' ? x : x.id).startsWith('export_'))
            .last();
        let lastExportItemIndex = exportMenu.children.indexOf(lastExportItem);
        let blenderExportIndex = lastExportItemIndex + 1;
        exportMenu.children.splice(blenderExportIndex, 0, 'export_blender');
        defer(() => exportMenu.children.splice(exportMenu.children.indexOf('export_blender'), 1));
    },
    onunload() {

        for (let lambda of deferred)
            lambda();
        
    },
});

async function compileBlend(options) {

    let tempPathPrefix = `${PathModule.dirname(Project.save_path)}/.${PathModule.basename(Project.save_path)}`;
    let tempGlbPath    = tempPathPrefix + '.TEMP_BLEND_EXPORT.glb';
    let tempBlendPath  = tempPathPrefix + '.TEMP_BLEND_EXPORT.blend';

    // Export to .glb
    let glbContent = await Codecs.gltf.compile({
        encoding: 'binary',
        ...options,
    });
    getFs().writeFileSync(tempGlbPath, Buffer.from(glbContent));
    
    // Run Blender script
    let blender = Settings.get('blender_path');
    let blenderLogs = await executeCommand(blender, [
        '--background',
        '--python-expr',
        encodedBlenderScript,
        '--',
        Project.name,
        tempGlbPath,
        tempBlendPath,
    ]);

    console.log(`Blender: ${blenderLogs}`);

    if (!getFs().existsSync(tempBlendPath)) {
        getFs().unlinkSync(tempGlbPath);
        return new Error('Blender didn\'t create blend file for some reason. Please verify your Blender path in your settings.');
    }

    // Read Blender scene content
    let blendContent = getFs().readFileSync(tempBlendPath);

    // Clean up
    getFs().unlinkSync(tempGlbPath);
    getFs().unlinkSync(tempBlendPath);

    return blendContent;

}

async function exportBlend(codec, options, blenderPatienceDialog) {

    blenderPatienceDialog.show();

    let content = await codec.compile(options);

    blenderPatienceDialog.close();

    // Wait for the patience dialog to close
    await new Promise(r => setTimeout(r, 20));

    // Something went wrong...
    if (content == undefined || content instanceof Error) {
        Blockbench.showMessageBox({
            title: 'Blender export error',
            message: 'Exporting as Blender Scene failed for an unknown reason.\n'
                + 'Please verify that the Blender Path in your settings is correct.',
            icon: 'error',
        });
        return;
    }

    // Export dialog
    Blockbench.export({
        type: 'Blender Scene File',
        startpath: Project.save_path,
        extensions: ['blend'],
        savetype: 'binary',
        content: content,
        
    }, (exportPath) => {
        Blockbench.showQuickMessage(`Exported as ${PathModule.basename(exportPath)}`, 1000);
    });

}

// Either find Blender path and retrigger the export action,
// or open the dialog
async function setBlenderPath(exportAction, pathDialog) {
    
    let foundPath = await findBlender();

    if (foundPath == null) {
        pathDialog.show();
    } else {
        Settings.structure.export.items['blender_path'].value = foundPath;
        exportAction.trigger();
    }
}
    
// Try to find the path to Blender, if it can't be found, return null
async function findBlender() {
    try {
        // Try just running the command
        if (await validateBlender('blender'))
            return 'blender';
    
        // Try running `where blender`
        try {
            let whereCommand = windows ? 'where' : 'which';
            let pathFromWhere = await executeCommand(whereCommand, ['blender']);
            if (getFs().existsSync(pathFromWhere) && await validateBlender(pathFromWhere))
                return pathFromWhere;
        } catch { }

        // Try obvious paths
        // wildcards should be resolved, but only one wildcard is allowed
        let obviousPaths = 
            windows ? ['C','D','E'].flatMap(drive => [
                `${drive}:/Program Files/Blender Foundation/Blender */blender.exe`,
                `${drive}:/Program Files/WindowsApps/BlenderFoundation.Blender*/Blender/blender.exe`,
                `${drive}:/Program Files (x86)/Steam/steamapps/common/Blender/blender.exe`,
                `${drive}:/SteamLibrary/steamapps/common/Blender/blender.exe`,
            ])
          : linux ? [`/usr/share/blender/*/Blender`]
          : macos ? [`/Applications/Blender.app/Contents/Resources/Blender`]
          : [];

        for (let obviousPath of obviousPaths) {
            // Resolve wildcard
            if (obviousPath.indexOf('*') !== -1) {
                let segments = obviousPath.split('/');
                let wildcardSegmentIndex = segments.findIndex(s => s.includes('*'));
                let segmentsUntilWildcard = segments.slice(0, wildcardSegmentIndex);
                // Stop early if the the wildcard's parent doesn't exist
                if (!getFs().existsSync(segmentsUntilWildcard.join('/')))
                    continue;
                
                let wildcardSegment = segments[wildcardSegmentIndex];
                let wildcardIndex = wildcardSegment.indexOf('*');
                let beforeWildcard = wildcardSegment.slice(0, wildcardIndex);
                let afterWildcard = wildcardSegment.slice(wildcardIndex + 1);
                let matchingDirItems = getFs().readdirSync(segmentsUntilWildcard.join('/'))
                    .filter(i => i.startsWith(beforeWildcard))
                    .filter(i => i.endsWith(afterWildcard));
                let existingPaths = matchingDirItems
                    .map(i => obviousPath.replace(wildcardSegment, i))
                    .filter(p => getFs().existsSync(p));

                // Nothing matches or matches don't contain Blender exe
                if (existingPaths.length === 0)
                    continue;

                // Just one existing match, go validate it!
                if (matchingDirItems.length === 1) {
                    obviousPath = existingPaths[0];
                    
                } else {

                    // Multiple versions of Blender
                    // Find whichever file has the most recent write time
                    let newestPath = existingPaths
                        .map(existingPath => ({
                            existingPath,
                            writeTime: getFs().statSync(existingPath).mtime.getTime()
                        }))
                        .sort((a, b) => b.writeTime - a.writeTime)
                        .map(entry => entry.existingPath)
                        [0];
                    obviousPath = newestPath;
                }

            }

            // Check to make sure we resolved the wildcard
            if (obviousPath.indexOf('*') !== -1) {
                console.warn('Two wildcards in Blender path?');
                continue;
            }

            // Make sure the file exists and and can be called with --version
            if (getFs().existsSync(obviousPath) && await validateBlender(obviousPath))
                return obviousPath; 
        }

    } catch {
        // Give up, just prompt the user
        return null;
    }
}

// Runs a command as a Promise
function executeCommand(command, args) {
    return new Promise((resolve, reject) => {
        try {
            let process = getChildProcess().spawn(command, args, { shell: false });
            let stdout = '';
            let stderr = '';
            process.stdout.on('data', (data) => {
                stdout += data.toString();
            });
            process.stderr.on('data', (data) => {
                stderr += data.toString();
            });
            process.on('close', (code) => {
                if (code === 0) {
                    resolve(stdout.trim());
                } else {
                    reject(new Error(stderr.trim() || `Command failed with exit code ${code}`));
                }
            });
            process.on('error', (err) => {
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
}

// Tries to run blender with the provided path
// Returns the same path on success, otherwise null
async function validateBlender(blender) {
    try {
        let result = await executeCommand(blender, ['--version']);
        if (result?.startsWith("Blender "))
            return blender;
    } catch { }
    return null;
}

function defer(lambda) {
    deferred.push(lambda);
}

function deferDelete(deletable) {
    if (deletable.delete == undefined) {
        console.warn('deferDelete() called with object that isn\'t deletable: ', deletable);
        return;
    }
    defer(() => deletable.delete());
    return deletable;
}

function getFs() {
    if (fsModule == undefined)
        fsModule = requireNativeModule('fs', {
            message: 'This permission is required to locate Blender and convert your model.',
        });

    return fsModule;
}

function getChildProcess() {
    if (childProcessModule == undefined)
        childProcessModule = requireNativeModule('child_process', {
            message: 'This permission is required to communicate with Blender to convert your model.',
        });

    return childProcessModule;
}

})();
