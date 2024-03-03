import { action } from "../actions.js";
import { TerrainGen } from "../utils/terrain_gen.js";
import { parseRGB, easeInOutSine } from "../utils/utils.js";
import { perlin } from "../utils/perlin.js";

new TerrainGen({
  name: "Open Terrain",
  settings: {
    time: { label: "Time", type: "number", min: 0, value: 0, step: 1 },
    scale: { label: "Scale", type: "number", min: 0, value: 25 },
    octaves: { label: "Octaves", type: "number", min: 0, value: 2 },
    persistance: {
      label: "Persistancy",
      type: "number",
      min: 0,
      max: 1,
      step: 0.1,
      value: 0.4,
    },
    lacunarity: { label: "lacunarity", type: "number", min: 0, value: 3 },
    min: {
      label: "Min Level",
      type: "number",
      min: 0,
      max: 0.9,
      step: 0.1,
      value: 0.1,
    },
  },
  noise(s, addOn) {
    if (s.scale <= 0) s.scale = 1e-6;
    const z = s.time + TerrainGen.timeWhenDialogWasOpened;
    const map = {};

    for (let y = s.height - 1; y >= 0; y--) {
      for (let x = s.width - 1; x >= 0; x--) {
        const G = Math.pow(2.0, -s.persistance);
        let amplitude = 1;
        let frequency = 1;
        let noiseHeight = 0;
        let normalization = 0;

        for (let i = 0; i < s.octaves; i++) {
          const sampX = (x / s.scale) * frequency;
          const sampY = (y / s.scale) * frequency;
          const val = perlin.get(sampX, sampY, (z / s.scale) * frequency) + 0.4;

          noiseHeight += val * amplitude;
          normalization += amplitude;

          amplitude *= G;
          frequency *= s.lacunarity;
        }
        noiseHeight /= normalization;

        // custom functions
        if (addOn) {
          noiseHeight = addOn(noiseHeight, x, y);
        }

        // falloff
        if (s.falloff) {
          const falloff = falloffMap(x, y, s.width, s.height);
          noiseHeight = Math.clamp(noiseHeight - falloff, 0, 1);
        }

        // min/max level
        if (s.min || s.max) {
          const min = s.min ?? 0;
          const max = s.max ?? 1;

          noiseHeight = Math.clamp(
            THREE.MathUtils.mapLinear(
              easeInOutSine(noiseHeight),
              min,
              max,
              0,
              1
            ),
            0,
            1
          );
        }

        map[x + "," + y] = noiseHeight;
      }
    }
    return map;
  },
});
new TerrainGen({
  name: "Valley",
  settings: {
    time: { label: "Time", type: "number", min: 0, value: 0, step: 1 },
    scale: { label: "Scale", type: "number", min: 0, value: 25 },
    octaves: { label: "Octaves", type: "number", min: 0, value: 2 },
    persistance: {
      label: "Persistancy",
      type: "number",
      min: 0,
      max: 1,
      step: 0.1,
      value: 0.4,
    },
    lacunarity: { label: "lacunarity", type: "number", min: 0, value: 3 },
  },
  suggested: {
    style: "EarthMountains",
  },
  noise: function (s) {
    s.min = 0.7;
    const noise = TerrainGen.all[0].noise(s, (v) => 1 - Math.abs(v * 2 - 1));
    return noise;
  },
});
new TerrainGen({
  name: "Mesa",
  settings: {
    time: { label: "Time", type: "number", min: 0, value: 0, step: 1 },
    scale: { label: "Scale", type: "number", min: 0, value: 25 },
    octaves: { label: "Octaves", type: "number", min: 0, value: 2 },
    persistance: {
      label: "Persistancy",
      type: "number",
      min: 0,
      max: 1,
      step: 0.1,
      value: 0.4,
    },
    lacunarity: { label: "lacunarity", type: "number", min: 0, value: 3 },
  },
  suggested: {
    falloff: true,
    style: "Desert",
  },
  noise: function (s) {
    s.max = 0.7;
    s.min = 0;
    const noise = TerrainGen.all[0].noise(s);
    return noise;
  },
});
new TerrainGen({
  name: "River",
  settings: {
    time: { label: "Time", type: "number", min: 0, value: 0, step: 1 },
    scale: { label: "Scale", type: "number", min: 0, value: 25 },
    octaves: { label: "Octaves", type: "number", min: 0, value: 2 },
    persistance: {
      label: "Persistancy",
      type: "number",
      min: 0,
      max: 1,
      step: 0.1,
      value: 0.4,
    },
    lacunarity: { label: "lacunarity", type: "number", min: 0, value: 3 },
    turbpower: {
      label: "Turb-Power",
      type: "number",
      min: 0,
      value: 1.3,
      step: 0.1,
    },
  },
  suggested: {
    style: "Ice",
    multiplier: 3,
    lacunarity: 2,
    octaves: 4,
  },
  noise: function (s) {
    const noise = TerrainGen.all[0].noise(s, function (val, x, y) {
      const xyValue = x / s.width + y / s.height + s.turbpower * val;
      const sineValue = Math.abs(Math.cos(xyValue * Math.PI));
      return sineValue;
    });

    return noise;
  },
});

const styleOptions = {};
for (const key in TerrainGen.styles) styleOptions[key] = key;
const settingsCombined = {};
const form = {
  style: { label: "Style", type: "select", options: styleOptions },
  terrain: { label: "Terrain Type", type: "select" },
  width: {
    label: "Width",
    type: "number",
    value: 32,
    min: 1,
    max: 255,
  },
  height: {
    label: "Length",
    type: "number",
    value: 32,
    min: 1,
    max: 255,
  },
  suggested: {
    label: "Update Suggested Settings",
    type: "checkbox",
    value: true,
  },
  _: "_",
  multiplier: {
    label: "Height Multiplier",
    type: "number",
    value: 5,
    max: Infinity,
  },
  falloff: { label: "FallOff Map", type: "checkbox", value: false },
  __: "_",
};
styleOptions.custom = "Custom";
const options = {};
for (let i = 0; i < TerrainGen.all.length; i++) {
  const { codeName, name, settings } = TerrainGen.all[i];
  options[codeName] = name;

  for (const key in settings) {
    const currentSettingValue = settings[key];

    if (key in settingsCombined) {
      settingsCombined[key].push(codeName);
    } else {
      settingsCombined[key] = [codeName];
    }

    currentSettingValue.condition = ({ terrain } = {}) =>
      settingsCombined[key].includes(terrain);
    form[key] = currentSettingValue;
  }
}
form.terrain.options = options;

export default action("terrain_action", () => {
  let typeBeforeUpdate;
  TerrainGen.timeWhenDialogWasOpened = Date.now();
  new Dialog({
    title: "Terrain Settings",
    id: "terrain_settings",
    form,
    /** @param {any} _out  */
    onConfirm(_out) {
      let style = TerrainGen.styles[_out.style];

      if (_out.style == "custom") {
        const customStyleString = localStorage.mt_customStyle;
        if (!customStyleString)
          Blockbench.showQuickMessage(
            "No Custom Style found, 'Earth' is used instead.",
            2000
          );

        const customStyle = JSON.parse(customStyleString);
        customStyle.forEach((h) => (h.color = parseRGB(h.col)));
        style = customStyle;
      }
      let terrain = TerrainGen.all.find((e) => e.codeName == _out.terrain);

      function runEdit(out, amended) {
        const { width, height } = out;
        out.falloff = _out.falloff;

        const elements = [];
        const textures = [];
        Undo.initEdit({ elements, textures, selection: true }, amended);

        const map = terrain.noise(out);
        const topLeftX = 0.5 - width / 2;
        const topLeftY = 0.5 - height / 2;

        const mesh = new Mesh({ vertices: {} });
        const texture = TerrainGen.genTexture(
          width,
          height,
          map,
          style,
          out.blending
        );

        const addedVertices = [];
        let vertexIndex = 0;
        for (let j = height - 1; j >= 0; j--) {
          for (let i = width - 1; i >= 0; i--) {
            let x = i + topLeftX;
            let y = j + topLeftY;
            let z = map[[i, j]] * out.multiplier + 1;

            let vertex = [x, z, y];
            addedVertices[vertexIndex] = mesh.addVertices(vertex)[0];
            vertexIndex++;
          }
        }
        vertexIndex = 0;
        for (let y = height - 1; y >= 0; y--) {
          for (let x = width - 1; x >= 0; x--) {
            if (x > 0 && y > 0) {
              let indices = [
                vertexIndex,
                vertexIndex + 1,
                vertexIndex + width + 1,
                vertexIndex + width,
              ];

              const uv = {};
              uv[addedVertices[indices[0]]] = [
                ((x - 1) / width) * Project._texture_width,
                ((y - 1) / height) * Project._texture_height,
              ];
              uv[addedVertices[indices[1]]] = [
                (x / width) * Project._texture_width,
                ((y - 1) / height) * Project._texture_height,
              ];
              uv[addedVertices[indices[2]]] = [
                (x / width) * Project._texture_width,
                (y / height) * Project._texture_height,
              ];
              uv[addedVertices[indices[3]]] = [
                ((x - 1) / width) * Project._texture_width,
                (y / height) * Project._texture_height,
              ];

              const face = new MeshFace(mesh, {
                vertices: [
                  addedVertices[indices[3]],
                  addedVertices[indices[2]],
                  addedVertices[indices[1]],
                  addedVertices[indices[0]],
                ],
                uv,
                texture: texture.uuid,
              });
              const key = mesh.addFaces(face);

              // procces were we want to remove distorted faces that get distorted from sorting problems
              // a quick fix is to triangulate the face
              const sortedVertices = face.getSortedVertices();
              for (let i = 0; i < 4; i++) {
                const vertexA = mesh.vertices[sortedVertices[i]];
                const vertexB = mesh.vertices[sortedVertices[(i + 1) % 4]];

                const dirToB = [
                  vertexB[0] - vertexA[0],
                  vertexB[2] - vertexA[2],
                ];

                const daigonalCheck =
                  (dirToB[0] && dirToB[1] == 0) ||
                  (dirToB[1] && dirToB[0] == 0);
                if (daigonalCheck) continue;

                delete mesh.faces[key];

                const face1 = new MeshFace(mesh, {
                  vertices: [
                    addedVertices[indices[3]],
                    addedVertices[indices[2]],
                    addedVertices[indices[0]],
                  ],
                  uv,
                  texture: texture.uuid,
                });
                const face2 = new MeshFace(mesh, {
                  vertices: [
                    addedVertices[indices[1]],
                    addedVertices[indices[0]],
                    addedVertices[indices[2]],
                  ],
                  uv,
                  texture: texture.uuid,
                });
                mesh.addFaces(face1);
                mesh.addFaces(face2);

                break;
              }
            }
            vertexIndex++;
          }
        }
        mesh.init();

        elements.push(mesh);
        mesh.select();
        textures.push(texture);
        Undo.finishEdit("MTools: Generate Terrain Mesh");
      }
      runEdit(_out, false);
      const amendForm = {};

      amendForm.width = form.width;
      amendForm.height = form.height;
      amendForm.multiplier = form.multiplier;
      for (const key in terrain.settings) {
        const c = {};
        for (const skey in terrain.settings[key]) {
          if (skey == "value") {
            c[skey] = _out[key];
          } else if (skey != "condition") {
            c[skey] = terrain.settings[key][skey];
          }
        }
        amendForm[key] = c;
      }

      Undo.amendEdit(amendForm, (form) => {
        runEdit(form, true);
      });
    },
    onFormChange(data) {
      if (!data.suggested) return;
      if (data.terrain == typeBeforeUpdate) return; // stop call stack

      const selected = TerrainGen.all.find((e) => e.codeName == data.terrain);
      typeBeforeUpdate = data.terrain;

      this.setFormValues(selected.suggested);
    },
  }).show();
});
