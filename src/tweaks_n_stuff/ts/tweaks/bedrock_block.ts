import { ToggleTweak } from "./base";

type GeometryFile = { path: string; content: any; geometry: any };
type GeometryLocation = { kind: "main" } | { kind: "permutation"; index: number; condition: string };

class BedrockBlockGeometryTweak extends ToggleTweak {
  private sources = new WeakMap<ModelProject, { path: string; geometry: string; location: GeometryLocation }>();
  private pendingSelection?: { names: Set<string>; opened: (name: string) => void };

  constructor() {
    super("bedrock_block", { author: "legopitstop", category: "interface" });
  }

  private openBlock(): void {
    Blockbench.import({ type: "Bedrock Block", extensions: ["json"], readtype: "text", multiple: false }, (files) => {
      const file = files[0];
      if (!file?.path || typeof file.content !== "string") return;
      try {
        this.loadBlock(JSON.parse(file.content), file);
      } catch (error) {
        Blockbench.showMessageBox({ title: "Open Bedrock Block", message: String(error) });
      }
    });
  }

  private loadBlock(data: any, file: { path: string; name: string }): void {
    try {
      const block = data["minecraft:block"];
      if (!block || typeof block !== "object") throw new Error("This is not a Bedrock block file.");

      const references = new Map<string, GeometryLocation[]>();
      const collect = (components: any, location: GeometryLocation) => {
        const value = components?.["minecraft:geometry"];
        const identifier = typeof value === "string" ? value : value?.identifier;
        if (typeof identifier === "string" && identifier.startsWith("geometry.")) {
          const locations = references.get(identifier) ?? [];
          locations.push(location);
          references.set(identifier, locations);
        }
      };
      collect(block.components, { kind: "main" });
      for (const [index, permutation] of (block.permutations ?? []).entries()) {
        collect(permutation.components, { kind: "permutation", index, condition: permutation.condition ?? "" });
      }
      if (!references.size) throw new Error("This block does not reference a geometry.");

      const fs = require("fs") as typeof import("fs");
      const path = require("path") as typeof import("path");
      // Find the pack root from its blocks folder, regardless of nesting inside blocks.
      let blocksDir = path.dirname(file.path);
      while (path.basename(blocksDir).toLowerCase() !== "blocks") {
        const parent = path.dirname(blocksDir);
        if (parent === blocksDir) throw new Error("The block file is not inside a blocks folder.");
        blocksDir = parent;
      }
      const packDir = path.dirname(blocksDir);
      const packName = path.basename(packDir);
      const roots = new Set<string>([path.join(packDir, "models", "blocks")]);
      const addPacks = (directory: string) => {
        if (!fs.existsSync(directory)) return;
        const matchingPack = path.join(directory, packName, "models", "blocks");
        if (fs.existsSync(matchingPack)) roots.add(matchingPack);
        for (const pack of fs.readdirSync(directory, { withFileTypes: true })) {
          if (pack.isDirectory()) roots.add(path.join(directory, pack.name, "models", "blocks"));
        }
      };
      let ancestor = path.dirname(packDir);
      for (let depth = 0; depth < 4; depth++) {
        addPacks(ancestor);
        for (const folder of ["resource", "resource_packs", "resource_packs_dev"]) {
          addPacks(path.join(ancestor, folder));
          addPacks(path.join(ancestor, folder, "_packs"));
        }
        const parent = path.dirname(ancestor);
        if (parent === ancestor) break;
        ancestor = parent;
      }

      const matches = new Map<string, GeometryFile>();
      const visit = (directory: string) => {
        if (!fs.existsSync(directory)) return;
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
          const filename = path.join(directory, entry.name);
          if (entry.isDirectory()) visit(filename);
          else if (entry.isFile() && entry.name.endsWith(".json")) {
            try {
              const content = JSON.parse(fs.readFileSync(filename, "utf8"));
              for (const geometry of content["minecraft:geometry"] ?? []) {
                const identifier = geometry?.description?.identifier;
                if (references.has(identifier) && !matches.has(identifier)) {
                  matches.set(identifier, { path: filename, content, geometry });
                }
              }
            } catch {
              /* Ignore unrelated or malformed model files. */
            }
          }
        }
      };
      for (const root of roots) visit(root);
      if (!matches.size) throw new Error(`Could not find a geometry file for ${[...references.keys()].join(", ")}.`);

      const afterOpen = (identifier: string) => {
        const match = matches.get(identifier);
        if (!match) return;
        if (!Project) return;
        Project.export_path = match.path;
        const openedProject = Project;
        const locations = references.get(identifier) ?? [];
        const useLocation = (location: GeometryLocation) => {
          openedProject.select();
          this.sources.set(openedProject, { path: file.path, geometry: identifier, location });
          const components = this.getComponents(block, identifier, location);
          for (const [key, name] of [
            ["minecraft:collision_box", "collision"],
            ["minecraft:selection_box", "selection"],
          ] as const) {
            if (!components || !(key in components)) continue;
            const func = name === "selection" ? "hitbox" : "collision";
            // The geometry loader may already provide boxes. The block definition is authoritative.
            for (const existing of [...BoundingBox.all] as BoundingBox[]) {
              if (existing.function.includes(func) || existing.name === name) existing.remove();
            }
            const boxes = components?.[key];
            if (!boxes) continue;
            const entries =
              boxes === true ? [{ origin: [-8, 0, -8], size: [16, 16, 16] }] : Array.isArray(boxes) ? boxes : [boxes];
            for (const box of entries) {
              if (!Array.isArray(box?.origin) || !Array.isArray(box?.size)) continue;
              new BoundingBox({
                name,
                from: [-(box.origin[0] + box.size[0]), box.origin[1], box.origin[2]],
                to: [-box.origin[0], box.origin[1] + box.size[1], box.origin[2] + box.size[2]],
                function: [func],
                color: name === "selection" ? 0 : 2,
              })
                .addTo()
                .init();
            }
          }
        };
        if (locations.length === 1) return useLocation(locations[0]);
        const options = Object.fromEntries(
          locations.map((location, index) => [
            String(index),
            location.kind === "main"
              ? "Main components"
              : `Permutation ${location.index + 1}: ${location.condition || "(no condition)"}`,
          ]),
        );
        new Dialog({
          id: "bedrock_block_component_source",
          title: "Select Block Component Source",
          form: { source: { label: "Source", type: "select", options } },
          onConfirm: (result) => useLocation(locations[Number(result.source)]),
        }).show();
      };
      if (matches.size === 1) {
        const [identifier, match] = [...matches][0];
        Codecs.bedrock.load(
          { format_version: match.content.format_version, "minecraft:geometry": [match.geometry] },
          {
            name: path.basename(match.path),
            path: match.path,
          },
        );
        afterOpen(identifier);
        return;
      }

      // Hand all candidates to the Bedrock codec so it opens its normal model selector.
      const first = matches.values().next().value!;
      this.pendingSelection = { names: new Set(matches.keys()), opened: afterOpen };
      Codecs.bedrock.load(
        {
          format_version: first.content.format_version,
          "minecraft:geometry": [...matches.values()].map((match) => match.geometry),
        },
        { name: path.basename(first.path), path: first.path },
      );
    } catch (error) {
      Blockbench.showMessageBox({ title: "Open Bedrock Block", message: String(error) });
    }
  }

  private getComponents(block: any, geometry: string, location: GeometryLocation): any {
    const source = location.kind === "main" ? block.components : block.permutations?.[location.index]?.components;
    const value = source?.["minecraft:geometry"];
    const identifier = typeof value === "string" ? value : value?.identifier;
    const condition = location.kind === "permutation" ? (block.permutations?.[location.index]?.condition ?? "") : "";
    if (identifier !== geometry || (location.kind === "permutation" && condition !== location.condition)) {
      throw new Error(
        "The geometry's component source has changed in the block JSON. Reopen the block before saving boxes.",
      );
    }
    return source;
  }

  private saveBoxes(project: ModelProject): void {
    const source = this.sources.get(project);
    if (!source) return;
    try {
      const fs = require("fs") as typeof import("fs");
      const original = fs.readFileSync(source.path, "utf8");
      const data = JSON.parse(original);
      const components = this.getComponents(data["minecraft:block"], source.geometry, source.location);
      if (!components) return;
      const boxes = (BoundingBox.all as BoundingBox[]).filter((box) => box.export !== false);
      for (const [key, func] of [
        ["minecraft:collision_box", "collision"],
        ["minecraft:selection_box", "hitbox"],
      ] as const) {
        const selected = boxes.filter((box) => box.function.includes(func));
        if (!selected.length && !(key in components)) continue;
        const values = selected.map((box) => ({
          origin: [-box.to[0], box.from[1], box.from[2]],
          size: box.size(),
        }));
        if (key === "minecraft:selection_box" && values.length > 1) {
          const from = values.reduce(
            (result, box) => result.map((v, i) => Math.min(v, box.origin[i])),
            [Infinity, Infinity, Infinity],
          );
          const to = values.reduce(
            (result, box) => result.map((v, i) => Math.max(v, box.origin[i] + box.size[i])),
            [-Infinity, -Infinity, -Infinity],
          );
          values.splice(0, values.length, { origin: from, size: to.map((v, i) => v - from[i]) as ArrayVector3 });
        }
        const value = values.length === 0 ? false : values.length === 1 ? values[0] : values;
        components[key] =
          values.length === 1 && values[0].origin.join() === "-8,0,-8" && values[0].size.join() === "16,16,16"
            ? true
            : value;
      }
      if (JSON.stringify(data) === JSON.stringify(JSON.parse(original))) return;
      const indent = /\n(\s+)"/.exec(original)?.[1] ?? "  ";
      fs.writeFileSync(source.path, JSON.stringify(data, null, indent) + "\n", "utf8");
    } catch (error) {
      Blockbench.showMessageBox({ title: "Save Bedrock Block Boxes", message: String(error) });
    }
  }

  onEnable(): void {
    const select = Blockbench.on("show_dialog", ({ dialog }) => {
      if (dialog?.id !== "bedrock_model_select" || !this.pendingSelection) return;
      const pending = this.pendingSelection;
      this.pendingSelection = undefined;
      (dialog as Dialog & { onOpenAllGeometry?: (name: string) => void }).onOpenAllGeometry = (name) => {
        if (pending.names.has(name)) pending.opened(name);
      };
      const selection = dialog.content_vue as typeof dialog.content_vue & {
        open?: (geometry: { name: string; object: any }) => void;
      };
      if (!selection?.open) return;
      const original = selection.open;
      selection.open = function (geometry) {
        original.call(this, geometry);
        if (pending.names.has(geometry.name)) pending.opened(geometry.name);
      };
    });
    const action = new Action("open_bedrock_block", {
      name: "Open Bedrock Block",
      description: "Open the geometry referenced by a Bedrock block JSON file",
      icon: "view_in_ar",
      condition: () => !Blockbench.isWeb,
      click: () => this.openBlock(),
    });
    MenuBar.addAction(action, "file.import");
    const saveToBlock = new Action("save_bedrock_block_boxes", {
      name: "Save to Block",
      description: "Save collision and selection boxes to the source behavior pack block file",
      icon: "save",
      condition: () => !!Project && this.sources.has(Project),
      click: () => {
        if (Project) this.saveBoxes(Project);
      },
    });
    const fileItems = MenuBar.menus.file.structure;
    const saveModelIndex = fileItems.findIndex(
      (item) =>
        item === "save_model" ||
        (typeof item === "object" && item !== null && "id" in item && item.id === "save_model"),
    );
    MenuBar.addAction(saveToBlock, saveModelIndex < 0 ? "file" : `file.${saveModelIndex + 1}`);
    const codec = new Codec("bedrock_block_reference", {
      name: "Bedrock Block Reference",
      extension: "json",
      load_filter: {
        type: "json",
        extensions: ["json"],
        condition: (data: any) => !Blockbench.isWeb && !!data?.["minecraft:block"],
      },
      load: (data, file) => this.loadBlock(data, file),
    });
    this.deleteables.push(action, saveToBlock, codec, select);
  }
}

new BedrockBlockGeometryTweak();
