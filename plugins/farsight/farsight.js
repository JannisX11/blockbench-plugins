Plugin.register("farsight", {
  title: "Farsight",
  author: "Luther Gray",
  icon: "visibility",
  description:
    "Increases the Clipping Distance of Blockbench to see much larger maps & levels (configurable).",
  version: "1.0.1",
  variant: "both",

  onload() {
    // Check to activate Farsight in new Tabs.
    this.onPreviewAdded = (data) => {
      setTimeout(() => this.applySettings(), 50);
    };
    Blockbench.on('view_restored', this.onPreviewAdded);

    // Main Variable (If there's a setting in localStorage, use that.)
    this.clipDistance =
      parseFloat(localStorage.getItem("farsight_clipDistance")) || 200000;
    // Side Effect to fix the small Zoom Distance
    this.maxDistance = 300000;
    // Create the Apply Settings Function
    this.applySettings = () => {
      // Safety
      if (!Preview.all) return;

      Preview.all.forEach((preview) => {
        // Perspective
        preview.camPers.far = this.clipDistance;
        preview.camPers.updateProjectionMatrix();

        // Check Controls
        if (preview.controls) {
          preview.controls.maxDistance = this.maxDistance;
        }

        // Ortho
        preview.camOrtho.far = this.clipDistance;
        preview.camOrtho.updateProjectionMatrix();

        preview.render();
      });
    };

    // Apply Settings
    this.applySettings();

    //----------------------------------------
    // Farsight Configure Window
    this.configureAction = new Action("configure_farsight", {
      name: "Configure Farsight",
      description: "Adjust the Clipping Distance.",
      icon: "settings",
      click: () => {
        let dialog = new Dialog({
          id: "farsight_config",
          title: "Farsight Settings",
          form: {
            clipDistance: {
              label: "Maximum Clipping Distance (1,000,000 is current cap)",
              type: "number",
              value: this.clipDistance,
              min: 10000,
              max: 1000000,
              step: 10000,
            },
            info: {
              type: "info",
              text: "Higher values allow for larger viewing distances, but be aware of performance impact. Especially with Textures applied.",
            },
          },
          onConfirm: (formData) => {
            this.clipDistance = formData.clipDistance;

            // Apply Config Settings
            localStorage.setItem("farsight_clipDistance", this.clipDistance);

            this.applySettings();
            Blockbench.showQuickMessage("Farsight Settings Updated!");
            dialog.hide();
          },
        });
        dialog.show();
      },
    });
    MenuBar.addAction(this.configureAction, "tools");
  },

  onunload() {
    // Clean Up
    let defaultFarPers = 10000;
    let defaultFarOrtho = 6000;
    let defaultMaxDistance = Infinity;

    Preview.all.forEach((preview) => {
      preview.camPers.far = defaultFarPers;
      preview.camPers.updateProjectionMatrix();
      if (preview.controls) preview.controls.maxDistance = defaultMaxDistance;

      preview.camOrtho.far = defaultFarOrtho;
      preview.camOrtho.updateProjectionMatrix();
      preview.render();
    });

    if (this.applyAction) this.applyAction.delete();
    if (this.configureAction) this.configureAction.delete();
  },
});
