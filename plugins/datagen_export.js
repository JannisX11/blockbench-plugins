(function () {
  var codec = new Codec("datagen", {
    name: "Datagen",
    remember: true,
    extension: "java",
    compile(options) {
      if (options === undefined) options = {};
      let clear_elements = [];
      let textures_used = [];
      let overflow_cubes = [];

      function computeCube(s) {
        if (s.export == false) return;
        //Create Element
        let text = ".element()";
        let element = {};
        element.from = s.from.slice();
        element.to = s.to.slice();
        if (s.inflate) {
          for (let i = 0; i < 3; i++) {
            element.from[i] -= s.inflate;
            element.to[i] += s.inflate;
          }
        }
        text += `.from(${element.from[0]}F, ${element.from[1]}F, ${element.from[2]}F)`;
        text += `.to(${element.to[0]}F, ${element.to[1]}F, ${element.to[2]}F)`;
        if (s.shade === false) {
          text += `.shade(false)`;
        }

        let nonOrigin = !s.rotation.allEqual(0) || !s.origin.allEqual(8);
        let axis = (nonOrigin ? s.rotationAxis() : s.rotation_axis) || "y";
        text += `.rotation().angle(${
          nonOrigin ? getAxisNumber(axis) : 0
        }F).axis(Axis.${axis.toUpperCase()}).origin(${s.origin[0]}F, ${
          s.origin[1]
        }F, ${s.origin[2]}F)`;
        if (s.rescale) {
          text += `.rescale(true)`;
        }
        text += `.end()`;

        let faces = "";
        for (let face in s.faces) {
          if (s.faces.hasOwnProperty(face)) {
            if (s.faces[face].texture !== null) {
              faces += `.face(Direction.${face.toUpperCase()})`;
              if (s.faces[face].enabled !== false) {
                let temp = {};
                temp.uv = s.faces[face].uv.slice();
                temp.uv.forEach((n, i) => {
                  temp.uv[i] = (n * 16) / main_uv.getResolution(i % 2);
                });
                faces += `.uvs(${temp.uv[0]}F, ${temp.uv[1]}F, ${temp.uv[2]}F, ${temp.uv[3]}F)`;
              }
              if (s.faces[face].rotation) {
                let rotString = "";
                switch (s.faces[face].rotation) {
                  case 0:
                    rotString = "ZERO";
                    break;
                  case 90:
                    rotString = "CLOCKWISE_90";
                    break;
                  case 180:
                    rotString = "UPSIDE_DOWN";
                    break;
                  case 270:
                    rotString = "COUNTERCLOCKWISE_90";
                    break;
                  default:
                    rotString = "ZERO";
                    break;
                }
                faces += `.rotation(FaceRotation.${rotString})`;
              }

              if (s.faces[face].texture) {
                let tex = s.faces[face].getTexture();
                let texOut = "";
                if (tex) {
                  texOut = "#" + tex.id;
                  textures_used.safePush(tex);
                } else {
                  texOut = "#missing";
                }
                faces += `.texture("${texOut}")`;
              }

              if (s.faces[face].cullface) {
                faces += `.cullface(Direction.${s.faces[
                  face
                ].cullface.toUpperCase()})`;
              }
              if (s.faces[face].tint >= 0) {
                faces += `.tintindex(${s.faces[face].tint})`;
              }
              faces += `.end()`;
            }
          }
        }
        text += faces;
        text += `.end()`;

        function inVd(n) {
          return n < -16 || n > 32;
        }
        if (
          inVd(element.from[0]) ||
          inVd(element.from[1]) ||
          inVd(element.from[2]) ||
          inVd(element.to[0]) ||
          inVd(element.to[1]) ||
          inVd(element.to[2])
        ) {
          overflow_cubes.push(s);
        }
        if (Object.keys(s.faces).length) {
          clear_elements.push(text);
        }
      }
      function iterate(arr) {
        let i = 0;
        if (!arr || !arr.length) {
          return;
        }
        for (i = 0; i < arr.length; i++) {
          if (arr[i].type === "cube") {
            computeCube(arr[i]);
          } else if (arr[i].type === "group") {
            iterate(arr[i].children);
          }
        }
      }
      iterate(Outliner.root);

      function checkExport(key, condition) {
        key = options[key];
        if (key === undefined) {
          return condition;
        } else {
          return key;
        }
      }
      let isTexturesOnlyModel =
        clear_elements.length === 0 &&
        checkExport("parent", Project.parent != "");
      let texturesObj = {};
      textures.forEach(function (t, i) {
        let link = t.javaTextureLink();
        if (t.particle) {
          texturesObj.particle = link;
        }
        if (!textures_used.includes(t) && !isTexturesOnlyModel) return;
        if (t.id !== link.replace(/^#/, "")) {
          texturesObj[t.id] = link;
        }
      });

      if (
        options.prevent_dialog !== true &&
        overflow_cubes.length > 0 &&
        settings.dialog_larger_cubes.value
      ) {
        Blockbench.showMessageBox(
          {
            translateKey: "model_clipping",
            icon: "settings_overscan",
            message: tl("message.model_clipping.message", [
              overflow_cubes.length,
            ]),
            buttons: ["dialog.scale.select_overflow", "dialog.ok"],
            confirm: 1,
            cancel: 1,
          },
          (result) => {
            if (result == 0) {
              selected.splice(0, Infinity, ...overflow_cubes);
              updateSelection();
            }
          }
        );
      }
      if (
        options.prevent_dialog !== true &&
        clear_elements.length &&
        ["item/generated", "item/handheld"].includes(Project.parent)
      ) {
        Blockbench.showMessageBox({
          translateKey: "invalid_builtin_parent",
          icon: "info",
          message: tl("message.invalid_builtin_parent.message", [
            Project.parent,
          ]),
        });
        Project.parent = "";
      }

      let text = `this.models()`;
      if (checkExport("parent", Project.parent != "")) {
        text += `.withExistingParent("blockbench_export", "${Project.parent.replace(
          " ",
          ""
        )}")`;
      } else {
        text += `.getBuilder("blockbench_export")`;
      }
      if (checkExport("ambientocclusion", Project.ambientocclusion === false)) {
        text += ".ao(false)";
      }
      if (checkExport("textures", Object.keys(texturesObj).length >= 1)) {
        for (let texture of Object.keys(texturesObj)) {
          text += `.texture("${texture}", new ResourceLocation("${texturesObj[texture]}"))`;
        }
      }
      if (checkExport("elements", clear_elements.length >= 1)) {
        for (let element of clear_elements) {
          text += element;
        }
      }
      if (checkExport("front_gui_light", Project.front_gui_light)) {
        text += ".guiLight(GuiLight.FRONT)";
      }
      if (checkExport("display", Object.keys(display).length >= 1)) {
        let new_display = {};
        let entries = 0;
        for (let i in DisplayMode.slots) {
          let key = DisplayMode.slots[i];
          if (
            DisplayMode.slots.hasOwnProperty(i) &&
            display[key] &&
            display[key].export
          ) {
            new_display[key] = display[key].export();
            entries++;
          }
        }
        if (entries) {
          for (let key of Object.keys(new_display)) {
            let val = new_display[key];
            text += `.transform(Perspective.${key
              .toUpperCase()
              .replace(/PERSON/g, "_PERSON")
              .replace(/HAND/g, "_HAND")})`;
            if (val.rotation) {
              text += `.rotation(${val.rotation[0]}F, ${val.rotation[1]}F, ${val.rotation[2]}F)`;
            }
            if (val.translation) {
              text += `.translation(${val.translation[0]}F, ${val.translation[1]}F, ${val.translation[2]}F)`;
            }
            if (val.scale) {
              text += `.scale(${val.scale[0]}F, ${val.scale[1]}F, ${val.scale[2]}F)`;
            }
            text += `.end()`;
          }
        }
      }
      this.dispatchEvent("compile", { model: text, options });
      return text;
    },
  });
  Plugin.register("datagen_export", {
    title: "Datagen Exporter",
    icon: "code",
    author: "itsmeow",
    description: "Allows exporting to BlockStateProvider datagen code",
    version: "1.0.0",
    variant: "both",
    onload() {
      let action = new Action({
        id: "export_datagen",
        name: "Export Datagen Code",
        icon: "code",
        description: "Exports a model to BlockStateProvider datagen code.",
        category: "file",
        condition: (_) => Format.id === "java_block",
        click: () => {
          codec.export();
        },
      });
      MenuBar.addAction(action, "file.export");
    },
    onunload() {
      action.delete();
    },
  });
})();
