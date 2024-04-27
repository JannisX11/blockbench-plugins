import { action } from "../../actions.js";
import { worldToScreen } from "../../utils/utils.js";

function runEdit(preview, preserveAspect, amend) {
  const { width, height, camera } = preview;

  Undo.initEdit(
    {
      elements: Mesh.selected,
      selection: true,
      uv_only: true,
      uv_mode: true,
    },
    amend
  );

  const aspect = preserveAspect
    ? height / width
    : Math.max(width, height) / Math.min(width, height);

  Mesh.selected.forEach((mesh) => {
    /* selected faces */
    mesh.getSelectedFaces().forEach((key) => {
      const face = mesh.faces[key];

      face.vertices.forEach((vkey) => {
        const vertex = mesh.mesh.localToWorld(mesh.vertices[vkey].V3_toThree());

        const screenCoordinate = worldToScreen(vertex, camera, width, height);
        face.uv[vkey] = [
          (screenCoordinate.x / width) * Project.texture_width,
          (screenCoordinate.y / height) * Project.texture_height * aspect,
        ];
      });
    });
  });
  Undo.finishEdit("MTools: Unwrap mesh face selection uv from view", {
    uv_only: true,
    uv_mode: true,
  });
  Canvas.updateView({
    elements: Mesh.selected,
    element_aspects: { geometry: true, uv: true, faces: true },
    selection: true,
  });
  updateSelection();
}
export default action("uv_project_view", () => {
  const preview = Canvas.getHoveredPreview();
  runEdit(preview, true, false);

  Undo.amendEdit(
    {
      preserve_aspect: {
        type: "checkbox",
        value: true,
        label: "Preserve Aspect",
      },
    },
    (form) => runEdit(preview, form.preserve_aspect, true)
  );
});
