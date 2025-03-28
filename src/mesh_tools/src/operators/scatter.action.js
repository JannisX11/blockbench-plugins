import { action } from "../actions.js";
import { renderLine } from "../utils/docs.js";
import { dontShowAgainInfo } from "../utils/info.js";
import {
  computeTriangleNormal,
  rotationFromDirection,
} from "../utils/utils.js";

const reusableEuler1 = new THREE.Euler();
const reusableVec1 = new THREE.Vector3();
const reusableVec2 = new THREE.Vector3();
const reusableVec3 = new THREE.Vector3();
const reusableVec4 = new THREE.Vector3();
const reusableVec5 = new THREE.Vector3();
// const reusableVec6 = new THREE.Vector3();
function runEdit(
  mesh,
  selected,
  {
    density = 3,
    min_distance: minDistance = 0,
    scale = 100,
    min_scale: minScale = 100,
    scale_factor: scaleFactor = 50,
    rotation = 0,
    rotation_factor: rotationFactor = 0,
  },
  amend = false
) {
  const meshes = [];
  scale /= 100;
  minScale /= 100;
  scaleFactor /= 100;
  rotationFactor /= 100;
  const minDistanceSquared = minDistance ** 2;

  Undo.initEdit({ outliner: true, elements: [], selection: true }, amend);

  /**
   * @type {THREE.Mesh}
   */
  const tmesh = mesh.mesh; // threejs mesh

  const faces = tmesh.geometry.getIndex();
  const vertices = tmesh.geometry.getAttribute("position");
  const l = faces.count;

  const points = [];
  for (let d = 0; d < density; d++) {
    const i = Math.floor((Math.random() * l) / 3) * 3; // random face index
    const t0 = reusableVec1.set(
      vertices.getX(faces.getX(i)),
      vertices.getY(faces.getX(i)),
      vertices.getZ(faces.getX(i))
    );
    const t1 = reusableVec2.set(
      vertices.getX(faces.getY(i)),
      vertices.getY(faces.getY(i)),
      vertices.getZ(faces.getY(i))
    );
    const t2 = reusableVec3.set(
      vertices.getX(faces.getZ(i)),
      vertices.getY(faces.getZ(i)),
      vertices.getZ(faces.getZ(i))
    );

    tmesh.localToWorld(t0);
    tmesh.localToWorld(t1);
    tmesh.localToWorld(t2);

    // f*ed up midpoint theroem
    const pointA = reusableVec4.lerpVectors(t0, t1, Math.random());
    const pointB = reusableVec5.lerpVectors(t0, t2, Math.random());

    const point = new THREE.Vector3().lerpVectors(
      pointA,
      pointB,
      Math.random()
    );
    if (points.find((e) => e.distanceToSquared(point) < minDistanceSquared)) {
      continue;
    }
    points.push(point);
    // scatter on points
    /**
     * @type {Mesh}
     */
    const otherMesh =
      selected[Math.floor(selected.length * Math.random())].duplicate();

    otherMesh.removeFromParent();
    otherMesh.parent = "root";

    const currentScale = Math.lerp(
      scale,
      Math.lerp(minScale, 1, Math.random()) * scale,
      scaleFactor
    );

    const currentRotation = rotationFactor * (Math.random() * 2 - 1) * rotation;

    for (const key in otherMesh.vertices) {
      otherMesh.vertices[key].V3_multiply(currentScale);
    }

    const normal = computeTriangleNormal(t0, t1, t2);

    const euler = rotationFromDirection(normal, reusableEuler1, {
      rotateY: Math.degToRad(currentRotation),
    });
    otherMesh.rotation[0] = Math.radToDeg(euler.x);
    otherMesh.rotation[1] = Math.radToDeg(euler.y);
    otherMesh.rotation[2] = Math.radToDeg(euler.z);

    otherMesh.origin = point.toArray();

    meshes.push(otherMesh);
  }
  const group = new Group({ name: "instances_on_" + mesh.name });
  meshes.forEach((e) => {
    // Outliner.root.push(otherMesh);
    e.addTo(group);
  });
  group.init();

  Undo.finishEdit("MTools: Scatter meshes", {
    outliner: true,
    elements: meshes,
    selection: true,
  });
  Canvas.updateAll();
}
export default action("scatter", function () {
  if (Mesh.selected.length < 2) {
    Blockbench.showQuickMessage("At least two meshes must be selected");
    return;
  }
  dontShowAgainInfo(
    "scatter_pivot",
    "Good To Know",
    [
      "Scattered meshes are <b>relative</b> to their <u>pivot points</u> on the target surface.",

      renderLine({
        type: "inset_row",
        items: [
          {
            type: "image",
            src: "scatter_pivot_1.png",
            caption: "Pivot point located on the bottom",
          },
          {
            type: "image",
            src: "scatter_pivot_2.png",
            caption: "Pivot point located far down",
          },
        ],
      }),
    ].join("\n")
  );

  const mesh = Mesh.selected.last();
  mesh.unselect();

  const selected = Mesh.selected.slice();
  runEdit(mesh, selected, {});

  Undo.amendEdit(
    {
      density: {
        type: "number",
        value: 3,
        label: "Max Density",
        min: 0,
        max: 256,
      },
      min_distance: {
        type: "number",
        value: 0,
        label: "Min Distance",
        min: 0,
      },
      scale: {
        type: "range",
        value: 100,
        label: "Scale",
        min: 0,
        max: 100,
      },
      min_scale: {
        type: "range",
        value: 100,
        label: "Min Scale",
        min: 0,
        max: 100,
      },
      scale_factor: {
        type: "range",
        value: 50,
        label: "Scale Randomness",
        min: 0,
        max: 100,
      },

      rotation: {
        type: "range",
        value: 0,
        label: "Max Rotation",
        min: 0,
        max: 180,
      },
      rotation_factor: {
        type: "range",
        value: 0,
        label: "Rotation Randomness",
        min: 0,
        max: 100,
      },
    },
    (form) => {
      runEdit(mesh, selected, form, true);
    }
  );
});
