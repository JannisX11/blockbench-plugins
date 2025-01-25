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
        description: "Close all tabs but this one.",
        icon: "close",
        condition: () => ModelProject.all.length > 1,
        click: this.closeOtherProjects.bind(this),
      });
      var close_right = new Action("close_right", {
        name: "Close to the Right",
        description: "Close all tabs to the right.",
        icon: "tab_close_right",
        condition: () =>
          ModelProject.all.indexOf(Project) != ModelProject.all.length - 1,
        click: this.closeRightProjects.bind(this),
      });
      var close_saved = new Action("close_saved", {
        name: "Close Saved",
        description: "Close all saved tabs.",
        icon: "tab_close_inactive",
        condition: () => ModelProject.all.length > 1,
        click: this.closeSavedProjects.bind(this),
      });
      var close_all = new Action("close_all", {
        name: "Close All",
        description: "Close all tabs.",
        icon: "tab_close",
        condition: () => ModelProject.all.length > 1,
        click: this.closeAllProjects.bind(this),
      });
      ModelProject.prototype.menu.addAction(close_others, "#manage");
      ModelProject.prototype.menu.addAction(close_right, "#manage");
      ModelProject.prototype.menu.addAction(close_saved, "#manage");
      ModelProject.prototype.menu.addAction(close_all, "#manage");
      this.deleteables.push(close_others, close_right, close_saved, close_all);
    }
  }

  BBPlugin.register("tweaks_n_stuff", {
    title: "Tweaks & Stuff",
    author: "legopitstop",
    icon: "icon.png",
    description:
      "Adds a few tweaks to Blockbench to make your modeling experience better.",
    has_changelog: true,
    website: "https://docs.lpsmods.dev/tweaks_n_stuff",
    repository:
      "https://github.com/legopitstop/blockbench-plugins/tree/master/plugins/tweaks_n_stuff",
    variant: "both",
    version: "1.0.2",
		min_version: "4.8.0",
    tags: ["Blockbench"],
    new_repository_format: true,
    onload() {
      Tweak.all = [
        new HeaderColorTweak(),
        new WrapTabsTweak(),
        new CloseActionsTweak(),
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
      SettingsProfile.prototype.select = selectProfile;
      SettingsProfile.prototype.unselect = unselectProfile;
      Tweak.all.forEach((tweak) => tweak.delete());
    },
  });
})();
