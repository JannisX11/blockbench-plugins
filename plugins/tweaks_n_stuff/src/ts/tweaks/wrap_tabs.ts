import { ToggleTweak } from "./base";

class WrapTabsTweak extends ToggleTweak {
  css: Deletable;

  constructor() {
    super("wrap_tabs", { author: "legopitstop", category: "interface" });
  }

  onEnable() {
    const css = `#tab_bar #tab_bar_list{overflow-y:none;scrollbar-width:auto;flex-wrap:wrap;}#tab_bar{height:auto;align-items:center;}#tab_bar .project_tab{height:32px}#search_tab_button{height:auto;}`;
    this.deleteables.push(Blockbench.addCSS(css));
  }
}

new WrapTabsTweak();
