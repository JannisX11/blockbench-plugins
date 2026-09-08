Plugin.register('model_region_tools', {
    title: 'Model Region Tools',
    author: 'HorrorGirl',
    description: 'Tools for selecting regions directly on the 3D model.',
    icon: 'select_all',
    version: '1.0.0',
    variant: 'both',

    onload() {
        this.region_select = new Action('model_region_tools_region_select', {
            name: 'Region Select',
            description: 'Select a region directly on the 3D model.',
            icon: 'crop_free',
            click() {
                Blockbench.showQuickMessage(
                    'Model Region Tools 1.0.0: Region Select'
                );
            }
        });

        MenuBar.addAction(this.region_select, 'tools');

        Blockbench.showQuickMessage(
            'Model Region Tools 1.0.0 loaded'
        );
    },

    onunload() {
        if (this.region_select) {
            this.region_select.delete();
        }
    }
});