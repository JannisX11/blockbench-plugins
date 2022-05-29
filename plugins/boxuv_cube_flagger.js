(function() {
  let button, button2, cubeAction;
  Plugin.register('boxuv_cube_flagger', {
    title: 'BoxUV Cube Flagger',
    author: 'SirJain',
    description: 'This plugin flags cubes less than 1 unit by flashing them.',
    icon: 'lightbulb',
    version: '1.1.1',
    variant: 'both',
    min_version: '4.2.0',
    tags: ['Textures', 'BoxUV', 'UV'],
    about: 'Have you ever been using BoxUV and had to change to Per-Face UV because your cubes were smaller than one unit on an axis? You can use the BoxUV Cube Flagger plugin to flash all possible invalid cubes in your project. This includes cubes with decimal sizes and cubes less than 1, both of which can cause complications and errors. Simple, yet effective.\n\n## How to use\nTo use this plugin, go to `File > Plugins > Available` and search for `BoxUV Cube Flagger`. Click install, then use `Tools > Flag Cubes` and click one of the options. Clicking the first option causes the plugin to flag cubes less than 1. The second option allows Blockbench to flag cubes with decimal sizes.\n\n\nIt would be appreciated to report any bugs and suggestions!',
    onload() {
      const highlighter = {
        i: 0,
        running: false,
        start: (cubes, material) => {
          if (highlighter.running) {
            return;
          }
          highlighter.running = true;
          for (const cube of cubes) {
            cube.mesh.material_non_flash = cube.mesh.material;
          };
          clearInterval(highlighter.interval);
          highlighter.i = 0;
          highlighter.interval = setInterval(() => highlighter.flash(cubes, material), 1500);
          highlighter.flash(cubes, material);
        },
        flash: (cubes, material) => {
          var fc = highlighter.i;
          if (fc > 5) {
            highlighter.running = false;
            clearInterval(highlighter.interval);
          };
          for (const cube of cubes) {
            if (cube.mesh) {
              cube.mesh.material = (fc % 2) ? material : cube.mesh.material_non_flash;
            }
          };
          highlighter.i++;
        }
      };

      actions = [
        new Action('flag_small_cubes', {
          name: 'Flag Small Cubes',
          description: 'Highlight cubes less than 1 unit',
          icon: 'view_in_ar',
          click: function() {
            const cubes = Cube.all.filter(cube => (cube.size(0) > 0 && cube.size(0) < 1) || (cube.size(1) > 0 && cube.size(1) < 1) || (cube.size(2) > 0 && cube.size(2) < 1));
            const material = new THREE.MeshBasicMaterial({color:0xFF3F3F});
            highlighter.start(cubes, material);
          }
        }),
        new Action('flag_decimal_cubes', {
          name: 'Flag Decimal Cubes',
          description: 'Highlight cubes with decimal sizes',
          icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAANlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABaC8NGAAAAEXRSTlMOvPX05alOdgATXZkjYD/KIlbIiwwAAAB3SURBVBjTrdDLEoAgCAVQTIxQK/n/n400qpke06K7PIoCMNwEHhAAuA8YeoY1DZlQpBMRTBMbRi8zlTI6PUDihiSKuZZm6uKOWu7GXO/SCVswXdDp/xckffUn1OYNMxnWMdcE58VHWwhPCbc+bcw64LGnl31+xAWtrQ4+c9fnFgAAAABJRU5ErkJggg==",
          click: function() {
            const cubes = Cube.all.filter(cube => cube.size(0) % 1 !== 0 || cube.size(1) % 1 !== 0 || cube.size(2) % 1 !== 0);
            const material = new THREE.MeshBasicMaterial({color: 0xF8872E});
            highlighter.start(cubes, material);
          }
        })
      ]

      MenuBar.addAction({
        id: 'flag_cubes',
        name: 'Flag Cubes',
        children: actions,
        icon: 'error_outline'
      }, 'tools');
    },
    onunload() {
      for (const action of actions) action.delete?.()
      MenuBar.removeAction("tools.flag_cubes")
    }
  });
})();
