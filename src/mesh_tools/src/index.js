import "./tools/index.js";
import "./operators/index.js";
import "./generators/index.js";
import { ACTIONS, qualifyName } from "./actions.js";
import { createTextMesh, vertexNormal } from "./utils/utils.js";
import { PLUGIN_ID, storage } from "./globals.js";

const deletables = [];
/**
 * @type {Array<THREE.Object3D>}
 */
const meshToolTips = [];
BBPlugin.register(PLUGIN_ID, {
  new_repository_format: true,
  title: "MTools",
  author: "Malik12tree",
  icon: "icon.png",
  description: "Adds powerful mesh modeling tools, operators and generators!",
  version: "2.0.2",
  min_version: "4.9.4",
  variant: "both",
  creation_date: "2022-04-09",
  has_changelog: true,
  tags: ["Format: Generic Model", "Mesh", "Tool"],
  onload() {
    function debug(element) {
      for (const object of meshToolTips) {
        scene.remove(object);
      }

      for (const faceKey in element.faces) {
        const face = element.faces[faceKey];
        const center = face.getCenter().V3_toThree();
        element.mesh.localToWorld(center);

        const normal = face.getNormal(true).V3_toThree();

        const mesh = createTextMesh(faceKey, {
          fillStyle: "blue",
          fontSize: 25,
        });
        meshToolTips.push(mesh);

        mesh.position.copy(center);
        if (normal) {
          mesh.position.add(normal.multiplyScalar(0.5));
        }

        scene.add(mesh);
      }
      for (const vertexKey in element.vertices) {
        const vertex = element.vertices[vertexKey].V3_toThree();
        element.mesh.localToWorld(vertex);

        const normal =
          vertexNormal(element, vertexKey) ?? new THREE.Vector3(0, 1, 0);

        const mesh = createTextMesh(vertexKey, {
          fillStyle: "red",
          fontSize: 25,
        });
        meshToolTips.push(mesh);

        mesh.position.copy(vertex);

        if (normal) {
          mesh.position.add(normal.multiplyScalar(0.25));
        }

        scene.add(mesh);
      }
    }

    // TODO move to separate plugin
    const isDebug = false && this.source == "file";
    if (isDebug) {
      deletables.push(
        Mesh.prototype.preview_controller.on("update_geometry", ({ element }) =>
          debug(element)
        )
      );
      for (const mesh of Mesh.all) {
        debug(mesh);
      }
    }

    Mesh.prototype.menu.structure.unshift(qualifyName("tools"));
    Mesh.prototype.menu.structure.unshift(qualifyName("operators"));
    MenuBar.addAction(qualifyName("generators"), "filter");
  },
  onuninstall() {
    storage.clear();
  },
  onunload() {
    for (const deletable of deletables) {
      deletable.delete();
    }
    for (const object of meshToolTips) {
      scene.remove(object);
    }

    for (const actionId in ACTIONS) {
      const id = qualifyName(actionId);
      BarItems[id]?.delete();
    }
  },
});
