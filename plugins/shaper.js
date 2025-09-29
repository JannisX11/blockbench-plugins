(function () {
  let menuAction;

  Plugin.register("shaper", {
    title: "Shaper",
    author: "Vowxky",
    description: "Support tool for the Shaper mod that helps create and export hitboxes. Exports Voxel Shapes as a flat JSON list with scope selection for easier editing and reuse.",
    version: "1.0.0",
    icon: "bar_chart",
    variant: "both",
    tags: ["Minecraft: Java Edition"],

    onload() {
      menuAction = new Action("shaper_export_flat_json", {
        name: "Export Shape Json",
        description: "Exports as [[x1,y1,z1,x2,y2,z2], ...] with group/selected/all selection",
        icon: "fa-file-export",
        click: () => openExportDialog()
      });
      MenuBar.addAction(menuAction, "file.export");
    },

    onunload() {
      menuAction?.delete();
    }
  });

  function openExportDialog() {
    const dlg = new Dialog({
      id: "shaper_export_dialog",
      title: "Shaper Export",
      width: 420,
      form: {
        scope: {
          label: "Cubes to export",
          type: "select",
          options: {
            group: "Group",
            selected: "Selected cubes",
            all: "All cubes"
          },
          value: "group"
        },
        groupName: {
          label: "Group name",
          type: "text",
          value: "shapes",
          condition: (f) => f.scope === "group"
        }
      },
      onConfirm(form) {
        exportFlatJson(form);
      }
    });
    dlg.show();
  }

  function exportFlatJson(form) {
    const centered = Format.centered_grid;
    const scope = (form.scope || "group");
    const groupName = String(form.groupName || "shapes").trim();
    let cubes = [];

    if (scope === "group") {
      const grp = findGroupByName(groupName);
      if (!grp) {
        Blockbench.showQuickMessage(`Shaper: Group "${groupName}" not found. Nothing exported.`);
        return;
      }
      cubes = collectCubesFromGroup(grp);
      if (!cubes.length) {
        Blockbench.showQuickMessage(`Shaper: Group "${groupName}" has no cubes. Nothing exported.`);
        return;
      }
    } else if (scope === "selected") {
      const sel = (typeof selected !== "undefined" && Array.isArray(selected)) ? selected : [];
      cubes = sel.filter(n => n && n.type === "cube");
      if (!cubes.length) {
        Blockbench.showQuickMessage("Shaper: No selected cubes. Nothing exported.");
        return;
      }
    } else {
      cubes = (Cube.all || []);
      if (!cubes.length) {
        Blockbench.showQuickMessage("Shaper: No cubes found in model. Nothing exported.");
        return;
      }
    }

    const payload = buildBoxesFromCubes(cubes, centered);
    const baseName = (Project && Project.name ? Project.name : "voxel_shape");
    const fileName = (scope === "group" ? `shapes/${baseName}.json` : `${baseName}.json`);

    Blockbench.export({
      type: "Voxel Shape File",
      extensions: ["json"],
      savetype: "text",
      name: fileName,
      content: JSON.stringify(payload)
    });

    Blockbench.showQuickMessage(
      `Shaper: JSON exported (${scope === "group" ? `group "${groupName}"` : (scope === "selected" ? "selected cubes" : "all cubes")}).`
    );
  }

  function findGroupByName(name) {
    if (!Group || !Group.all) return null;
    const target = (name || "").toLowerCase();
    return Group.all.find(g => g && typeof g.name === "string" && g.name.toLowerCase() === target) || null;
  }

  function collectCubesFromGroup(group) {
    const out = [];
    (function walk(node) {
      if (!node) return;
      if (node.type === "cube") { out.push(node); return; }
      if (node.children && Array.isArray(node.children)) node.children.forEach(walk);
    })(group);
    return out;
  }

  function pxToBlock(px) { return px / 16.0; }
  function numWithCenter(px, isXZ, centered) {
    const base = pxToBlock(px);
    return centered && isXZ ? base + 0.5 : base;
  }

  function buildBoxesFromCubes(cubes, centered) {
    const list = cubes.slice().sort((a, b) => {
      if (a.from[1] !== b.from[1]) return a.from[1] - b.from[1];
      if (a.from[0] !== b.from[0]) return a.from[0] - b.from[0];
      return a.from[2] - b.from[2];
    });

    return list.map(c => ([
      numWithCenter(c.from[0], true,  centered),
      numWithCenter(c.from[1], false, centered),
      numWithCenter(c.from[2], true,  centered),
      numWithCenter(c.to[0],   true,  centered),
      numWithCenter(c.to[1],   false, centered),
      numWithCenter(c.to[2],   true,  centered)
    ]));
  }
})();
