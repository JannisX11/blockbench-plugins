(function() {
  let button;
  Plugin.register('boxuv_cube_flagger', {
    title: 'BoxUV Cube Flagger',
    author: 'SirJain',
    description: 'This plugin flags cubes less than 1 unit by flashing them.',
    icon: 'lightbulb',
    version: '1.0.0',
    variant: 'both',
    min_version: '4.2.0',
    tags: ['Textures', 'BoxUV', 'UV'],
    about: 'Have you ever been using BoxUV and had to change to Per-Face UV because your cubes were smaller than one unit on an axis? You can use the BoxUV Cube Flagger plugin to flash all cubes smaller than one unit, allowing you easily find and edit them so that you can keep using BoxUV. Simple, yet effective.\n\nTo use this plugin, go to \'File > Plugins > Available\' and search for \'BoxUV Cube Flagger\'. Click install, then use \'Tools > Flag Invalid Cubes\'. This will cause cubes less than one unit on any axis to blink on-screen.\n\nIt would be appreciated to report any bugs and suggestions!',
    onload() {
      const flashMaterial = new THREE.MeshBasicMaterial({color: 0xFF3F3F})
      button = new Action('flag_invalid_cubes', {
        name: 'Flag Invalid Cubes',
        description: 'Highlight cubes less than 1 unit',
        icon: 'error_outline',
        click: function() {
          const highlighter = {
            i: 0,
            start: function() {
              for (const cube of Cube.all) {
                if (cube.size(0) < 1 || cube.size(1) < 1 || cube.size(2) < 1) {
                  cube.mesh.material_non_flash = cube.mesh.material;
                }
              };
              clearInterval(highlighter.interval);
              highlighter.i = 0;
              highlighter.interval = setInterval(highlighter.flash, 1500);
              highlighter.flash();
            },
            flash: function() {
              var fc = highlighter.i;
              if (fc > 5) {
                x = 0;
                clearInterval(highlighter.interval);
              };
              for (const cube of Cube.all) {
                if (cube.size(0) < 1 || cube.size(1) < 1 || cube.size(2) < 1) {
                  cube.mesh.material = (fc % 2) ? flashMaterial : cube.mesh.material_non_flash;
                }
              };
              highlighter.i++;
            }
          };
          highlighter.start();
        }
      });
      MenuBar.addAction(button, 'tools');
    },
    onunload() {
      button.delete();
    }
  });
})();
