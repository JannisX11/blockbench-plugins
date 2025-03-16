import {
  ADDITION,
  Brush,
  DIFFERENCE,
  Evaluator,
  INTERSECTION,
  REVERSE_SUBTRACTION,
  SUBTRACTION,
} from "three-bvh-csg";
import { action } from "../actions.js";
import { throwQuickMessage } from "../utils/info.js";
import * as ThreeJSInteroperability from "../utils/threejs_interoperability.js";

export const operations = {
  addition: {
    name: "Union (A ∪ B)",
    operator: ADDITION,
  },
  intersection: {
    name: "Intersection (A ∩ B)",
    operator: SUBTRACTION,
  },
  subtraction: {
    name: "Subtraction (A - B)",
    operator: REVERSE_SUBTRACTION,
  },
  reverse_subtraction: {
    name: "Reverse Subtraction (B - A)",
    operator: INTERSECTION,
  },
  difference: {
    name: "Difference (A ⊕ B)",
    operator: DIFFERENCE,
  },

  hollow_intersection: {
    name: "Hollow Intersection (A ∩ B)",
    // Types are not exported through the library for some reason
    operator: 5,
  },
  hollow_subtraction: {
    name: "Hollow Subtraction (A - B)",
    // Types are not exported through the library for some reason
    operator: 6,
  },
};

const evaluator = new Evaluator();
function runEdit(
  meshes: Mesh[],
  amend: boolean,
  {
    operation,
    hideMeshes,
  }: { operation: keyof typeof operations; hideMeshes: boolean }
) {
  if (meshes.length !== 2) {
    throwQuickMessage("Exactly 2 meshes must be selected.");
  }
  const [meshA, meshB] = meshes;
  const elements = [meshA, meshB];
  Undo.initEdit({ elements, selection: true }, amend);

  // if (implementation == "CSG") {
  //   const newMesh = CSG[operation](
  //     // @ts-ignore
  //     meshA.mesh as unknown as THREE.Mesh,
  //     meshB.mesh as unknown as THREE.Mesh
  //   );
  // }

  const brush1 = new Brush(
    // @ts-ignore
    meshA.mesh.geometry.clone()
  );
  meshA.mesh.getWorldPosition(brush1.position);
  meshA.mesh.getWorldQuaternion(brush1.quaternion);
  meshA.mesh.getWorldScale(brush1.scale);
  brush1.updateMatrixWorld();

  const brush2 = new Brush(
    // @ts-ignore
    meshB.mesh.geometry.clone()
  );
  meshB.mesh.getWorldPosition(brush2.position);
  meshB.mesh.getWorldQuaternion(brush2.quaternion);
  meshB.mesh.getWorldScale(brush2.scale);
  brush2.updateMatrixWorld();

  const result = evaluator.evaluate(
    brush1,
    brush2,
    operations[operation].operator
  );

  const mesh = ThreeJSInteroperability.nonIndexed(result.geometry);
  mesh.init();
  elements.push(mesh);
  mesh.select();
  if (hideMeshes) {
    meshA.visibility = false;
    meshB.visibility = false;
  }

  Undo.finishEdit(`MTools: Boolean Operation: ${operations[operation].name}`);
  Canvas.updateVisibility();
}

export default action("boolean", () => {
  const meshes = Mesh.selected.slice();

  runEdit(meshes, false, { operation: "addition", hideMeshes: true });
  Undo.amendEdit(
    {
      operation: {
        label: "Operation",
        type: "select",
        options: operations,
        value: "addition",
      },
      hideMeshes: {
        label: "Hide Meshes",
        type: "checkbox",
        value: true,
      },
    },
    (form) => {
      runEdit(meshes, true, form);
    }
  );
});
