(function () {
    // Register plugin
    Plugin.register('duplicate_renamer', {
        title: 'Duplicate Bone Renamer',
        author: 'Gecko',
        icon: 'fa-font',
        description: 'This plugin renames duplicate bones so they work in bedrock and GeckoLib models',
        about: 'Simply go to Edit -> Rename Duplicates. All duplicate bones will get renamed to {bone}_{number}',
        version: '1.0.0',
        variant: 'both',
        onload() {
            button = new Action('rename_duplicates', {
                name: 'Rename Duplicates',
                description: 'Rename all duplicate bone names',
                icon: 'fa-font',
                click: function () {
                    Undo.initEdit({outliner: true});
                    const duplicates = []
                    Group.all.forEach(x => {
                        if (duplicates.some(group => group.name === x.name)) {
                            let duplicate = duplicates.find(group => group.name === x.name);
                            x.name += "_" + duplicate.number;
                            duplicate.number++;
                        }
                        else {
                            duplicates.push({
                                name: x.name,
                                number: 1
                            })
                        }
                    })
                    Undo.finishEdit('rename duplicates', {outliner: true});
                }
            });
            MenuBar.addAction(button, 'edit.-1');
        },
        onunload() {
            button.delete();
        }
    });
})();
