(function () {
  var selectProfile;
  var unselectProfile;

  function process(array, callback) {
    let index = 0;
    function processChunk() {
      callback(array[index], index);
      index++;
      if (index < array.length) {
        requestAnimationFrame(processChunk);
      }
    }
    processChunk();
  }

  class Tweak {
    constructor(id, name, description, category) {
      this.plugin = "tweaks_n_stuff";
      this.id = id;
      this.name = name;
      this.description = description;
      this.setting = new Setting(this.id, {
        name: this.name,
        value: true,
        description: `(${this.plugin}) ${this.description}`,
        category: category,
        onChange: (v) => this.onChange(v),
      });
      this.isActive = false;
      this.deleteables = [];
    }
    load() {
      if (!Settings.get(this.id)) return;
      this.enable();
    }
    onChange(value) {
      this.disable();
      if (!value) return;
      return this.enable();
    }
    enable() {
      console.info(`🔧✅ Enabled tweak "${this.id}" from "${this.plugin}"`);
      this.isActive = true;
      this.onEnable();
    }
    disable() {
      if (!this.isActive) return;
      console.info(`🔧❌ Disabled tweak "${this.id}" from "${this.plugin}"`);
      this.isActive = false;
      this.deleteables.forEach((e) => e.delete());
      this.onDisable();
    }
    delete() {
      this.disable();
      this.setting.delete();
    }
    onEnable() {}
    onDisable() {}
  }

  // TODO: Improve readability of text and icon colors.
  class HeaderColorTweak extends Tweak {
    constructor() {
      super(
        "header_color",
        "Header Color",
        "Sets the color of the header depending on the profile color.",
        "interface"
      );
    }
    update() {
      if (this.rootStyle) this.rootStyle.delete();
      if (SettingsProfile.selected == null) {
        this.rootStyle = Blockbench.addCSS(
          `:root{--color-header-bg:var(--color-frame);--color-header-text:var(--color-text);--filter-corner-logo:unset;}`
        );
        return;
      }
      const color1 = markerColors[SettingsProfile.selected.color].standard;
      const color2 = tinycolor
        .mostReadable(new tinycolor(color1), ["#333", "#ddd"])
        .toHexString();
      const filter =
        color2 == "#333333"
          ? "invert(100%) sepia(0%) saturate(6873%) hue-rotate(217deg) brightness(113%) contrast(73%)"
          : "invert(19%) sepia(10%) saturate(12%) hue-rotate(314deg) brightness(98%) contrast(96%)";
      this.rootStyle = Blockbench.addCSS(
        `:root{--color-header-bg:${color1};--color-header-text:${color2};--filter-corner-logo:${filter};}`
      );
    }
    onEnable() {
      this.update();
      const css = Blockbench.addCSS(
        `div#corner_logo{filter:var(--filter-corner-logo);}header{background-color:var(--color-header-bg)}header>*{color:var(--color-header-text) !important;}`
      );
      this.deleteables.push(
        Blockbench.on("profile_changed", this.update.bind(this)),
        css
      );
    }
    onDisable() {
      if (!this.rootStyle) return;
      this.rootStyle.delete();
    }
  }

  class WrapTabsTweak extends Tweak {
    constructor() {
      super(
        "wrap_tabs",
        "Wrap Tabs",
        "Controls whether tabs should be wrapped over multiple lines when exceeding available space or whether a scrollbar should appear instead.",
        "interface"
      );
    }
    onEnable() {
      this.css = Blockbench.addCSS(
        `#tab_bar #tab_bar_list{overflow-y:none;scrollbar-width:auto;flex-wrap:wrap;}#tab_bar{height:auto;align-items:center;}#tab_bar .project_tab{height:32px}#search_tab_button{height:auto;}`
      );
      this.deleteables.push(this.css);
    }
  }

  class CloseActionsTweak extends Tweak {
    constructor() {
      super(
        "close_actions",
        "Close Actions",
        'Adds "close others", "close to the right", "close saved", and "close all" to the project context menu.',
        "interface"
      );
    }
    closeAllProjects() {
      Blockbench.showQuickMessage("Closing all projects…");
      process([...ModelProject.all], (p) => {
        if (!p) return;
        p.close();
      });
    }

    closeSavedProjects() {
      Blockbench.showQuickMessage("Closing saved projects…");
      process([...ModelProject.all], (p) => {
        if (!p || !p.saved) return;
        p.close();
      });
    }

    closeRightProjects() {
      Blockbench.showQuickMessage("Closing projects to right…");
      const index = ModelProject.all.indexOf(Project);
      process([...ModelProject.all], (p, i) => {
        if (!p || i <= index) return;
        p.close();
      });
    }

    closeOtherProjects() {
      Blockbench.showQuickMessage("Closing other projects…");
      const uuid = Project.uuid;
      process([...ModelProject.all], (p) => {
        if (!p || uuid == p.uuid) return;
        p.close();
      });
    }

    onEnable() {
      var close_others = new Action("close_others", {
        name: "Close Others",
        icon: "close",
        condition: () => ModelProject.all.length > 1,
        click: this.closeOtherProjects,
      });
      var close_right = new Action("close_right", {
        name: "Close to the Right",
        icon: "tab_close_right",
        condition: () =>
          ModelProject.all.indexOf(Project) != ModelProject.all.length - 1,
        click: this.closeRightProjects,
      });
      var close_saved = new Action("close_saved", {
        name: "Close Saved",
        icon: "tab_close_inactive",
        condition: () => ModelProject.all.length > 1,
        click: this.closeSavedProjects,
      });
      var close_all = new Action("close_all", {
        name: "Close All",
        icon: "tab_close",
        condition: () => ModelProject.all.length > 1,
        click: this.closeAllProjects,
      });
      ModelProject.prototype.menu.addAction(close_others, "#manage");
      ModelProject.prototype.menu.addAction(close_right, "#manage");
      ModelProject.prototype.menu.addAction(close_saved, "#manage");
      ModelProject.prototype.menu.addAction(close_all, "#manage");
      this.deleteables.push(close_others, close_right, close_saved, close_all);
    }
  }

  class ImageExporterTweak extends Tweak {
    constructor() {
      super(
        "image_exporter",
        "Image Exporter",
        'Adds an "Export as Image" action to image projects.',
        "export"
      );
    }

    getSupportedFormats() {
      if (this.supportedFormats != null) {
        return this.supportedFormats;
      }
      const formats = [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/webp",
        "image/gif",
        "image/apng",
        "image/tiff",
        "image/tif",
        "image/svg",
        "image/pdf",
        "image/xbm",
        "image/bmp",
        "image/ico",
        "image/heif",
      ];
      const canvas = document.createElement("canvas");
      this.supportedFormats = [];

      formats.forEach((format) => {
        try {
          const dataUrl = canvas.toDataURL(format);
          if (dataUrl.startsWith(`data:${format}`)) {
            this.supportedFormats.push(format);
          }
        } catch (e) {}
      });

      return this.supportedFormats;
    }

    onEnable() {
      function convertImage(format, quality = 1.0) {
        return new Promise((resolve, reject) => {
          let img = new Image();
          img.src = Project.textures[0].getDataURL();
          img.onload = () => {
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const base64Res = canvas.toDataURL("image/" + format, quality);
            resolve(base64Res);
          };

          img.onerror = (error) => {
            reject("Error loading image");
          };
        });
      }
      function exportImage(format, quality) {
        convertImage(format, quality).then((img) => {
          Blockbench.export({
            extensions: [format],
            type: tl("data.image"),
            savetype: "image",
            name: Project.name || "image." + format,
            resource_id: "export_image",
            content: img,
          });
        });
      }
      var options = {};
      this.getSupportedFormats().forEach((e) => {
        var k = e.substring(6);
        options[k] = k.toUpperCase();
      });
      var dialog = new Dialog({
        id: "export_image",
        title: "Export Image",
        form: {
          format: {
            label: "Format",
            type: "select",
            options: options,
            description: "Supported image formats for this browser.",
          },
          quality: {
            label: "Quality",
            type: "range",
            min: 0,
            max: 100,
            value: 100,
          },
        },
        onConfirm: function (formData) {
          exportImage(formData.format, formData.quality / 100);
          this.hide();
        },
      });
      var exportBtn = new Action("export_image", {
        name: "Export as Image",
        description: "Exports image",
        icon: "image",
        condition: () => Project && Project.format.id === "image",
        click: function () {
          dialog.show();
        },
      });
      MenuBar.addAction(exportBtn, "file.export");
      this.deleteables.push(dialog, exportBtn);
    }
  }

  Tweak.all = [
    new HeaderColorTweak(),
    new WrapTabsTweak(),
    new CloseActionsTweak(),
    new ImageExporterTweak(),
  ];
  BBPlugin.register("tweaks_n_stuff", {
    title: "Tweaks & Stuff",
    author: "legopitstop",
    icon: "icon.png",
    description:
      "Adds a few tweaks to Blockbench to make your modeling experience better.",
    has_changelog: true,
    website: "https://lpsmods.dev",
    repository:
      "https://github.com/legopitstop/blockbench-plugins/tree/master/plugins/tweaks_n_stuff",
    variant: "both",
    version: "1.0.0",
    tags: ["Blockbench"],
    new_repository_format: true,
    tags: ["Blockbench"],
    onload() {
      Tweak.all = [
        new HeaderColorTweak(),
        new WrapTabsTweak(),
        new CloseActionsTweak(),
        new ImageExporterTweak(),
      ];

      Tweak.all.forEach((tweak) => tweak.load());

      // TODO: On Update event (Modifying profile color does'nt update)
      selectProfile = SettingsProfile.prototype.select;
      SettingsProfile.prototype.select = function (...args) {
        selectProfile.apply(this, args);
        Blockbench.dispatchEvent("profile_changed", {
          profile: SettingsProfile.selected,
        });
      };
      unselectProfile = SettingsProfile.unselect;
      SettingsProfile.unselect = function (...args) {
        unselectProfile.apply(this, args);
        Blockbench.dispatchEvent("profile_changed", { profile: null });
      };
    },
    onunload() {
      Tweak.all.forEach((tweak) => tweak.delete());
      SettingsProfile.prototype.select = selectProfile;
      SettingsProfile.prototype.unselect = unselectProfile;
      Tweak.all.forEach((tweak) => tweak.delete());
    },
  });
})();
