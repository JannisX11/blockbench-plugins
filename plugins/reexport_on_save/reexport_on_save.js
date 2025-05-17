(function() {

const path = require('path');

const windows = process.platform === 'win32';

// Fix for Properties of type 'object' not getting read properly on project load
// Thanks SnaveSutit!
class DeepClonedObjectProperty extends Property {
    constructor(targetClass, name, options) {
        super(targetClass, 'object', name, options)
    }
    merge(instance, data) {
        if (data[this.name] == undefined) {
            instance[this.name] = undefined;
        } else if (typeof data[this.name] === 'object') {
            instance[this.name] = JSON.parse(JSON.stringify(data[this.name]));
            (JSON.stringify(instance[this.name]));

            // Empty object gets replaced with undefined
            if (Object.keys(instance[this.name]).length === 0)
                instance[this.name] = undefined;
        }
    }
    copy(instance, target) {
        if (instance[this.name] == undefined) {
            target[this.name] = undefined;
        } else if (typeof instance[this.name] === 'object') {
            target[this.name] = JSON.parse(JSON.stringify(instance[this.name]));

            // Empty object gets replaced with undefined
            if (Object.keys(target[this.name]).length === 0)
                target[this.name] = undefined;
        }
    }
}

let deferred = [];

let isCurrentlyReexporting = false;
let anotherReexportQueued = false;

// MARK: 🟥 plugin

Plugin.register('reexport_on_save', {
    title: 'Re-export on Save',
    author: '0x13F',
    description: 'Automatically re-export your project when saving',
    about: ''
        + 'This plugin adds a toggle to automatically re-export when saving a project. '
        + 'The export settings can be customized per project. '
        + 'Other plugins that add new exporting codecs should work with this out of the box. ',
    icon: 'output',
    creation_date: '2025-04-18',
    version: '1.0.0',
    variant: 'desktop',
    min_version: '4.12.4',
    has_changelog: false,
    tags: [ 'Exporter', 'Utility' ],
	repository: 'https://github.com/JannisX11/blockbench-plugins/tree/master/plugins/reexport_on_save',
    onload() {

        // Property to store re-export settings in project file
        let reexportSettingsProperty = deferDelete(new DeepClonedObjectProperty(ModelProject, 'reexport', {
            exposed: false,
            default: undefined,
        }));

        // Re-export settings action (for Action Control [F1])
        let reexportSettingsAction = deferDelete(new Action('reexport_settings', {
            name: 'Re-export on Save...',
            icon: 'output',
            click() {  
                reexportSettingsDialog.show();
            },
        }));

        // MARK: 🟩   dialog

        // Re-export settings dialog
        let reexportSettingsDialog = deferDelete(new Dialog('reexport_settings_dialog', {
            title: 'Re-export on Save',
            // Note that this form gets massively altered by buildReexportDialog()
            form: {
                ['info']: {
                    type: 'info',
                    text: 'Automatically re-export when saving this project.',
                },
                ['enabled']: {
                    type: 'checkbox',
                    label: 'Enabled (for this project)',
                    value: true,
                },
                ['codec_seperator']: '_',
                // This will get replaced with a div later
                ['codec_options_dummy']: { type: 'info', text: '', },
                ['path_seperator']: '_',
                ['path']: {
                    type: 'text',
                    label: 'Export location',
                    value: '',
                    extensions: [ 'blend' ],
                },
                ['relative']: {
                    type: 'checkbox',
                    label: 'Relative to project',
                    value: true,
                },
            },
            onOpen() {
                buildReexportDialog(this);
            },
            onConfirm(result) {
                Project.reexport ??= {};

                // Save re-export codec settings
                let codecResult = this.codecForm.getResult();
                Project.reexport.codec = codecResult.codec;
                // Remove 'codec_' prefix from codec options
                Project.reexport.codec_options = Object.keys(codecResult)
                    .filter(k => k !== 'codec')
                    .map(k => [k.slice('codec_'.length), codecResult[k]])
                    .reduce(toMap, {});

                // Store re-export codec settings in Project.export_options
                Project.export_options[Project.reexport.codec] = {...Project.reexport.codec_options};

                // Scream at the user if the path is bad
                if (!isReexportPathValid(result.path)) {
                    Blockbench.showMessageBox({
                        title: 'Re-export on Save',
                        message: 'Chosen export path is not valid, please enter a different path.',
                        icon: 'error',
                    }, () => BarItems['reexport_settings'].trigger());
                    return;
                }

                // Now that we know the path is ok, store it and the new enabled state
                Project.reexport.path = result.path;
                setReexportEnabled(result.enabled);
            },
        }));

        // MARK: 🟩   toggle

        // Re-export enabled toggle in the file menu
        // If re-export settings are not set, will instead open the dialog
        // Icon will be kept up-to-date with the enabled state
        let reexportEnabledToggle = {
            id: 'reexport_toggle',
			name: 'Re-export on Save',
			icon: 'check_box_outline_blank',
			searchable: false,
            condition: () => Project,
			click() {
                // If re-export is not set up then show dialog
                if (Project.reexport == undefined) {
                    reexportSettingsDialog.show();
                // Otherwise toggle enabled
                } else {
                    setReexportEnabled(!Project.reexport.enabled);
                }
			},
            children: [
                // File -> [x] Re-export on save [...] -> Options...
                {
                    name: 'menu.options',
                    icon: 'web_asset',
                    click() {
                        BarItems['reexport_settings'].trigger();
                    },
                },
            ],
		};
        // Position the toggle in the File menu right after the Export dropdown
        let exportDropdownIndex = MenuBar.menus.file.structure.findIndex(item => item.id === 'export');
        let reexportEnabledToggleIndex = exportDropdownIndex + 1;
        MenuBar.menus.file.structure.splice(reexportEnabledToggleIndex, 0, reexportEnabledToggle);
        defer(() => MenuBar.menus.file.structure.splice(MenuBar.menus.file.structure.indexOf(reexportEnabledToggle), 1));

        // Set initial state for checkbox toggle
        // Would only matter if plugins got reloaded while a file is open with re-export already enabled
        updateReexportEnabledCheckbox();
        // Same for status bar
        updateStatusBar();

        // MARK: 🟩   listeners

        // Update toggle and status when switching projects
        deferDelete(Blockbench.addListener('select_project', () => {
            updateReexportEnabledCheckbox();
            updateStatusBar();
        }));

        // Open listener
        deferDelete(Blockbench.addListener('load_project',  onProjectOpen));
        deferDelete(Blockbench.addListener('setup_project', onProjectOpen));

        // Save listener
        deferDelete(Blockbench.addListener('save_project', e => {
            // Not an actual manual save
            if (e.model.meta.backup)
                return;
            // Re-export not set up or disabled
            if (!Project.reexport?.enabled)
                return;

            reexport();
        }));

    },
    onunload() {

        for (let lambda of deferred)
            lambda();
        
    },
});

// MARK: 🟥 re-export

// Make the actual re-export happen
// We avoid using the codec's export() method, as it triggers dialogs and such
// Instead we use the codec's compile() and write() methods
// If a re-exporting process is already being done right now, queue up another one
async function reexport() {

    if (isCurrentlyReexporting) {
        anotherReexportQueued = true;
        return;
    }

    let startTime = new Date();

    isCurrentlyReexporting = true;
    updateStatusBar();

    let exportPath = exportPathToAbsolute(Project.reexport.path);

    // Failed to resolve export path
    if (!path.isAbsolute(exportPath)) {
        isCurrentlyReexporting = false;
        showReexportFailed('the export path is relative but this project has no save path');
        return;
    }

    // Invalid export path
    if (!isReexportPathValid(exportPath)) {
        isCurrentlyReexporting = false;
        showReexportFailed('the export path is not valid');
        return;
    }

    let exportFilename = path.basename(exportPath);
    let codec = Codecs[Project.reexport.codec];
    let codecOptions = Project.reexport.codec_options;

    // Bad codec
    if (codec == undefined || codec.export_action?.conditionMet() === false) {
        isCurrentlyReexporting = false;
        showReexportFailed(`"${Project.reexport.codec}" is not a valid export codec for this project`);
        return;
    }

    // Compile
    let content = await tryCatchAwait(() => codec.compile(codecOptions));

    if (content instanceof Error) {
        isCurrentlyReexporting = false;
        showReexportFailed(content);
        return;
    } else if (content == undefined) {
        isCurrentlyReexporting = false;
        showReexportFailed();
        return;
    }

    // Write
    let writeResult = await tryCatchAwait(() => codec.write(content, exportPath));

    if (writeResult instanceof Error) {
        isCurrentlyReexporting = false;
        showReexportFailed(content);
        return;
    }

    // TODO: Maybe we could check here that the output file exists
    // maybe whether the last write time has been updated
    // but since we can't assume codec.write() will let us know when it's done,
    // it would be tricky to determine.
    // If someone actually runs into this we could look at it

    // Success :)
    isCurrentlyReexporting = false;
    updateStatusBar(`Re-exported as ${exportFilename}`, 'check', 5000);

    // Show the quick message at least 1 second after saving,
    // to allow for the saving message to disappear
    let endTime = new Date();
    let durationMs = endTime - startTime;
    setTimeout(() => {
        Blockbench.showQuickMessage(`Re-exported as ${exportFilename}`, 1000)
    }, 1000 - durationMs);

    // If another re-export was queued, start it now
    if (anotherReexportQueued) {
        anotherReexportQueued = false;
        reexport();
    }

}

function showReexportFailed(reason) {
    updateStatusBar('Re-exporting failed', 'error', 5000);

    let reasonText = reason == undefined ? ''
        : reason instanceof Error ? ` because: "${reason}"`
        : ` because ${reason}`;

    Blockbench.showToastNotification({
        text: `Re-exporting failed${reasonText}. Please adjust your re-export settings.`,
        icon: 'error',
        color: 'red',
        click: () => BarItems['reexport_settings'].trigger(),
    });
}

// MARK: 🟥 build dialog

// Make hacky changes to the re-export dialog
// Called when the dialog is opened, and when the codec is changed.
// Form(s) get auto-filled with the saved re-export settings and/or previously used export settings.
// The codec selection and options are in a seperate form, inserted in a div inside the dialog form.
// Codec form is accessible later with dialog.codecForm
// The export path picker is a textbox with a browse button inserted into it.
function buildReexportDialog(dialog, justChangedCodecTo) {

    // Fill values from settings if they're already set
    if (Project.reexport != undefined && justChangedCodecTo == undefined) {
        dialog.setFormValues({
            ...Project.reexport,
            // Also set the relative checkbox
            relative: !path.isAbsolute(Project.reexport?.path ?? ''),
        });
    }

    // MARK: 🟩   codec form

    // Make sure we have a div to work with
    let codecOptionsDiv = dialog.object.querySelector('#reexport_dialog_codec_options');
    if (codecOptionsDiv != undefined) {
        // Dialog has been build before, just clear the div
        codecOptionsDiv.innerHTML = '';
    } else {
        // Fresh dialog, replace the dummy with a div
        let codecOptionsDummy = dialog.object.querySelector('.form_bar_codec_options_dummy');
        codecOptionsDiv = Interface.createElement('div', { id: 'reexport_dialog_codec_options' });
        dialog.form.node.appendChild(codecOptionsDiv);
        codecOptionsDummy.after(codecOptionsDiv);
        codecOptionsDummy.remove();
    }

    // Codec that was just picked...
    let selectedCodec = justChangedCodecTo
        // ...or that was saved in re-export settings
        ?? Project.reexport?.codec
        // ...or first codec that has export_options saved
        ?? Object.keys(Codecs)
            .filter(c => Project.export_options[c] != undefined)
            [0]
        // ...otherwise just use GLTF
        ?? 'gltf';

    // List of Codecs
    let codecsList = Object.values(Codecs)
        .filter(c => c.export_action?.conditionMet())
        // Options shown as model name with extension
        // For GLTF we manually add .glb as another extension
        .map(c => [c.id, `${c.name} (.${c.extension}${c.id === 'gltf' ? '/.glb' : ''})`])
        .reduce(toMap, {});

    // Options for the chosen Codec
    // Keys get 'codec_' prefix
    let codecExportOptions = Codecs[selectedCodec].export_options;
    let codecOptionsList = Object.keys(codecExportOptions)
        .map(key => ['codec_'+key, codecExportOptions[key]])
        .reduce(toMap, {});

    // Create inner form for codec and codec options
    let codecForm = new InputForm({
        ['codec']: {
            label: 'Export as',
            type: 'select',
            options: codecsList,
            value: selectedCodec,
        },
        ...codecOptionsList,
    });
    dialog.codecForm = codecForm;
    codecOptionsDiv.appendChild(codecForm.node);

    // Make sure label width for the codec form is the same as the outer form 
    let maxLabelWidth = dialog.form.node.style.getPropertyValue('--max_label_width');
    codecForm.node.style.setProperty('--max_label_width', maxLabelWidth);

    // Codec is currently used in re-export settings, fill values
    if (selectedCodec === Project.reexport?.codec) {
        let savedCodecOptions = Object.keys(Project.reexport.codec_options)
            .map(key => [ 'codec_'+key, Project.reexport.codec_options[key] ])
            .reduce(toMap, {});
        codecForm.setValues(savedCodecOptions);

    // Codec was used before in export_options, fill values as defaults
    } else if (Project.export_options[selectedCodec] != undefined) {
        let savedCodecOptions = Object.keys(Project.export_options[selectedCodec])
            .map(key => [ 'codec_'+key, Project.export_options[selectedCodec][key] ])
            .reduce(toMap, {});
        codecForm.setValues(savedCodecOptions);
    }

    // Remember encoding if the codec is GLTF
    let gltfEncoding = selectedCodec === 'gltf' ? dialog.codecForm.getResult().codec_encoding : undefined;

    // Remember whether the path is relative
    let exportPathIsRelative = dialog.getFormResult().relative;

    // Inner form change listener
    // Rebuild dialog when codec is changed
    // Keep extension up-to-date
    codecForm.on('change', data => {
        // If codec is changed, update export path extension
        let newCodec = data.result.codec;
        if (newCodec !== selectedCodec) {
            // Rebuild the whole dialog
            buildReexportDialog(dialog, newCodec);

            // Update extension for new codec
            // Special case for when the new codec is GLTF and the previously saved encoding is GLB
            let newExtension = Codecs[newCodec].extension;
            if (newCodec === 'gltf' && dialog.codecForm.getResult().codec_encoding === 'binary')
                newExtension = 'glb';
            changeReexportExtension(dialog, newExtension);
        

        // If GLTF encoding is changed, update export path extension
        } else if (newCodec === 'gltf' && data.result.codec_encoding !== gltfEncoding) {
            gltfEncoding = data.result.codec_encoding;
            let extension = gltfEncoding === 'ascii' ? 'gltf' : 'glb';
            changeReexportExtension(dialog, extension);
        }
    });

    // MARK: 🟩   export path

    // Now that we can know the extension,
    // if no re-export settings have been set,
    // and we didn't just change the codec,
    // then make up an export path
    if (Project.reexport?.path == undefined && justChangedCodecTo == undefined) {
        let extension = Codecs[selectedCodec].extension;
        if (gltfEncoding === 'binary')
            extension = 'glb';
        let projectName = Project.name || 'model';
        let exportPath = '.' + path.sep + projectName + '.' + extension;
        dialog.setFormValues({ path: exportPath });
    }
    
    // Add browse button to path input, if we haven't already
    let browseButton = dialog.form.node.querySelector('.form_bar_path>.input_wrapper>i.material-icons');
    if (browseButton == undefined) {
        let pathDiv = dialog.form.node.querySelector('.form_bar_path');
        pathDiv.classList.add('form_bar_file');
        let pathInput = pathDiv.querySelector('input');
        browseButton = Blockbench.getIconNode('insert_drive_file', { style: { cursor: 'pointer' } });
        let inputWrapper = Interface.createElement('div', {class: 'input_wrapper'}, [
            pathInput,
            browseButton,
        ]);
        pathDiv.append(inputWrapper);
        // File picker dialog with correct extension
        browseButton.onclick = async () => {
            let oldPath = dialog.getFormResult().path;
            let parentDir = path.dirname((Project.save_path || Project.export_path) ?? '');
            let startPath = path.resolve(parentDir, oldPath);

            let selectedCodec = dialog.codecForm.getResult().codec;
            let gltfEncoding = selectedCodec === 'gltf' ? dialog.codecForm.getResult().codec_encoding : undefined;
            let extension = Codecs[selectedCodec].extension;
            if (gltfEncoding === 'binary')
                extension = 'glb';
    
            // Replace invalid path with just the name of the project
            if (isReexportPathValid(oldPath))
                startPath = Project.name || 'model';
    
            let chosenPath = await pickExportPath(startPath, Codecs[selectedCodec].name, [extension]);
            dialog.setFormValues({ path: chosenPath });
            makeReexportPathRelative(dialog, exportPathIsRelative);
        }
        
        // Relative path toggle
        // Also only if we hadn't already added the browse button
        dialog.form.on('change', data => {
            // If relative checkbox got toggled, update export path
            if (data.result.relative !== exportPathIsRelative) {
                exportPathIsRelative = data.result.relative;
                makeReexportPathRelative(dialog, data.result.relative);
            }
        });
    }

}

// MARK: 🟥 status bar

// Update the text in the status bar
// We make our own status bar element to play with
// This function can be called with text and an icon to display a message,
// or without parameters to show whatever the current status is
function updateStatusBar(statusText, icon, expire) {

    let reexportStatusNode = document.querySelector('#reexport_status')

    if (reexportStatusNode == undefined) {
        let statusBarNode = document.querySelector('#status_bar');
        let statusMessageNode = statusBarNode.querySelector('#status_message');
        reexportStatusNode = Interface.createElement('div', {
            id: 'reexport_status',
            style: 'flex-grow: 1; cursor: pointer;',
        }, [
            Blockbench.getIconNode('output'),
            Interface.createElement('span', {
                id: 'reexport_status_text',
                style: 'padding-left: 6px; padding-right: 6px; vertical-align: top;',
            }),
        ]);
        statusBarNode.appendChild(reexportStatusNode);
        statusMessageNode.after(reexportStatusNode);

        reexportStatusNode.onclick = () => BarItems['reexport_settings'].trigger();
        
        // Make the fps counter stop growing
        let fpsCounterNode = statusBarNode.querySelector('div.f_right');
        fpsCounterNode.style.width = '100px';
        fpsCounterNode.style.textAlign = 'right';
    }

    let reexportStatusIconNode = reexportStatusNode.querySelector('.icon');
    let reexportStatusTextNode = reexportStatusNode.querySelector('#reexport_status_text');
    reexportStatusIconNode.classList.remove('spinning');

    // No status text provided, decide what it should be
    if (statusText == undefined) {
        if (isCurrentlyReexporting) {
            icon = 'autorenew';
            statusText = 'Re-exporting...';
            reexportStatusIconNode.classList.add('spinning');
        } else if (Project.reexport?.enabled) {
            icon = null;
            statusText = 'Re-export on Save enabled';
        }
    }

    // Hide if we have absolutely nothing to display
    reexportStatusNode.style.display = statusText == undefined ? 'none' : 'block';

    reexportStatusTextNode.textContent = statusText;
    reexportStatusIconNode.textContent = icon;

    if (expire != undefined)
        setTimeout(updateStatusBar, expire);
}

// MARK: 🟥 util

function exportPathToAbsolute(exportPath) {
    return path.resolve(path.dirname(Project.save_path), path.dirname(Project.export_path), exportPath);
}

function isReexportPathValid(exportPath) {
    let absoluteExportPath = exportPathToAbsolute(exportPath);
    let filename = path.basename(exportPath);
    let extensionWithPeriod = path.extname(filename);
    let isInvalid = false;

    // Re-export path should not be the same as the project itself
    // Note how export_path is actually the save path when editing a model that isn't saved as .bbmodel
    // But it still means it will get saved there when pressing Ctrl+S
    isInvalid ||= absoluteExportPath === Project.save_path || absoluteExportPath === Project.export_path;

    // No extension, very likely a bad filename
    // If the user does intend to actually save as something without a filename,
    // then they're weird
    isInvalid ||= extensionWithPeriod === '' || extensionWithPeriod === '.';

    let expectedExtension = Codecs[Project.reexport.codec].extension;
    if (Project.reexport.codec === 'gltf' && Project.reexport.codec_options.encoding === 'binary')
        expectedExtension = 'glb';
    // Extension doesn't match what's expected from the codec
    // This is a lot more likely to be intentional than no extension
    // But still a lot less likely than being an accident
    // Maybe we should remove this check in future?
    isInvalid ||= extensionWithPeriod.slice(1) !== expectedExtension;

    // null bytes invalid on all OSes
    isInvalid ||= exportPath.includes('\0');

    // Windows specific...
    if (windows) {
        // Invalid path char
        isInvalid ||= ['<','>','"','|','?','*'].some(char => absoluteExportPath.includes(char));
        // Invalid filename char
        isInvalid ||= filename.includes(':');
        // Invalid name
        isInvalid ||= ['CON'|'PRN'|'AUX'|'NUL'].some(name => filename.toUpperCase() === name);
        // COM0-9 or LTP0-9
        isInvalid ||= /^(COM\d|LTP\d)$/i.test(filename);
        // Start or end with space
        isInvalid ||= filename.startsWith(' ') || filename.endsWith(' ');
        // End with period
        isInvalid ||= filename.endsWith('.');
        // Only spaces and periods
        isInvalid ||= [...filename].every(c => c === '.' || c === ' ');
    }

    return !isInvalid;
}

// When the user changes the re-export codec or GLTF encoding,
// we update the export path extension
function changeReexportExtension(dialog, newExtension) {

    let oldPath = dialog.getFormResult().path;
    let baseNameWithoutExt = path.basename(oldPath, path.extname(oldPath));
    // Replace empty filename or filename startings with periods, because they're probably invalid
    if (baseNameWithoutExt === '' || baseNameWithoutExt.startsWith('.'))
        baseNameWithoutExt = Project.name || 'model';

    let pathWithoutExtension = path.dirname(oldPath) + path.sep + baseNameWithoutExt;
    let newPath = pathWithoutExtension + '.' + newExtension;

    dialog.setFormValues({ path: newPath, });
}

// When the user toggles the relative path checkbox in the re-export dialog,
// we edit the export path to match the new value
function makeReexportPathRelative(dialog, makeRelative) {
    
    let oldPath = dialog.getFormResult().path;
    let newPath = undefined;

    let parentDir = path.dirname((Project.save_path || Project.export_path) ?? '');
    // If we don't know the parent dir of the project,
    // there's no point even trying to do anything
    if (parentDir === '' || parentDir === '.')
        return;

    if (makeRelative && path.isAbsolute(oldPath)) {
        newPath = '.' + path.sep + path.relative(parentDir, oldPath);
    } else if (!makeRelative) { // make absolute
        newPath = path.resolve(parentDir, oldPath);
    }

    dialog.setFormValues({ path: newPath });
    
}

// Changes the enabled setting and notifies the user
function setReexportEnabled(enabled) {

    let oldEnabled = Project.reexport.enabled;

    Project.reexport.enabled = enabled;

    updateReexportEnabledCheckbox();
    updateStatusBar();

    if (oldEnabled !== enabled) {
        if (enabled) {
            Blockbench.showToastNotification({
                text: 'Your project will now be automatically re-exported when you save.',
                icon: 'info',
                expire: 5000,
            });
        } else {
            Blockbench.showQuickMessage('Re-export on Save disabled');
        }
    }

}

// Make sure the toggle icon in the file menu matches the enabled setting
function updateReexportEnabledCheckbox() {
    let toggle = MenuBar.menus.file.structure.find(i => i.id === 'reexport_toggle');
    if (toggle != undefined)
        toggle.icon = Project.reexport?.enabled ? 'check_box' : 'check_box_outline_blank';
}

// Callback for when a project is loaded, or imported
function onProjectOpen(e) {

    // This gets called twice for some reason, we ignore the second time when e is not undefined
    if (e != undefined)
        return;

    // Wait for properties to be loaded
    setTimeout(() => {
        // If the re-export settings is an empty object, replace it with undefined
        if (Project.reexport != undefined && Object.keys(Project.reexport).length === 0)
            Project.reexport = undefined;
        
        // Update toggle checkbox state and status bar
        updateReexportEnabledCheckbox();
        updateStatusBar();

        if (Project.reexport?.enabled) {
            Blockbench.showToastNotification({
                text: 'This project is set up to automatically re-export when you save.',
                icon: 'info',
                expire: 5000,
                click: () => BarItems['reexport_settings'].trigger(),
            });
        }
    }, 0);
}

// Export dialog that doesn't save anything
function pickExportPath(startPath, name, extensions) {
    return new Promise((resolve, reject) => {
        Blockbench.export({
            type: name,
            startpath: startPath,
            extensions: extensions,
            custom_writer: (content, exportPath) => resolve(exportPath),
        });
    });
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

function toMap(acc, entry) {
    return { ...acc, [entry[0]]: entry[1] };
}

async function tryCatchAwait(lambda) {
    try {
        return await lambda();
    } catch (e) {
        return e
    }
}

})();
