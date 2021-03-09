(function() {
  // Register plugin
  Plugin.register('startup_tips', {
    title: 'Startup Tips',
    author: 'TheOtterlord',
    icon: 'info',
    description: 'This plugin provides helpful tips for those unfamiliar with Blockbench',
    about: 'The Startup Tips plugin provides helpful tips about Blockbench on startup. These tips include tips about model creation, external resources, the editor, and more',
    version: '1.1.0',
    variant: 'both',
    onload() {
      // define tips
      var tips = [
        // Editor Tips
        "Want a fresh new look for blockbench? Edit the color scheme in settings",
        "Press Ctrl+S to quickly save your work. Saving often is important",
        "Immerse yourself in Blockbench with fullscreen (f11)",
        "Did something wrong? Undo your changes quickly with Ctrl+Z",
        "Undid something you wanted to keep? Redo your changes quickly with Ctrl+Y",
        "Take a screenshot of your model with Ctrl+P and share with your friends",
        "You can convert your model to another format using the convert button in the file dropdown",
        "Use the Edit Session feature to create models with your friends",
        "Blockbench supports multiple languages",
        "Set a custom background with Right Click > Background > Load",
        "Save your angle with Right Click > Save Angle",
        "Click the eyes in the right sidebar to hide elements",
        "You can also load these tips from the help menu",
        "You can adjust the screen size using the buttons in the view menu",
        "You can search for an action using the button in the help menu",
        "Blockbench saves your recent models for quick access when you return",
        // Model Creation Tips
        "Animations add a lot to an entity, make sure you include animations in yours too",
        "If 2 cubes with different textures are overlapping on a certain axis, you can inflate one of them to fix it",
        "Pivot points define where the bones are rotated",
        "Little things, like blinking animations and moving mouths can make your entity look so much better",
        "Models with a lot of tiny parts can perform badly on low end devices. Find the right balance between performance and detail",
        // External Resource Tips
        "Don't know which model to use? Visit https://blockbench.net/quickstart to find the format you need",
        "Blockbench for particles? Try JannisX11's Snowstorm Particle Generator: https://jannisx11.github.io/snowstorm/",
        "Looking for inspiration? https://mcpedl.com is a hub of Minecraft creativity",
        "Report any issues to https://github.com/JannisX11/blockbench/issues",
        "Got a tip? Tag @TheOtterlord in an issue at https://github.com/JannisX11/blockbench-plugins/issues",
        "Want to make your own plugin? Visit https://jannisx11.github.io/blockbench-docs to get started",
        // Misc
        "Backup your models to keep them safe"
      ];
      // add extra tips based on platform
      if (Blockbench.isWeb) {
        tips.push("If you are on Windows, Linux or MacOS, you can install the desktop application found at https://blockbench.net/downloads");
      }
      if (Blockbench.isMobile) {
        tips.push("It is recommended that you use Blockbench on a desktop");
      }
      function showTip() {
        // show a tip in a message box
        Blockbench.showMessageBox({
          "buttons": ["Cancel", "Next"],
          "confirm": 1,
          "cancel": 0,
          "title": "Startup Tip",
          // pick random tip
          "message": tips[Math.floor(Math.random()*tips.length)],
          "icon": "icon-blockbench"
        }, function(result) {
          // if next is clicked
          if (result == 1) {
            // show another tip
            showTip();
          }
        });
      }
      // add a button to show the tips
      button = new Action('show_tips', {
        name: 'Show Tips',
        description: 'Show some helpful tips to consider when using Blockbench',
        icon: 'info',
        click: function() {
          showTip();
        }
      });
      MenuBar.addAction(button, 'help.-1');
      // show a tip on load
      showTip();
    },
    onunload() {
      // remove button when plugin is unloaded
      button.delete();
    }
  });
})();
