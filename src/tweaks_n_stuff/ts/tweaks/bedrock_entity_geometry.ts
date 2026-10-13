import { ToggleTweak } from "./base";

class BedrockEntityGeometryTweak extends ToggleTweak {
  private sources = new WeakMap<ModelProject, { path: string; identifier: string }>();

  constructor() {
    super("bedrock_entity_geometry", { author: "legopitstop", category: "interface" });
  }

  private loadEntity(data: any, file: { path: string; name: string }): void {
    try {
      const entity = data?.["minecraft:entity"];
      if (!entity) throw new Error("This is not a Bedrock behavior pack entity file.");
      const fs = require("fs") as typeof import("fs");
      const path = require("path") as typeof import("path");
      let directory = path.dirname(file.path);
      while (path.basename(directory).toLowerCase() !== "entities") {
        const parent = path.dirname(directory);
        if (parent === directory) throw new Error("The entity file is not inside an entities folder.");
        directory = parent;
      }
      const pack = path.dirname(directory);
      const packName = path.basename(pack);
      const parent = path.dirname(pack);
      const roots = [
        path.join(parent, "resource_packs", packName),
        path.join(path.dirname(parent), "resource_packs", packName),
        path.join(parent, "resource", packName),
      ].filter((root) => fs.existsSync(root));
      const identifier = entity.description?.identifier;
      const clientGeometries = new Set<string>();
      const visit = (root: string, callback: (filename: string) => void) => {
        if (!fs.existsSync(root)) return;
        for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
          const filename = path.join(root, entry.name);
          if (entry.isDirectory()) visit(filename, callback);
          else if (entry.isFile() && entry.name.toLowerCase().endsWith(".json")) callback(filename);
        }
      };
      for (const root of roots)
        visit(path.join(root, "entity"), (filename) => {
          try {
            const client = JSON.parse(fs.readFileSync(filename, "utf8"))?.["minecraft:client_entity"];
            if (client?.description?.identifier !== identifier) return;
            for (const value of Object.values(client.description.geometry ?? {})) {
              if (typeof value === "string") clientGeometries.add(value);
            }
          } catch {
            /* Ignore unrelated files. */
          }
        });
      let match: { path: string; content: any; geometry: any } | undefined;
      for (const root of roots)
        visit(path.join(root, "models"), (filename) => {
          if (match) return;
          try {
            const content = JSON.parse(fs.readFileSync(filename, "utf8"));
            for (const geometry of content?.["minecraft:geometry"] ?? []) {
              const id = geometry?.description?.identifier;
              if (clientGeometries.has(id)) {
                match = { path: filename, content, geometry };
                break;
              }
            }
          } catch {
            /* Ignore unrelated model files. */
          }
        });
      if (match) {
        const found = match as { path: string; content: any; geometry: any };
        Codecs.bedrock.load(
          { format_version: found.content.format_version, "minecraft:geometry": [found.geometry] },
          {
            name: path.basename(found.path),
            path: found.path,
          },
        );
      } else {
        newProject("bedrock");
        Project.name = path.basename(file.path, ".json");
        Project.model_identifier = identifier ?? Project.name;
      }
      if (Project) this.sources.set(Project, { path: file.path, identifier });
      const boxes = entity.components?.["minecraft:custom_hit_test"]?.hitboxes;
      if (!Array.isArray(boxes)) return;
      for (const [index, box] of boxes.entries()) {
        const { width, height, pivot } = box ?? {};
        if (
          ![width, height, ...(pivot ?? [])].every((value) => typeof value === "number" && Number.isFinite(value)) ||
          !Array.isArray(pivot) ||
          pivot.length !== 3 ||
          width < 0 ||
          height < 0
        )
          continue;
        const half = width * 8;
        const center = pivot.map((value: number) => value * 16);
        new BoundingBox({
          name: boxes.length === 1 ? "custom_hit_test" : `custom_hit_test ${index + 1}`,
          from: [center[0] - half, center[1] - height * 8, center[2] - half],
          to: [center[0] + half, center[1] + height * 8, center[2] + half],
          function: ["hitbox"],
          color: 0,
        })
          .addTo()
          .init();
      }
    } catch (error) {
      Blockbench.showMessageBox({ title: "Open Bedrock Entity Geometry", message: String(error) });
    }
  }

  private saveHitboxes(project: ModelProject): void {
    const source = this.sources.get(project);
    if (!source) return;
    try {
      const fs = require("fs") as typeof import("fs");
      const original = fs.readFileSync(source.path, "utf8");
      const data = JSON.parse(original);
      const entity = data?.["minecraft:entity"];
      if (entity?.description?.identifier !== source.identifier) {
        throw new Error("The entity identifier has changed. Reopen the entity before saving hitboxes.");
      }
      const components = entity.components ?? (entity.components = {});
      const hitTest = components["minecraft:custom_hit_test"];
      const boxes = (BoundingBox.all as BoundingBox[]).filter(
        (box) => box.export !== false && /^custom_hit_test(?: \d+)?$/.test(box.name),
      );
      if (!hitTest && !boxes.length) return;
      const previous = Array.isArray(hitTest?.hitboxes) ? hitTest.hitboxes : [];
      const hitboxes = boxes.map((box, index) => ({
        ...(previous[index] ?? {}),
        width: (box.to[0] - box.from[0]) / 16,
        height: (box.to[1] - box.from[1]) / 16,
        pivot: [0, 1, 2].map((axis) => (box.from[axis] + box.to[axis]) / 32),
      }));
      if (hitTest) hitTest.hitboxes = hitboxes;
      else components["minecraft:custom_hit_test"] = { hitboxes };
      if (JSON.stringify(data) === JSON.stringify(JSON.parse(original))) return;
      const indent = /\n(\s+)"/.exec(original)?.[1] ?? "  ";
      fs.writeFileSync(source.path, JSON.stringify(data, null, indent) + "\n", "utf8");
    } catch (error) {
      Blockbench.showMessageBox({ title: "Save Bedrock Entity Hitboxes", message: String(error) });
    }
  }

  onEnable(): void {
    const action = new Action("open_bedrock_entity_geometry", {
      name: "Open Bedrock Entity Geometry",
      description: "Open the geometry and custom hit test from a behavior pack entity file",
      icon: "view_in_ar",
      condition: () => !Blockbench.isWeb,
      click: () =>
        Blockbench.import(
          { type: "Bedrock Entity", extensions: ["json"], readtype: "text", multiple: false },
          (files) => {
            const file = files[0];
            if (file?.path && typeof file.content === "string") this.loadEntity(JSON.parse(file.content), file);
          },
        ),
    });
    MenuBar.addAction(action, "file.import");
    const saveToEntity = new Action("save_bedrock_entity_hit_test", {
      name: "Save to Entity",
      description: "Save custom hit test boxes to the source behavior pack entity file",
      icon: "save",
      condition: () => !!Project && this.sources.has(Project),
      click: () => {
        if (Project) this.saveHitboxes(Project);
      },
    });
    const fileItems = MenuBar.menus.file.structure;
    const saveModelIndex = fileItems.findIndex(
      (item) =>
        item === "save_model" ||
        (typeof item === "object" && item !== null && "id" in item && item.id === "save_model"),
    );
    MenuBar.addAction(saveToEntity, saveModelIndex < 0 ? "file" : `file.${saveModelIndex + 1}`);
    const codec = new Codec("bedrock_entity_geometry_reference", {
      name: "Bedrock Entity Geometry Reference",
      extension: "json",
      load_filter: {
        type: "json",
        extensions: ["json"],
        condition: (data: any) => !Blockbench.isWeb && !!data?.["minecraft:entity"],
      },
      load: (data, file) => this.loadEntity(data, file),
    });
    this.deleteables.push(action, saveToEntity, codec);
  }
}

new BedrockEntityGeometryTweak();
