import { ToggleTweak } from "./base";

declare global {
  interface ModelProject {
    pinned?: boolean;
  }
}

class PinTabTweak extends ToggleTweak {
  static originalClose?: any;

  constructor() {
    super("pin_tab", { author: "legopitstop", category: "interface" });
  }

  private static sort(): void {
    ModelProject.all = ModelProject.all.sort((a, b) => {
      if (a.pinned && !b.pinned) {
        return -1;
      }
      if (!a.pinned && b.pinned) {
        return 1;
      }
      return 0;
    });
  }

  static pinTab(): void {
    Blockbench.showQuickMessage("Pinned Tab!");
    if (!Project) return;
    Project.pinned = true;
    PinTabTweak.sort();
    $(".project_tab.selected .project_tab_close_button .close_icon").text("push_pin");
  }

  static unpinTab() {
    Blockbench.showQuickMessage("Unpinned Tab!");
    if (!Project) return;
    Project.pinned = false;
    PinTabTweak.sort();
    $(".project_tab.selected .project_tab_close_button .close_icon").text("clear");
  }

  onClose(force: boolean, unpin: boolean = true) {
    if (!force && unpin && Project?.pinned) {
      PinTabTweak.unpinTab();
      return;
    }
    return PinTabTweak.originalClose.bind(this)(force);
  }

  // EVENTS

  onEnable() {
    const css = Blockbench.addCSS(
      `.project_tab.selected .project_tab_close_button .close_icon[content=\"\"] { background-color: red;}`,
    );
    ModelProject.prototype.pinned = false;
    var pinAction = new Action("pin_tab", {
      icon: "push_pin",
      condition: () => Project && !Project.pinned,
      click: PinTabTweak.pinTab,
    });
    var unpinTab = new Action("unpin_tab", {
      icon: "push_pin",
      condition: () => Project && Project.pinned,
      click: PinTabTweak.unpinTab,
    });
    ModelProject.prototype.menu.addAction(pinAction, "#manage");
    ModelProject.prototype.menu.addAction(unpinTab, "#manage");

    // Inject close
    PinTabTweak.originalClose = ModelProject.prototype.close;
    ModelProject.prototype.close = this.onClose;

    this.deleteables.push(pinAction, unpinTab, css);
  }

  onDisable() {
    delete ModelProject.prototype.pinned;
    if (PinTabTweak.originalClose) ModelProject.prototype.close = PinTabTweak.originalClose;
  }
}

new PinTabTweak();
