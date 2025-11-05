export abstract class Mixins {
  private static selectProfile: (update: boolean) => void;
  private static unselectProfile: (update: boolean) => void;
  private static hideDialog: () => Dialog;
  private static showDialog: (anchor?: HTMLElement) => Dialog;

  static load(): void {
    this.selectProfile = SettingsProfile.prototype.select;
    SettingsProfile.prototype.select = function (...args) {
      Mixins.selectProfile.apply(this, args);
      // @ts-ignore
      Blockbench.dispatchEvent("profile_changed", {
        profile: SettingsProfile.selected,
      });
    };

    this.unselectProfile = SettingsProfile.unselect;
    SettingsProfile.unselect = function (...args) {
      Mixins.unselectProfile.apply(this, args);
      // @ts-ignore
      Blockbench.dispatchEvent("profile_changed", { profile: null });
    };

    this.hideDialog = Dialog.prototype.hide;
    Dialog.prototype.hide = function (...args) {
      // @ts-ignore
      Blockbench.dispatchEvent("hide_dialog", Dialog.open);
      return Mixins.hideDialog.apply(this, args);
    };

    this.showDialog = Dialog.prototype.show;
    Dialog.prototype.show = function (...args) {
      const result = Mixins.showDialog.apply(this, args);
      // @ts-ignore
      Blockbench.dispatchEvent("show_dialog", Dialog.open);
      return result;
    };
  }

  static unload(): void {
    SettingsProfile.prototype.select = Mixins.selectProfile;
    SettingsProfile.unselect = Mixins.unselectProfile;
    Dialog.prototype.hide = Mixins.hideDialog;
    Dialog.prototype.show = Mixins.showDialog;
  }
}
