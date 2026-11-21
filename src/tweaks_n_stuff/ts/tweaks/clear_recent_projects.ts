import { ToggleTweak } from "./base";

class ClearRecentProjectsTweak extends ToggleTweak {
  private button?: HTMLLIElement;
  private observer?: MutationObserver;

  constructor() {
    super("clear_recent_projects", { author: "legopitstop", category: "interface" });
  }

  onEnable(): void {
    const button = document.createElement("li");
    button.className = "tool tweaks_clear_recent_projects";
    button.title = tl("action.clear_recent_projects");
    button.setAttribute("role", "button");
    button.tabIndex = 0;
    button.setAttribute("aria-label", button.title);
    button.innerHTML = '<i class="material-icons">delete_sweep</i>';
    button.onclick = () => {
      if (!recent_projects.length) return;
      Blockbench.showMessageBox(
        {
          title: tl("action.clear_recent_projects"),
          message: tl("dialog.clear_recent_projects.message"),
          buttons: ["dialog.confirm", "dialog.cancel"],
        },
        (result) => {
          if (result !== 0) return;
          recent_projects.length = 0;
          updateRecentProjects();
        },
      );
    };
    button.onkeydown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        button.click();
      }
    };
    this.button = button;
    const mount = () => {
      const menu = document.getElementById("start_screen_view_menu");
      const search = menu?.firstElementChild;
      if (search && button.previousElementSibling !== search) search.after(button);
    };
    mount();
    const startFiles = document.getElementById("start_files");
    if (startFiles) {
      this.observer = new MutationObserver(mount);
      this.observer.observe(startFiles, { childList: true, subtree: true });
    }
  }

  onDisable(): void {
    this.observer?.disconnect();
    this.observer = undefined;
    this.button?.remove();
    this.button = undefined;
  }
}

new ClearRecentProjectsTweak();
