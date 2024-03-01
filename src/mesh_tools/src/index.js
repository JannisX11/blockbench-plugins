import "./tools/index.js";
import "./operators/index.js";
import "./generators/index.js";
import { ACTIONS, qualifyName } from "./actions.js";

BBPlugin.register("mesh_tools", {
  new_repository_format: true,
  title: "MTools",
  icon: "fas.fa-vector-square",
  author: "Malik12tree",
  description: "Adds helpful Mesh Modeling Tools, Operators and Generators!",
  version: "1.1.0",
  minVersion: "4.7.0",
  variant: "both",
  tags: ["Format: Generic Model", "Edit"],
  onload() {
    Mesh.prototype.menu.structure.unshift("@meshtools/tools");
    Mesh.prototype.menu.structure.unshift("@meshtools/operators");
    MenuBar.addAction("@meshtools/generators", "filter");
  },
  onunload() {
    for (const actionId in ACTIONS) {
      const id = qualifyName(actionId);
      BarItems[id]?.delete();
    } 
  },
});
