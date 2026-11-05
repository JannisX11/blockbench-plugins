import { ID } from "../constants";
import { wrapError } from "../utils";

export interface TweakOptions {
  author?: string;
  category?: string;
  condition?: ConditionResolvable;
  name?: string;
  description?: string;
}

export class Tweak {
  static all = new Map<string, Tweak>();
  static dialog: Dialog;
  static action: Action;

  id: string;
  author: string;
  category: string;
  condition: ConditionResolvable;
  pluginId: string;
  setting: Setting | undefined;
  name?: string;
  description?: string;

  isActive: boolean = false;
  deleteables: Deletable[];

  /**
   * Base tweak class.
   *
   * @param {string} id
   * @param {TweakOptions} options
   */
  constructor(id: string, options?: TweakOptions) {
    this.id = id;
    this.name = options?.name;
    this.description = options?.description;
    this.author = options?.author ?? "unset";
    this.category = options?.category ?? "unset";
    this.condition = options?.condition ?? true;
    this.pluginId = ID;
    this.deleteables = [];
    this.setup();
    Tweak.all.set(this.id, this);
    console.debug(`🔧 Registered tweak "${this.id}"`);
  }

  createConfig(): any {
    return {
      enabled: true,
    };
  }

  get config(): any {
    return TweakConfig.settings[this.id];
  }

  set config(value) {
    TweakConfig.settings[this.id] = value;
  }

  /**
   * Load this tweak.
   */
  load(): void {
    this.setup();
    wrapError(this.onLoad.bind(this));
  }

  /**
   * Unload this tweak.
   */
  unload(): void {
    wrapError(this.onUnload.bind(this));
    this.delete();
  }

  /**
   * Install this tweak.
   */
  install(): void {
    wrapError(this.onInstall.bind(this));
  }

  /**
   * Uninstall this tweak.
   */
  uninstall(): void {
    wrapError(this.onUninstall.bind(this));
  }

  /**
   * Delete this tweak with its setting and deleteables.
   */
  delete(): void {
    this.deleteables.forEach((e) => e.delete());
    if (this.setting) this.setting.delete();
  }

  /**
   * Enable this tweak.
   */
  enable(): void {
    console.debug(`✅ Enabled tweak "${this.id}"`);
    this.isActive = true;
  }

  /**
   * Disable this tweak.
   */
  disable(): void {
    this.deleteables.forEach((e) => e.delete());
    if (!this.isActive) return;
    console.debug(`❌ Disabled tweak "${this.id}"`);
  }

  /**
   * Called when this tweak is created.
   */
  setup(): void {}

  // EVENTS

  /**
   * Called when this tweak is loaded.
   */
  onLoad(): void {}

  /**
   * Called when this tweak is unloaded.
   */
  onUnload(): void {}

  /**
   * Called when this plugin is installed.
   */
  onInstall(): void {}

  /**
   * Called when this plugin is uninstalled.
   */
  onUninstall(): void {}
}

/**
 * Base tweak with a "toggle" setting.
 */
export class ToggleTweak extends Tweak {
  defaultValue: boolean;

  constructor(id: string, options?: TweakOptions, defaultValue: boolean = true) {
    super(id, options);
    this.defaultValue = defaultValue;
  }

  get disabled() {
    return !(Settings.get(this.id) ?? false);
  }

  setup() {
    this.isActive = false;
    this.setting = new Setting(this.id, {
      name: this.name,
      type: "toggle",
      value: this.defaultValue,
      description: this.description,
      category: this.category,
      condition: this.condition,
      onChange: (v) => this.change(v),
    });
  }

  enable(): void {
    super.enable();
    if (!this.onEnable) return;
    wrapError(this.onEnable.bind(this));
  }

  disable(): void {
    super.disable();
    if (!this.isActive) return;
    this.isActive = false;
    if (!this.onDisable) return;
    wrapError(this.onDisable.bind(this));
  }

  private change(value: boolean): void {
    if (this.onChange) this.onChange(value);
    this.disable();
    if (!value) return;
    return this.enable();
  }

  // EVENTS

  onLoad(): void {
    if (this.disabled) return;
    this.enable();
  }

  onUnload(): void {
    this.disable();
  }

  onChange?(value: boolean): void;

  /**
   * Called when this tweak is enabled.
   */
  onEnable?(): void;

  /**
   * Called when this tweak is disabled.
   */
  onDisable?(): void;
}

/**
 * Base tweak with a dialog setting.
 */
export class EditTweak extends Tweak {
  dialog: any;

  setup() {
    this.dialog = this.createDialog();
    this.deleteables.push(this.dialog);

    this.setting = new Setting(this.id, {
      name: this.name,
      type: "click",
      value: 0,
      description: this.description,
      category: this.category,
      condition: this.condition,
      icon: "edit",
      click: this.onClick.bind(this),
    });
  }

  /**
   * Called when the user clicks the setting.
   */
  onClick(): void {
    this.dialog.show();
  }

  createDialog(): void {}
}

// TODO: Default value not set.
/**
 * Base tweak with a "select" setting.
 */
export class SelectTweak extends Tweak {
  defaultKey: string;
  options: { [key: string]: string } = {};

  /**
   * @param {string} id
   * @param {string} defaultKey
   * @param {TweakOptions} options
   */
  constructor(id: string, defaultKey: string = "default", options?: TweakOptions) {
    super(id, options);
    this.defaultKey = defaultKey;
  }

  get disabled() {
    return Settings.get(this.id) == this.defaultKey;
  }

  setup() {
    this.options = this.getOptions();
    this.isActive = false;
    this.setting = new Setting(this.id, {
      name: this.name,
      type: "select",
      options: this.options,
      value: this.defaultKey,
      description: this.description,
      category: this.category,
      condition: this.condition,
      onChange: (v) => this.onChange(v),
    });
  }
  enable(): void {
    super.enable();
    this.isActive = true;
    try {
      this.onEnable();
    } catch (err) {
      console.error(err);
    }
  }

  disable(): void {
    super.disable();
    if (!this.isActive) return;
    this.isActive = false;
    try {
      this.onDisable();
    } catch (err) {
      console.error(err);
    }
  }

  private onChange(value: string): void {
    this.disable();
    if (this.disabled) return;
    return this.enable();
  }

  getOptions(): { [key: string]: string } {
    return { default: "Disabled" };
  }

  // EVENTS

  onLoad(): void {
    if (this.disabled) return;
    this.enable();
  }

  onUnload(): void {
    this.disable();
  }

  /**
   * Called when this tweak is enabled.
   */
  onEnable(): void {}

  /**
   * Called when this tweak is disabled.
   */
  onDisable(): void {}
}

/**
 * Handles tweak settings. Like wether or not its enabled or not.
 */
export class TweakConfig {
  static settings: { [key: string]: any } = {};

  static load() {
    var s = localStorage.getItem("tweaks_n_stuff.config");
    if (!s) {
      TweakConfig.settings = {};
      for (const t of Tweak.all.values()) {
        TweakConfig.settings[t.id] = t.createConfig();
      }
      return TweakConfig.save();
    }
    TweakConfig.settings = JSON.parse(s);
  }

  static save() {
    localStorage.setItem("tweaks_n_stuff.config", JSON.stringify(TweakConfig.settings));
  }
}
