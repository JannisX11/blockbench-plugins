import "./tools/index.js";
import "./generators/index.js";

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
    Mesh.prototype.menu.structure.unshift("meshtools");
    MenuBar.addAction("@meshtools/generators", "filter");
  },
  onunload() {
    const forceRemove = (id, array) => {
      if (!array) return;

      let action = array.find((e) => e.id == id);
      while (action) {
        array.remove(action);
        action = array.find((e) => e.id == id);
      }
    };

    BarItems["quickprimitives"]?.children?.forEach?.((e) => BarItems[e]?.delete());
    BarItems["@meshtools/uv_mapping"]?.children?.forEach?.((e) =>
      BarItems[e]?.delete()
    );
    BarItems["meshtools"]?.children?.forEach?.((e) => BarItems[e]?.delete());
    BarItems["@meshtools/generators"]?.children?.forEach?.((e) => BarItems[e]?.delete());

    forceRemove("@meshtools/generators", MenuBar.menues.tools.structure);
    forceRemove("meshtools", Mesh.prototype.menu.structure);
  },
});
