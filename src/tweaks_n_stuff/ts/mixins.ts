export abstract class Mixins {
  private static selectProfile: (update?: boolean) => void;
  private static unselectProfile: (update?: boolean) => void;
  private static hideDialog: () => Dialog;
  private static showDialog: (anchor?: HTMLElement) => Dialog;
  private static selectCube: (event?: Event, is_outliner_click?: boolean) => false | Cube;
  private static unselectCube: (...args: any[]) => Cube;

  static load(): void {
    this.selectProfile = SettingsProfile.prototype.select;
    SettingsProfile.prototype.select = function (...args) {
      Mixins.selectProfile.apply(this, args);
      Blockbench.dispatchEvent("profile_changed", {
        profile: SettingsProfile.selected,
      });
    };

    this.unselectProfile = SettingsProfile.unselect;
    SettingsProfile.unselect = function (...args) {
      Mixins.unselectProfile.apply(this, args);
      Blockbench.dispatchEvent("profile_changed", { profile: null });
    };

    this.hideDialog = Dialog.prototype.hide;
    Dialog.prototype.hide = function (...args) {
      Blockbench.dispatchEvent("hide_dialog", { dialog: this });
      return Mixins.hideDialog.apply(this, args);
    };

    this.showDialog = Dialog.prototype.show;
    Dialog.prototype.show = function (...args) {
      const result = Mixins.showDialog.apply(this, args);
      Blockbench.dispatchEvent("show_dialog", { dialog: this });
      return result;
    };

    this.selectCube = Cube.prototype.select;
    Cube.prototype.select = function (...args) {
      const result = Mixins.selectCube.apply(this, args);
      Blockbench.dispatchEvent("select_cube", Cube.selected);
      return result;
    };

    this.unselectCube = Cube.prototype.unselect;
    Cube.prototype.unselect = function (...args) {
      const result = Mixins.unselectCube.apply(this, args);
      Blockbench.dispatchEvent("unselect_cube", Cube.selected);
      return result;
    };
  }

  static unload(): void {
    SettingsProfile.prototype.select = Mixins.selectProfile;
    SettingsProfile.unselect = Mixins.unselectProfile;
    Dialog.prototype.hide = Mixins.hideDialog;
    Dialog.prototype.show = Mixins.showDialog;
    Cube.prototype.select = Mixins.selectCube;
    Cube.prototype.unselect = Mixins.unselectCube;
  }
}
