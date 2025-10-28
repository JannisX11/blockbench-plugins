import { ToggleTweak } from "./base";
import { process } from "../utils";

// TODO: Disabled, Ask, Force
class CloseActionsTweak extends ToggleTweak {
  constructor() {
    super("close_actions", { author: "legopitstop", category: "interface" });
  }

  closeAllProjects() {
    Blockbench.showQuickMessage("Closing all projects…");
    process([...ModelProject.all], (p) => {
      if (!p || p.pinned) return;
      p.close(false, false);
    });
  }

  closeSavedProjects() {
    Blockbench.showQuickMessage("Closing saved projects…");
    process([...ModelProject.all], (p) => {
      if (!p || !p.saved || p.pinned) return;
      p.close(false, false);
    });
  }

  closeRightProjects() {
    Blockbench.showQuickMessage("Closing projects to right…");
    if (!Project) return;
    const index = ModelProject.all.indexOf(Project);
    process([...ModelProject.all], (p, i) => {
      if (!p || i <= index || p.pinned) return;
      p.close(false, false);
    });
  }

  closeOtherProjects() {
    Blockbench.showQuickMessage("Closing other projects…");
    if (!Project) return;
    const uuid = Project.uuid;
    process([...ModelProject.all], (p) => {
      if (!p || uuid == p.uuid || p.pinned) return;
      p.close(false, false);
    });
  }

  onEnable() {
    var close_others = new Action("close_others", {
      icon: "close",
      condition: () => ModelProject.all.length > 1,
      click: this.closeOtherProjects.bind(this),
    });
    var close_right = new Action("close_right", {
      icon: "tab_close_right",
      condition: () => Project && ModelProject.all.indexOf(Project) != ModelProject.all.length - 1,
      click: this.closeRightProjects.bind(this),
    });
    var close_saved = new Action("close_saved", {
      icon: "tab_close_inactive",
      condition: () => ModelProject.all.length > 1,
      click: this.closeSavedProjects.bind(this),
    });
    var close_all = new Action("close_all", {
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

new CloseActionsTweak();
