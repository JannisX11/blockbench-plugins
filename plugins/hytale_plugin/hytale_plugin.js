(() => {
  // src/cleanup.ts
  var list = [];
  function track(...items) {
    list.push(...items);
  }
  function cleanup() {
    for (let deletable of list) {
      try {
        deletable.delete();
      } catch (error) {
        console.error(error);
      }
    }
    list.empty();
  }

  // src/config.ts
  var Config = {
    json_compile_options: {
      indentation: "  ",
      final_newline: false
    }
  };

  // src/util.ts
  function qualifiesAsMainShape(object) {
    return object instanceof Cube && object.rotation.allEqual(0);
  }
  function cubeIsQuad(cube) {
    if (!cube.size().some((val) => val == 0)) return false;
    let faces = Object.keys(cube.faces).filter((fkey) => cube.faces[fkey].texture !== null);
    if (faces.length > 1) return false;
    return true;
  }
  function getMainShape(group) {
    return group.children.find(qualifiesAsMainShape);
  }

  // src/blockymodel.ts
  function discoverTexturePaths(dirname, modelName) {
    let fs = requireNativeModule("fs");
    let paths = [];
    let dirFiles = fs.readdirSync(dirname);
    for (let fileName of dirFiles) {
      if (fileName.match(/\.png$/i) && (fileName.startsWith(modelName) || fileName == "Texture.png")) {
        paths.push(PathModule.join(dirname, fileName));
      }
    }
    let texturesFolderPath = PathModule.join(dirname, `${modelName}_Textures`);
    if (fs.existsSync(texturesFolderPath) && fs.statSync(texturesFolderPath).isDirectory()) {
      let folderFiles = fs.readdirSync(texturesFolderPath);
      for (let fileName of folderFiles) {
        if (fileName.match(/\.png$/i)) {
          paths.push(PathModule.join(texturesFolderPath, fileName));
        }
      }
    }
    return [...new Set(paths)];
  }
  function loadTexturesFromPaths(paths, preferredName) {
    const textures = [];
    for (let texturePath of paths) {
      let texture = Texture.all.find((t) => t.path == texturePath);
      if (!texture) {
        texture = new Texture().fromPath(texturePath).add(false, true);
      }
      textures.push(texture);
    }
    if (textures.length > 0) {
      let primary = preferredName && textures.find((t) => t.name.startsWith(preferredName)) || textures[0];
      if (!Texture.all.find((t) => t.use_as_default)) {
        primary.use_as_default = true;
      }
    }
    return textures;
  }
  function promptForTextures(dirname) {
    Blockbench.showMessageBox({
      title: "Import Textures",
      message: "No textures were found for this model. How would you like to import textures?",
      buttons: ["Select Files", "Select Folder", "Skip"]
    }, (choice) => {
      let project = Project;
      if (choice === 2 || !project) return;
      if (choice === 0) {
        Blockbench.import({
          resource_id: "texture",
          extensions: ["png"],
          type: "PNG Textures",
          multiple: true,
          readtype: "image",
          startpath: dirname
        }, (files) => {
          if (Project !== project || files.length === 0) return;
          let paths = files.map((f) => f.path).filter((p) => !!p);
          loadTexturesFromPaths(paths);
        });
      } else if (choice === 1) {
        let folderPath = Blockbench.pickDirectory({
          title: "Select Texture Folder",
          startpath: dirname,
          resource_id: "texture"
        });
        if (folderPath && Project === project) {
          let fs = requireNativeModule("fs");
          let files = fs.readdirSync(folderPath);
          let pngFiles = files.filter((f) => f.match(/\.png$/i));
          if (pngFiles.length === 0) {
            Blockbench.showQuickMessage("No PNG files found in selected folder");
            return;
          }
          let paths = pngFiles.map((f) => PathModule.join(folderPath, f));
          loadTexturesFromPaths(paths);
        }
      }
    });
  }
  function setupBlockymodelCodec() {
    let codec = new Codec("blockymodel", {
      name: "Hytale Blockymodel",
      extension: "blockymodel",
      remember: true,
      support_partial_export: true,
      load_filter: {
        type: "json",
        extensions: ["blockymodel"]
      },
      load(model, file, args = {}) {
        let path_segments = file.path && file.path.split(/[\\\/]/);
        let format = this.format;
        if (model.format) {
          if (model.format == "prop") {
            format = Formats.hytale_prop;
          }
        } else {
          if (path_segments && path_segments.includes("Blocks")) {
            format = Formats.hytale_prop;
          }
        }
        if (!args.import_to_current_project) {
          setupProject(format);
        }
        if (path_segments && isApp && this.remember && !file.no_file) {
          path_segments[path_segments.length - 1] = path_segments.last().split(".")[0];
          Project.name = path_segments.findLast((p) => p != "Model" && p != "Models" && p != "Attachments") ?? "Model";
          Project.export_path = file.path;
        }
        this.parse(model, file.path, args);
        if (file.path && isApp && this.remember && !file.no_file) {
          addRecentProject({
            name: Project.name,
            path: Project.export_path,
            icon: Format.icon
          });
          let project = Project;
          setTimeout(() => {
            if (Project == project) updateRecentProjectThumbnail();
          }, 500);
        }
        Settings.updateSettingsInProfiles();
      },
      // MARK: Compile
      compile(options = {}) {
        let model = {
          nodes: [],
          format: Format.id == "hytale_prop" ? "prop" : "character",
          lod: "auto"
        };
        let node_id = 1;
        let formatVector = (input) => {
          return new oneLiner({
            x: input[0],
            y: input[1],
            z: input[2]
          });
        };
        function turnNodeIntoBox(node, cube, original_element) {
          let size = cube.size();
          let stretch = cube.stretch.slice();
          let offset = [
            Math.lerp(cube.from[0], cube.to[0], 0.5) - original_element.origin[0],
            Math.lerp(cube.from[1], cube.to[1], 0.5) - original_element.origin[1],
            Math.lerp(cube.from[2], cube.to[2], 0.5) - original_element.origin[2]
          ];
          node.shape.type = "box";
          node.shape.settings.size = formatVector(size);
          node.shape.offset = formatVector(offset);
          if (cubeIsQuad(cube)) {
            node.shape.type = "quad";
            let used_face = Object.keys(cube.faces).find((fkey) => cube.faces[fkey].texture != null);
            let normal = "+Z";
            switch (used_face) {
              case "west":
                normal = "-X";
                break;
              case "east":
                normal = "+X";
                break;
              case "down":
                normal = "-Y";
                break;
              case "up":
                normal = "+Y";
                break;
              case "north":
                normal = "-Z";
                break;
              case "south":
                normal = "+Z";
                break;
            }
            node.shape.settings.normal = normal;
            delete node.shape.settings.size.z;
            if (normal.endsWith("X")) {
              node.shape.settings.size.x = size[2];
            } else if (normal.endsWith("Y")) {
              node.shape.settings.size.y = size[2];
            }
          }
          node.shape.stretch = formatVector(stretch);
          node.shape.visible = cube.visibility;
          node.shape.doubleSided = cube.double_sided == true;
          node.shape.shadingMode = cube.shading_mode;
          node.shape.unwrapMode = "custom";
          if (cube == original_element) {
            node.shape.settings.isStaticBox = true;
          }
          const BBToHytaleDirection = {
            north: "back",
            south: "front",
            west: "left",
            east: "right",
            up: "top",
            down: "bottom"
          };
          for (let fkey in cube.faces) {
            let flipMinMax = function(axis) {
              if (axis == 0 /* X */) {
                flip_x = !flip_x;
                if (flip_x) {
                  uv_x = Math.max(face.uv[0], face.uv[2]);
                } else {
                  uv_x = Math.min(face.uv[0], face.uv[2]);
                }
              } else {
                flip_y = !flip_y;
                if (flip_y) {
                  uv_y = Math.max(face.uv[1], face.uv[3]);
                } else {
                  uv_y = Math.min(face.uv[1], face.uv[3]);
                }
              }
            };
            let face = cube.faces[fkey];
            if (face.texture == null) continue;
            let direction = BBToHytaleDirection[fkey];
            if (node.shape.type == "quad") direction = "front";
            let flip_x = false;
            let flip_y = false;
            let uv_x = Math.min(face.uv[0], face.uv[2]);
            let uv_y = Math.min(face.uv[1], face.uv[3]);
            let UVAxis;
            ((UVAxis2) => {
              UVAxis2[UVAxis2["X"] = 0] = "X";
              UVAxis2[UVAxis2["Y"] = 1] = "Y";
            })(UVAxis || (UVAxis = {}));
            let mirror_x = false;
            let mirror_y = false;
            if (face.uv[0] > face.uv[2]) {
              mirror_x = true;
              flipMinMax(0 /* X */);
            }
            if (face.uv[1] > face.uv[3]) {
              mirror_y = true;
              flipMinMax(1 /* Y */);
            }
            let uv_rot = 0;
            switch (face.rotation) {
              case 90: {
                uv_rot = 270;
                if ((mirror_x || mirror_y) && !(mirror_x && mirror_y)) {
                  uv_rot = 90;
                }
                flipMinMax(1 /* Y */);
                break;
              }
              case 180: {
                uv_rot = 180;
                flipMinMax(1 /* Y */);
                flipMinMax(0 /* X */);
                break;
              }
              case 270: {
                uv_rot = 90;
                if ((mirror_x || mirror_y) && !(mirror_x && mirror_y)) {
                  uv_rot = 270;
                }
                flipMinMax(0 /* X */);
                break;
              }
            }
            let layout_face = {
              offset: new oneLiner({ x: Math.round(uv_x), y: Math.round(uv_y) }),
              mirror: new oneLiner({ x: mirror_x, y: mirror_y }),
              angle: uv_rot
            };
            node.shape.textureLayout[direction] = layout_face;
          }
        }
        function getNodeOffset(group, include_original_offset = true) {
          let cube = getMainShape(group);
          if (cube) {
            let center_pos = cube.from.slice().V3_add(cube.to).V3_divide(2, 2, 2);
            center_pos.V3_subtract(group.origin);
            return center_pos;
          } else if (include_original_offset) {
            return group.original_offset;
          }
        }
        function compileNode(element, name = element.name) {
          if (!element.export) return void 0;
          if (!options.attachment) {
            let collection = Collection.all.find((c) => c.contains(element));
            if (collection) return;
          }
          let euler = Reusable.euler1.set(
            Math.degToRad(element.rotation[0]),
            Math.degToRad(element.rotation[1]),
            Math.degToRad(element.rotation[2]),
            element.scene_object.rotation.order
          );
          let quaternion = Reusable.quat1.setFromEuler(euler);
          let orientation = new oneLiner({
            x: quaternion.x,
            y: quaternion.y,
            z: quaternion.z,
            w: quaternion.w
          });
          let origin = element.origin.slice();
          let offset = element instanceof Group ? getNodeOffset(element) : [0, 0, 0];
          if (element.parent instanceof Group) {
            origin.V3_subtract(element.parent.origin);
            let parent_offset = getNodeOffset(element.parent, !options.attachment);
            if (parent_offset) {
              origin.V3_subtract(parent_offset);
            }
          }
          if (options.attachment && element instanceof Group && element.is_piece && element.original_position?.some((v) => v)) {
            origin = element.original_position;
          }
          let node = {
            id: node_id.toString(),
            name: name.replace(/^.+:/, ""),
            position: formatVector(origin),
            orientation,
            shape: {
              type: "none",
              offset: formatVector(offset),
              stretch: formatVector([1, 1, 1]),
              settings: {
                isPiece: element instanceof Group && element.is_piece || false
              },
              textureLayout: {},
              unwrapMode: "custom",
              visible: element.visibility,
              doubleSided: false,
              shadingMode: "flat"
            }
          };
          node_id++;
          if (element instanceof Cube) {
            turnNodeIntoBox(node, element, element);
          } else if ("children" in element) {
            let shape_count = 0;
            let child_cube_count = 0;
            for (let child of element.children ?? []) {
              if (!child.export) continue;
              let result;
              if (qualifiesAsMainShape(child) && shape_count == 0) {
                turnNodeIntoBox(node, child, element);
                shape_count++;
              } else if (child instanceof Cube) {
                child_cube_count++;
                result = compileNode(child, child.name + "--C" + child_cube_count);
              } else if (child instanceof Group) {
                result = compileNode(child);
              }
              if (result) {
                if (!node.children) node.children = [];
                node.children.push(result);
              }
            }
          }
          return node;
        }
        let nodes = Outliner.root.filter((node) => node instanceof Group || node instanceof Cube);
        if (options.attachment instanceof Collection) {
          let in_collection = options.attachment.getChildren();
          nodes = in_collection.filter((g) => {
            return g instanceof Group;
          });
        }
        for (let node of nodes) {
          let compiled = compileNode(node);
          if (compiled) model.nodes.push(compiled);
        }
        if (options.raw) {
          return model;
        } else {
          return compileJSON(model, Config.json_compile_options);
        }
      },
      // MARK: Parse
      parse(model, path, args = {}) {
        function parseVector(vec, fallback = [0, 0, 0]) {
          if (!vec) return fallback;
          return Object.values(vec).slice(0, 3);
        }
        const new_groups = [];
        const existing_groups = Group.all.slice();
        function parseNode(node, parent_node, parent_group = "root", parent_offset) {
          if (args.attachment) {
            let attachment_node;
            if (args.attachment && node.shape?.settings?.isPiece === true && existing_groups.length) {
              let node_name = node.name;
              attachment_node = existing_groups.find((g) => g.name == node_name);
            }
            if (attachment_node) {
              parent_group = attachment_node;
              parent_node = null;
            }
          }
          let quaternion = new THREE.Quaternion();
          quaternion.set(node.orientation.x, node.orientation.y, node.orientation.z, node.orientation.w);
          let rotation_euler = new THREE.Euler().setFromQuaternion(quaternion.normalize(), "ZYX");
          let name = node.name;
          let offset = node.shape?.offset ? parseVector(node.shape?.offset) : [0, 0, 0];
          let origin = parseVector(node.position);
          let original_position;
          let rotation = [
            Math.roundTo(Math.radToDeg(rotation_euler.x), 3),
            Math.roundTo(Math.radToDeg(rotation_euler.y), 3),
            Math.roundTo(Math.radToDeg(rotation_euler.z), 3)
          ];
          if (args.attachment && !parent_node && parent_group instanceof Group) {
            let reference_node = getMainShape(parent_group) ?? parent_group;
            original_position = origin;
            origin = reference_node.origin.slice();
          } else if (parent_offset && parent_group instanceof Group) {
            origin.V3_add(parent_offset);
            origin.V3_add(parent_group.origin);
          }
          let group = null;
          if (!node.shape?.settings?.isStaticBox) {
            group = new Group({
              name,
              autouv: 1,
              origin,
              rotation,
              visibility: node.shape?.visible != false
            });
            new_groups.push(group);
            group.addTo(parent_group);
            if (!parent_node && args.attachment) {
              group.name = args.attachment + ":" + group.name;
              group.color = 1;
              group.rotation.V3_set(0, 0, 0);
            }
            group.init();
            let custom_data = {
              is_piece: node.shape?.settings?.isPiece ?? false,
              original_position,
              original_offset: offset
            };
            group.extend(custom_data);
          } else {
            name = name.replace(/--C\d+$/, "");
          }
          if (node.shape.type != "none") {
            let switchIndices = function(arr, i1, i2) {
              temp = arr[i1];
              arr[i1] = arr[i2];
              arr[i2] = temp;
            }, resetFace = function(face_name) {
              cube.faces[face_name].texture = null;
              cube.faces[face_name].uv = [0, 0, 0, 0];
            };
            let size = parseVector(node.shape.settings.size);
            let stretch = parseVector(node.shape.stretch, [1, 1, 1]);
            if (node.shape.type == "quad") {
              let axis = node.shape.settings.normal?.substring(1) ?? "Z";
              if (axis == "X") {
                size = [0, size[1], size[0]];
              } else if (axis == "Y") {
                size.splice("XYZ".indexOf(axis), 0, 0);
              } else if (axis == "Z") {
                size[2] = 0;
              }
            }
            let cube = new Cube({
              name,
              autouv: 1,
              box_uv: false,
              visibility: node.shape.visible != false,
              rotation: [0, 0, 0],
              stretch,
              from: [
                -size[0] / 2 + origin[0] + offset[0],
                -size[1] / 2 + origin[1] + offset[1],
                -size[2] / 2 + origin[2] + offset[2]
              ],
              to: [
                size[0] / 2 + origin[0] + offset[0],
                size[1] / 2 + origin[1] + offset[1],
                size[2] / 2 + origin[2] + offset[2]
              ]
            });
            if (group) {
              group.color = cube.color;
              cube.origin.V3_set(
                Math.lerp(cube.from[0], cube.to[0], 0.5),
                Math.lerp(cube.from[1], cube.to[1], 0.5),
                Math.lerp(cube.from[2], cube.to[2], 0.5)
              );
            } else {
              cube.extend({
                origin,
                rotation
              });
            }
            cube.extend({
              // @ts-ignore
              shading_mode: node.shape.shadingMode,
              double_sided: node.shape.doubleSided
            });
            let temp;
            let HytaleDirection;
            ((HytaleDirection2) => {
              HytaleDirection2["back"] = "back";
              HytaleDirection2["front"] = "front";
              HytaleDirection2["left"] = "left";
              HytaleDirection2["right"] = "right";
              HytaleDirection2["top"] = "top";
              HytaleDirection2["bottom"] = "bottom";
            })(HytaleDirection || (HytaleDirection = {}));
            const HytaleToBBDirection = {
              back: "north",
              front: "south",
              left: "west",
              right: "east",
              top: "up",
              bottom: "down"
            };
            const normal_faces = {
              "-X": "west",
              "+X": "east",
              "-Y": "down",
              "+Y": "up",
              "-Z": "north",
              "+Z": "south"
            };
            if (node.shape.settings.size) {
              let parseUVVector = function(vec, fallback = [0, 0]) {
                if (!vec) return fallback;
                return Object.values(vec).slice(0, 2);
              };
              let normal_face = node.shape.type == "quad" && normal_faces[node.shape.settings.normal];
              for (let key in HytaleDirection) {
                let face_name = HytaleToBBDirection[key];
                let uv_source = node.shape.textureLayout[key];
                if (normal_face == face_name) {
                  if (face_name != "south") resetFace("south");
                  uv_source = node.shape.textureLayout["front"];
                }
                if (!uv_source) {
                  resetFace(face_name);
                  continue;
                }
                let uv_offset = parseUVVector(uv_source.offset);
                let uv_size = [
                  size[0],
                  size[1]
                ];
                let uv_mirror = [
                  uv_source.mirror.x ? -1 : 1,
                  uv_source.mirror.y ? -1 : 1
                ];
                let uv_rotation = uv_source.angle;
                switch (key) {
                  case "left": {
                    uv_size[0] = size[2];
                    break;
                  }
                  case "right": {
                    uv_size[0] = size[2];
                    break;
                  }
                  case "top": {
                    uv_size[1] = size[2];
                    break;
                  }
                  case "bottom": {
                    uv_size[1] = size[2];
                    break;
                  }
                }
                let result = [0, 0, 0, 0];
                switch (uv_rotation) {
                  case 90: {
                    switchIndices(uv_size, 0, 1);
                    switchIndices(uv_mirror, 0, 1);
                    uv_mirror[0] *= -1;
                    result = [
                      uv_offset[0],
                      uv_offset[1] + uv_size[1] * uv_mirror[1],
                      uv_offset[0] + uv_size[0] * uv_mirror[0],
                      uv_offset[1]
                    ];
                    break;
                  }
                  case 270: {
                    switchIndices(uv_size, 0, 1);
                    switchIndices(uv_mirror, 0, 1);
                    uv_mirror[1] *= -1;
                    result = [
                      uv_offset[0] + uv_size[0] * uv_mirror[0],
                      uv_offset[1],
                      uv_offset[0],
                      uv_offset[1] + uv_size[1] * uv_mirror[1]
                    ];
                    break;
                  }
                  case 180: {
                    uv_mirror[0] *= -1;
                    uv_mirror[1] *= -1;
                    result = [
                      uv_offset[0] + uv_size[0] * uv_mirror[0],
                      uv_offset[1] + uv_size[1] * uv_mirror[1],
                      uv_offset[0],
                      uv_offset[1]
                    ];
                    break;
                  }
                  case 0: {
                    result = [
                      uv_offset[0],
                      uv_offset[1],
                      uv_offset[0] + uv_size[0] * uv_mirror[0],
                      uv_offset[1] + uv_size[1] * uv_mirror[1]
                    ];
                    break;
                  }
                }
                cube.faces[face_name].rotation = uv_rotation;
                cube.faces[face_name].uv = result;
              }
            }
            cube.addTo(group || parent_group).init();
          }
          if (node.children?.length && group instanceof Group) {
            if (args.attachment && node.shape.settings.isPiece) {
              offset = [0, 0, 0];
            }
            for (let child of node.children) {
              parseNode(child, node, group, offset);
            }
          }
        }
        for (let node of model.nodes) {
          parseNode(node, null);
        }
        let new_textures = [];
        if (isApp && path) {
          let project = Project;
          let dirname = PathModule.dirname(path);
          let model_file_name = pathToName(path, false);
          let fs = requireNativeModule("fs");
          let texture_paths = discoverTexturePaths(dirname, model_file_name);
          if (texture_paths.length > 0 && !args.attachment) {
            new_textures = loadTexturesFromPaths(texture_paths, Project.name);
          } else if (texture_paths.length > 0) {
            new_textures = loadTexturesFromPaths(texture_paths);
          }
          if (new_textures.length === 0 && !args.attachment) {
            setTimeout(() => {
              if (Project !== project) return;
              promptForTextures(dirname);
            }, 100);
          }
          if (!args?.attachment) {
            let listener = Blockbench.on("select_mode", ({ mode }) => {
              if (mode.id != "animate" || project != Project) return;
              listener.delete();
              let anim_path = PathModule.resolve(dirname, "../Animations/");
              try {
                let anim_folders = fs.existsSync(anim_path) ? fs.readdirSync(anim_path) : [];
                for (let folder of anim_folders) {
                  if (folder.includes(".")) continue;
                  let path2 = PathModule.resolve(anim_path, folder);
                  let anim_files = fs.readdirSync(path2);
                  for (let file_name of anim_files) {
                    if (file_name.match(/\.blockyanim$/i)) {
                      let file_path = PathModule.resolve(path2, file_name);
                      let content = fs.readFileSync(file_path, "utf-8");
                      let json = autoParseJSON(content);
                      parseAnimationFile({ name: file_name, path: file_path }, json);
                    }
                  }
                }
              } catch (err) {
                console.error(err);
              }
            });
          }
        }
        return { new_groups, new_textures };
      },
      // MARK: Other
      async export(options) {
        if (Object.keys(this.export_options).length) {
          let result = await this.promptExportOptions();
          if (result === null) return;
        }
        Blockbench.export({
          resource_id: "model",
          type: this.name,
          extensions: [this.extension],
          name: this.fileName(),
          startpath: this.startPath(),
          content: this.compile(options),
          custom_writer: isApp ? (a, b) => this.write(a, b) : null
        }, (path) => this.afterDownload(path));
      },
      async exportCollection(collection) {
        this.context = collection;
        await this.export({ attachment: collection });
        this.context = null;
      },
      async writeCollection(collection) {
        this.context = collection;
        this.write(this.compile({ attachment: collection }), collection.export_path);
        this.context = null;
      }
    });
    let export_action = new Action("export_blockymodel", {
      name: "Export Hytale Blockymodel",
      description: "Export a blockymodel file",
      icon: "icon-format_hytale",
      category: "file",
      condition: { formats: FORMAT_IDS },
      click: function() {
        codec.export();
      }
    });
    codec.export_action = export_action;
    track(codec, export_action);
    MenuBar.menus.file.addAction(export_action, "export.1");
    let hook = Blockbench.on("quick_save_model", () => {
      if (FORMAT_IDS.includes(Format.id) == false) return;
      for (let collection of Collection.all) {
        if (collection.export_codec != codec.id) continue;
        codec.writeCollection(collection);
      }
    });
    track(hook);
    return codec;
  }

  // src/formats.ts
  var FORMAT_IDS = [
    "hytale_character",
    "hytale_prop"
  ];
  function setupFormats() {
    let codec = setupBlockymodelCodec();
    let common = {
      category: "hytale",
      target: "Hytale",
      codec,
      forward_direction: "+z",
      single_texture_default: true,
      animation_files: true,
      animation_grouping: "custom",
      animation_mode: true,
      bone_rig: true,
      centered_grid: true,
      box_uv: false,
      optional_box_uv: true,
      box_uv_float_size: true,
      integer_size: true,
      uv_rotation: true,
      rotate_cubes: true,
      per_texture_uv_size: true,
      texture_wrap_default: "clamp",
      stretch_cubes: true,
      model_identifier: false,
      animation_loop_wrapping: true,
      quaternion_interpolation: true,
      onActivation() {
        settings.shading.set(false);
        Panels.animations.inside_vue.$data.group_animations_by_file = false;
      }
    };
    let format_page = {
      content: [
        { type: "h3", text: tl("mode.start.format.informations") },
        {
          text: `* One texture can be applied to a model at a time
                    * UV sizes are linked to the size of each cube and cannot be modified, except by stretching the cube
                    * Models can have a maximum of 255 nodes`.replace(/(\t| {4,4})+/g, "")
        },
        { type: "h3", text: tl("mode.start.format.resources") },
        {
          text: [
            "* [Modeling Overview and Style Guide](https://hytale.com/news/2025/12/an-introduction-to-making-models-for-hytale)",
            "* [Modeling Tutorial](https://youtu.be/Q07i3wmGy0Y)"
          ].join("\n")
        }
      ]
    };
    let format_character = new ModelFormat("hytale_character", {
      name: "Hytale Character",
      description: "Create character and attachment models using Hytale's blockymodel format",
      icon: "icon-format_hytale",
      format_page,
      block_size: 64,
      ...common
      // TODO: Auto-reload attachments on tab switch. Needs dirty tracking and setting toggle to avoid losing unsaved changes
      /*
      onActivation() {
          common.onActivation?.();
          setTimeout(() => reload_all_attachments?.click(), 0);
      }
      */
    });
    let format_prop = new ModelFormat("hytale_prop", {
      name: "Hytale Prop",
      description: "Create prop models using Hytale's blockymodel format",
      icon: "icon-format_hytale",
      format_page,
      block_size: 32,
      ...common
    });
    let int_setting = new Setting("hytale_integer_size", {
      name: "Hytale Integer Size",
      category: "edit",
      description: "Restrict cube sizes in hytale formats to full integers. Float values are technically supported but make UV mapping more difficult. Using stretch is recommended instead.",
      type: "toggle",
      value: true
    });
    track(int_setting);
    const integer_size = { get: () => int_setting.value };
    Object.defineProperty(format_character, "integer_size", integer_size);
    Object.defineProperty(format_prop, "integer_size", integer_size);
    const single_texture = { get: () => Collection.all.length == 0 };
    Object.defineProperty(format_character, "single_texture", single_texture);
    Object.defineProperty(format_prop, "single_texture", single_texture);
    codec.format = format_character;
    format_character.codec = codec;
    format_prop.codec = codec;
    track(format_character);
    track(format_prop);
    Language.addTranslations("en", {
      "format_category.hytale": "Hytale"
    });
  }
  function isHytaleFormat() {
    return Format && FORMAT_IDS.includes(Format.id);
  }

  // src/name_overlap.ts
  var Animation = window.Animation;
  function copyAnimationToGroupsWithSameName(animation, source_group) {
    let source_animator = animation.getBoneAnimator(source_group);
    let other_groups = Group.all.filter((g) => g.name == source_group.name && g != source_group);
    for (let group2 of other_groups) {
      let animator2 = animation.getBoneAnimator(group2);
      for (let channel in animator2.channels) {
        if (animator2[channel] instanceof Array) animator2[channel].empty();
      }
      source_animator.keyframes.forEach((kf) => {
        animator2.addKeyframe(kf, guid());
      });
    }
  }
  function setupNameOverlap() {
    Blockbench.on("finish_edit", (arg) => {
      if (arg.aspects.keyframes && Animation.selected) {
        let changes = false;
        let groups = {};
        if (Timeline.selected_animator) {
          groups[Timeline.selected_animator.name] = [
            Timeline.selected_animator.group
          ];
        }
        for (let group of Group.all) {
          if (!groups[group.name]) groups[group.name] = [];
          groups[group.name].push(group);
        }
        for (let name in groups) {
          if (groups[name].length >= 2) {
            copyAnimationToGroupsWithSameName(Animation.selected, groups[name][0]);
            if (!changes && groups[name].find((g) => g.selected)) changes = true;
          }
        }
        if (changes) {
          Animator.preview();
        }
      }
    });
    let bone_animator_select_original = BoneAnimator.prototype.select;
    BoneAnimator.prototype.select = function select(group_is_selected) {
      if (!this.getGroup()) {
        unselectAllElements();
        return this;
      }
      if (this.group.locked) return;
      for (var key in this.animation.animators) {
        this.animation.animators[key].selected = false;
      }
      if (group_is_selected !== true && this.group) {
        this.group.select();
      }
      GeneralAnimator.prototype.select.call(this);
      if (this[Toolbox.selected.animation_channel] && (Timeline.selected.length == 0 || Timeline.selected[0].animator != this) && !Blockbench.hasFlag("loading_selection_save")) {
        var nearest;
        this[Toolbox.selected.animation_channel].forEach((kf) => {
          if (Math.abs(kf.time - Timeline.time) < 2e-3) {
            nearest = kf;
          }
        });
        if (nearest) {
          nearest.select();
        }
      }
      if (this.group && this.group.parent && this.group.parent !== "root") {
        this.group.parent.openUp();
      }
      return this;
    };
    track({
      delete() {
        BoneAnimator.prototype.select = bone_animator_select_original;
      }
    });
    let setting = new Setting("hytale_duplicate_bone_names", {
      name: "Duplicate Bone Names",
      category: "edit",
      description: "Allow creating duplicate groups names in Hytale formats. Multiple groups with the same name can be used to apply animations to multiple nodes at once.",
      type: "toggle",
      value: false
    });
    let override = Group.addBehaviorOverride({
      condition: () => isHytaleFormat() && setting.value == true,
      priority: 2,
      behavior: {
        unique_name: false
      }
    });
    track(override, setting);
  }

  // src/blockyanim.ts
  var FPS = 60;
  var Animation2 = window.Animation;
  function parseAnimationFile(file, content) {
    let animation = new Animation2({
      name: pathToName(file.name, false),
      length: content.duration / FPS,
      loop: content.holdLastKeyframe ? "hold" : "loop",
      path: file.path,
      snapping: FPS
    });
    let quaternion = new THREE.Quaternion();
    let euler = new THREE.Euler(0, 0, 0, "ZYX");
    for (let name in content.nodeAnimations) {
      let anim_data = content.nodeAnimations[name];
      let group_name = name;
      let group = Group.all.find((g) => g.name == group_name);
      let uuid = group ? group.uuid : guid();
      let ba = new BoneAnimator(uuid, animation, group_name);
      animation.animators[uuid] = ba;
      const anim_channels = [
        { channel: "rotation", keyframes: anim_data.orientation },
        { channel: "position", keyframes: anim_data.position },
        { channel: "scale", keyframes: anim_data.shapeStretch },
        { channel: "visibility", keyframes: anim_data.shapeVisible },
        { channel: "uv_offset", keyframes: anim_data.shapeUvOffset }
      ];
      for (let { channel, keyframes } of anim_channels) {
        if (!keyframes || keyframes.length == 0) continue;
        for (let kf_data of keyframes) {
          let data_point;
          if (channel == "visibility") {
            data_point = {
              visibility: kf_data.delta
            };
          } else if (channel == "uv_offset") {
            let delta = kf_data.delta;
            data_point = {
              x: delta.x,
              y: -delta.y
            };
          } else {
            let delta = kf_data.delta;
            if (channel == "rotation") {
              quaternion.set(delta.x, delta.y, delta.z, delta.w);
              euler.setFromQuaternion(quaternion.normalize(), "ZYX");
              data_point = {
                x: Math.radToDeg(euler.x),
                y: Math.radToDeg(euler.y),
                z: Math.radToDeg(euler.z)
              };
            } else {
              data_point = {
                x: delta.x,
                y: delta.y,
                z: delta.z
              };
            }
          }
          ba.addKeyframe({
            time: kf_data.time / FPS,
            channel,
            interpolation: kf_data.interpolationType == "smooth" ? "catmullrom" : "linear",
            data_points: [data_point]
          });
        }
      }
      if (group) copyAnimationToGroupsWithSameName(animation, group);
    }
    animation.add(false);
    if (!Animation2.selected && Animator.open) {
      animation.select();
    }
  }
  function compileAnimationFile(animation) {
    const nodeAnimations = {};
    const file = {
      formatVersion: 1,
      duration: Math.round(animation.length * FPS),
      holdLastKeyframe: animation.loop == "hold",
      nodeAnimations
    };
    const channels = {
      position: "position",
      rotation: "orientation",
      scale: "shapeStretch",
      visibility: "shapeVisible",
      uv_offset: "shapeUvOffset"
    };
    for (let uuid in animation.animators) {
      let animator = animation.animators[uuid];
      if (!animator.group) continue;
      let name = animator.name;
      let node_data = {};
      let has_data = false;
      for (let channel in channels) {
        let timeline;
        let hytale_channel_key = channels[channel];
        timeline = timeline = node_data[hytale_channel_key] = [];
        let keyframe_list = animator[channel].slice();
        keyframe_list.sort((a, b) => a.time - b.time);
        for (let kf of keyframe_list) {
          let data_point = kf.data_points[0];
          let delta;
          if (channel == "visibility") {
            delta = data_point.visibility;
          } else if (channel == "uv_offset") {
            delta = {
              x: Math.round(parseFloat(data_point.x)),
              y: -Math.round(parseFloat(data_point.y))
            };
            delta = new oneLiner(delta);
          } else {
            delta = {
              x: parseFloat(data_point.x),
              y: parseFloat(data_point.y),
              z: parseFloat(data_point.z)
            };
            if (channel == "rotation") {
              let euler = new THREE.Euler(
                Math.degToRad(kf.calc("x")),
                Math.degToRad(kf.calc("y")),
                Math.degToRad(kf.calc("z")),
                Format.euler_order
              );
              let quaternion = new THREE.Quaternion().setFromEuler(euler);
              delta = {
                x: quaternion.x,
                y: quaternion.y,
                z: quaternion.z,
                w: quaternion.w
              };
            }
            delta = new oneLiner(delta);
          }
          let kf_output = {
            time: Math.round(kf.time * FPS),
            delta,
            interpolationType: kf.interpolation == "catmullrom" ? "smooth" : "linear"
          };
          if (channel == "uv_offset") console.log(kf_output);
          timeline.push(kf_output);
          has_data = true;
        }
      }
      if (has_data) {
        if (!node_data.shapeUvOffset) {
          node_data.shapeUvOffset = [];
        }
        nodeAnimations[name] = node_data;
      }
    }
    return file;
  }
  function setupAnimationCodec() {
    BarItems.load_animation_file.click = function(...args) {
      if (FORMAT_IDS.includes(Format.id)) {
        Filesystem.importFile({
          resource_id: "blockyanim",
          extensions: ["blockyanim"],
          type: "Blockyanim",
          multiple: true
        }, async function(files) {
          for (let file of files) {
            let content = autoParseJSON(file.content);
            parseAnimationFile(file, content);
          }
        });
        return;
      } else {
        this.dispatchEvent("use");
        this.onClick(...args);
        this.dispatchEvent("used");
      }
    };
    let export_anim = new Action("export_blockyanim", {
      name: "Export Blockyanim",
      icon: "cinematic_blur",
      condition: { formats: FORMAT_IDS, selected: { animation: true } },
      click() {
        let animation;
        animation = Animation2.selected;
        let content = compileJSON(compileAnimationFile(animation), Config.json_compile_options);
        Filesystem.exportFile({
          resource_id: "blockyanim",
          type: "Blockyanim",
          extensions: ["blockyanim"],
          name: animation.name,
          content
        });
      }
    });
    track(export_anim);
    MenuBar.menus.animation.addAction(export_anim);
    Panels.animations.toolbars[0].add(export_anim, "4");
    let handler = Filesystem.addDragHandler("blockyanim", {
      extensions: ["blockyanim"],
      readtype: "text",
      condition: { modes: ["animate"] }
    }, async function(files) {
      for (let file of files) {
        let content = autoParseJSON(file.content);
        parseAnimationFile(file, content);
      }
    });
    track(handler);
    let original_save = Animation2.prototype.save;
    Animation2.prototype.save = function(...args) {
      if (!FORMAT_IDS.includes(Format.id)) {
        return original_save.call(this, ...args);
      }
      let animation;
      animation = this;
      let content = compileJSON(compileAnimationFile(animation), Config.json_compile_options);
      if (isApp && this.path) {
        Blockbench.writeFile(this.path, { content }, (real_path) => {
          this.saved = true;
          this.saved_name = this.name;
          this.path = real_path;
        });
      } else {
        Blockbench.export({
          resource_id: "blockyanim",
          type: "Blockyanim",
          extensions: ["blockyanim"],
          name: animation.name,
          startpath: this.path,
          content
        }, (real_path) => {
          if (isApp) this.path == real_path;
          this.saved = true;
        });
      }
      return this;
    };
    track({
      delete() {
        Animation2.prototype.save = original_save;
      }
    });
    let save_all_listener = BarItems.save_all_animations.on("use", () => {
      if (!isHytaleFormat()) return;
      Animation2.all.forEach((animation) => {
        if (!animation.saved) animation.save();
      });
      return false;
    });
    track(save_all_listener);
    let original_condition = BarItems.export_animation_file.condition;
    BarItems.export_animation_file.condition = () => {
      return Condition(original_condition) && !FORMAT_IDS.includes(Format.id);
    };
    track({
      delete() {
        BarItems.export_animation_file.condition = original_condition;
      }
    });
  }

  // src/texture.ts
  function updateUVSize(texture) {
    let size = [texture.width, texture.display_height];
    let frames = texture.frameCount;
    if (settings.detect_flipbook_textures.value == false || frames <= 2 || frames % 1) {
      size[1] = texture.height;
    }
    texture.uv_width = size[0];
    texture.uv_height = size[1];
  }
  function setupTextureHandling() {
    let setting = new Setting("preview_selected_texture", {
      name: "Preview Selected Texture",
      description: "When selecting a texture in a Hytale format, preview the texture on the model instantly",
      category: "preview",
      type: "toggle",
      value: true
    });
    track(setting);
    let handler = Blockbench.on("select_texture", (arg) => {
      if (!isHytaleFormat()) return;
      if (setting.value == false) return;
      let texture = arg.texture;
      let texture_group = texture.getGroup();
      if (texture_group) {
        let collection = Collection.all.find((c) => c.name == texture_group.name);
        if (collection) {
          collection.texture = texture.uuid;
          Canvas.updateAllFaces(texture);
        }
      } else {
        texture.setAsDefaultTexture();
      }
      UVEditor.vue.updateTexture();
    });
    track(handler);
  }

  // src/attachment_texture.ts
  function getCollection(cube) {
    return Collection.all.find((c) => c.contains(cube));
  }
  function processAttachmentTextures(attachmentName, newTextures) {
    let textureGroup = new TextureGroup({ name: attachmentName });
    textureGroup.folded = true;
    textureGroup.add();
    if (newTextures.length === 0) return "";
    for (let tex of newTextures) {
      tex.group = textureGroup.uuid;
      updateUVSize(tex);
    }
    let texture = newTextures.find((t) => t.name.startsWith(attachmentName)) ?? newTextures[0];
    return texture.uuid;
  }
  function setupAttachmentTextures() {
    let textureProperty = new Property(Collection, "string", "texture", {
      condition: { formats: FORMAT_IDS }
    });
    track(textureProperty);
    let originalGetTexture = CubeFace.prototype.getTexture;
    CubeFace.prototype.getTexture = function(...args) {
      if (isHytaleFormat()) {
        if (this.texture == null) return null;
        let collection = getCollection(this.cube);
        if (collection && "texture" in collection) {
          if (collection.texture) {
            let texture = Texture.all.find((t) => t.uuid == collection.texture);
            if (texture) return texture;
          }
          return null;
        }
        return Texture.getDefault();
      }
      return originalGetTexture.call(this, ...args);
    };
    track({
      delete() {
        CubeFace.prototype.getTexture = originalGetTexture;
      }
    });
    let assignTexture = {
      id: "set_texture",
      name: "menu.cube.texture",
      icon: "collections",
      condition: { formats: FORMAT_IDS },
      children(context) {
        function applyTexture(textureValue, undoMessage) {
          Undo.initEdit({ collections: Collection.selected });
          for (let collection of Collection.selected) {
            collection.texture = textureValue;
          }
          Undo.finishEdit(undoMessage);
          Canvas.updateAllFaces();
        }
        let arr = [
          {
            icon: "crop_square",
            name: Format.single_texture_default ? "menu.cube.texture.default" : "menu.cube.texture.blank",
            click() {
              applyTexture("", "Unassign texture from collection");
            }
          }
        ];
        Texture.all.forEach((t) => {
          arr.push({
            name: t.name,
            // @ts-expect-error
            icon: t.img,
            marked: t.uuid == context.texture,
            click() {
              applyTexture(t.uuid, "Apply texture to collection");
            }
          });
        });
        return arr;
      }
    };
    Collection.menu.addAction(assignTexture);
    track({
      delete() {
        Collection.menu.removeAction("set_texture");
      }
    });
  }

  // src/attachments.ts
  var reload_all_attachments;
  function setupAttachments() {
    setupAttachmentTextures();
    let shared_delete = SharedActions.add("delete", {
      subject: "collection",
      priority: 1,
      condition: () => Prop.active_panel == "collections" && isHytaleFormat() && Collection.selected.some((c) => c.export_codec === "blockymodel"),
      run() {
        let collections = Collection.selected.slice();
        let remove_elements = [];
        let remove_groups = [];
        let textures = [];
        let texture_groups = [];
        for (let collection of collections) {
          if (collection.export_codec === "blockymodel") {
            for (let child of collection.getAllChildren()) {
              child = child;
              (child instanceof Group ? remove_groups : remove_elements).safePush(child);
            }
            let texture_group = TextureGroup.all.find((tg) => tg.name === collection.name);
            if (texture_group) {
              let textures2 = Texture.all.filter((t) => t.group === texture_group.uuid);
              textures.safePush(...textures2);
              texture_groups.push(texture_group);
            }
          }
        }
        Undo.initEdit({
          collections,
          groups: remove_groups,
          elements: remove_elements,
          outliner: true,
          // @ts-expect-error
          texture_groups,
          textures
        });
        collections.forEach((c) => Collection.all.remove(c));
        collections.empty();
        textures.forEach((t) => t.remove(true));
        textures.empty();
        texture_groups.forEach((t) => t.remove());
        texture_groups.empty();
        remove_groups.forEach((group) => group.remove());
        remove_groups.empty();
        remove_elements.forEach((element) => element.remove());
        remove_elements.empty();
        updateSelection();
        Undo.finishEdit("Remove attachment");
      }
    });
    track(shared_delete);
    let import_as_attachment = new Action("import_as_hytale_attachment", {
      name: "Import Attachment",
      icon: "fa-hat-cowboy",
      condition: { formats: FORMAT_IDS },
      click() {
        Filesystem.importFile({
          extensions: ["blockymodel"],
          type: "Blockymodel",
          multiple: true,
          startpath: Project.export_path.replace(/[\\\/]\w+.\w+$/, "") + osfs + "Attachments"
        }, (files) => {
          for (let file of files) {
            let json = autoParseJSON(file.content);
            let attachment_name = file.name.replace(/\.\w+$/, "");
            let content = Codecs.blockymodel.parse(json, file.path, { attachment: attachment_name });
            let name = file.name.split(".")[0];
            let new_groups = content.new_groups;
            let root_groups = new_groups.filter((group) => !new_groups.includes(group.parent));
            let collection = new Collection({
              name,
              children: root_groups.map((g) => g.uuid),
              export_codec: "blockymodel",
              visibility: true
            }).add();
            collection.export_path = file.path;
            let texturesToProcess = content.new_textures;
            if (texturesToProcess.length === 0) {
              let dirname = PathModule.dirname(file.path);
              let texturePaths = discoverTexturePaths(dirname, attachment_name);
              for (let texPath of texturePaths) {
                let tex = new Texture().fromPath(texPath).add(false);
                texturesToProcess.push(tex);
              }
            }
            let textureUuid = processAttachmentTextures(attachment_name, texturesToProcess);
            if (textureUuid) {
              collection.texture = textureUuid;
            }
            Canvas.updateAllFaces();
          }
        });
      }
    });
    track(import_as_attachment);
    let toolbar = Panels.collections.toolbars[0];
    toolbar.add(import_as_attachment);
    function reloadAttachment(collection) {
      for (let child of collection.getChildren()) {
        child.remove();
      }
      Filesystem.readFile([collection.export_path], {}, ([file]) => {
        let json = autoParseJSON(file.content);
        let content = Codecs.blockymodel.parse(json, file.path, { attachment: collection.name });
        let new_groups = content.new_groups;
        let root_groups = new_groups.filter((group) => !new_groups.includes(group.parent));
        collection.extend({
          children: root_groups.map((g) => g.uuid)
        }).add();
        Canvas.updateAllFaces();
      });
    }
    let reload_attachment_action = new Action("reload_hytale_attachment", {
      name: "Reload Attachment",
      icon: "refresh",
      condition: () => Collection.selected.length && Modes.edit,
      click() {
        for (let collection of Collection.selected) {
          reloadAttachment(collection);
        }
      }
    });
    Collection.menu.addAction(reload_attachment_action, 10);
    track(reload_attachment_action);
    reload_all_attachments = new Action("reload_all_hytale_attachments", {
      name: "Reload All Attachments",
      icon: "sync",
      condition: { formats: FORMAT_IDS },
      click() {
        for (let collection of Collection.all.filter((c) => c.export_path)) {
          reloadAttachment(collection);
        }
      }
    });
    track(reload_all_attachments);
    toolbar.add(reload_all_attachments);
  }

  // src/animations.ts
  function setupAnimation() {
    function displayVisibility(animator) {
      let group = animator.getGroup();
      let main_shape = getMainShape(group);
      if (!main_shape) return;
      let scene_object = main_shape.scene_object;
      if (animator.muted.visibility) {
        scene_object.visible = group.visibility;
        return;
      }
      let previous_keyframe;
      let previous_time = -Infinity;
      for (let keyframe of animator.visibility) {
        if (keyframe.time <= Timeline.time && keyframe.time > previous_time) {
          previous_keyframe = keyframe;
          previous_time = keyframe.time;
        }
      }
      if (previous_keyframe && scene_object) {
        scene_object.visible = previous_keyframe.data_points[0]?.visibility != false;
      } else if (scene_object) {
        scene_object.visible = group.visibility;
      }
    }
    BoneAnimator.addChannel("visibility", {
      name: "Visibility",
      mutable: true,
      transform: false,
      max_data_points: 1,
      condition: { formats: FORMAT_IDS },
      displayFrame(animator, multiplier) {
        displayVisibility(animator);
      }
    });
    let vis_property = new Property(KeyframeDataPoint, "boolean", "visibility", {
      label: "Visibility",
      condition: (point) => point.keyframe.channel == "visibility",
      default: true
    });
    track(vis_property);
    let on_exit_anim_mode = Blockbench.on("unselect_mode", (arg) => {
      if (isHytaleFormat() && arg.mode?.id == "animate") {
        Canvas.updateVisibility();
      }
    });
    track(vis_property, on_exit_anim_mode);
    function displayUVOffset(animator) {
      let group = animator.getGroup();
      let cube = getMainShape(group);
      if (!cube) return;
      let updateUV = (offset) => {
        if (offset) {
          offset = offset.map((v) => Math.round(v));
        }
        if (!offset || !offset[0] && !offset[1]) {
          if (!cube.mesh.userData.uv_anim_offset) {
            return;
          } else {
            cube.mesh.userData.uv_anim_offset = false;
          }
        } else {
          cube.mesh.userData.uv_anim_offset = true;
        }
        offset = offset ?? [0, 0];
        let fix_uvs = {};
        for (let fkey in cube.faces) {
          fix_uvs[fkey] = cube.faces[fkey].uv.slice();
          cube.faces[fkey].uv[0] += offset[0];
          cube.faces[fkey].uv[1] += offset[1];
          cube.faces[fkey].uv[2] += offset[0];
          cube.faces[fkey].uv[3] += offset[1];
        }
        Cube.preview_controller.updateUV(cube);
        for (let fkey in cube.faces) {
          cube.faces[fkey].uv.replace(fix_uvs[fkey]);
        }
      };
      if (animator.muted.uv_offset) {
        updateUV();
        return;
      }
      let previous_keyframe;
      let previous_time = -Infinity;
      for (let keyframe of animator.uv_offset) {
        if (keyframe.time <= Timeline.time && keyframe.time > previous_time) {
          previous_keyframe = keyframe;
          previous_time = keyframe.time;
        }
      }
      if (previous_keyframe) {
        updateUV(previous_keyframe.getArray());
      } else if (true) {
        updateUV();
      }
    }
    BoneAnimator.addChannel("uv_offset", {
      name: "UV Offset",
      mutable: true,
      transform: true,
      max_data_points: 1,
      condition: { formats: FORMAT_IDS },
      displayFrame(animator, multiplier) {
        displayUVOffset(animator);
      }
    });
    let original_condition = KeyframeDataPoint.properties.z.condition;
    KeyframeDataPoint.properties.z.condition = (point) => {
      if (point.keyframe.channel == "uv_offset") return false;
      return Condition(original_condition, point);
    };
    function weightedCubicBezier(t) {
      let P0 = 0, P1 = 0.05, P2 = 0.95, P3 = 1;
      let W0 = 2, W1 = 1, W2 = 2, W3 = 1;
      let b0 = (1 - t) ** 3;
      let b1 = 3 * (1 - t) ** 2 * t;
      let b2 = 3 * (1 - t) * t ** 2;
      let b3 = t ** 3;
      let w0 = b0 * W0;
      let w1 = b1 * W1;
      let w2 = b2 * W2;
      let w3 = b3 * W3;
      let numerator = w0 * P0 + w1 * P1 + w2 * P2 + w3 * P3;
      let denominator = w0 + w1 + w2 + w3;
      return numerator / denominator;
    }
    let on_interpolate = Blockbench.on("interpolate_keyframes", (arg) => {
      if (!isHytaleFormat()) return;
      if (!arg.use_quaternions || !arg.t || arg.t == 1) return;
      if (arg.keyframe_before.interpolation != "catmullrom" || arg.keyframe_after.interpolation != "catmullrom") return;
      return {
        t: weightedCubicBezier(arg.t)
      };
    });
    track(on_interpolate);
    let original_display_scale = BoneAnimator.prototype.displayScale;
    let original_display_rotation = BoneAnimator.prototype.displayRotation;
    let original_show_default_pose = Animator.showDefaultPose;
    BoneAnimator.prototype.displayScale = function displayScale(array, multiplier = 1) {
      if (!array) return this;
      if (isHytaleFormat()) {
        let target_shape = getMainShape(this.group);
        if (target_shape) {
          let initial_stretch = target_shape.stretch.slice();
          target_shape.stretch.V3_set([
            initial_stretch[0] * (1 + (array[0] - 1) * multiplier),
            initial_stretch[1] * (1 + (array[1] - 1) * multiplier),
            initial_stretch[2] * (1 + (array[2] - 1) * multiplier)
          ]);
          Cube.preview_controller.updateGeometry(target_shape);
          target_shape.stretch.V3_set(initial_stretch);
        }
        return this;
      }
      return original_display_scale.call(this, array, multiplier);
    };
    BoneAnimator.prototype.displayRotation = function displayRotation(array, multiplier = 1) {
      if (isHytaleFormat() && array) {
        let bone = this.group.scene_object;
        let euler = Reusable.euler1.set(
          Math.degToRad(array[0]) * multiplier,
          Math.degToRad(array[1]) * multiplier,
          Math.degToRad(array[2]) * multiplier,
          bone.rotation.order
        );
        let q2 = Reusable.quat2.setFromEuler(euler);
        bone.quaternion.multiply(q2);
        return this;
      }
      return original_display_rotation.call(this, array, multiplier);
    };
    Animator.showDefaultPose = function(reduced_updates, ...args) {
      original_show_default_pose(reduced_updates, ...args);
      if (isHytaleFormat()) {
        for (let cube of Cube.all) {
          Cube.preview_controller.updateGeometry(cube);
        }
      }
    };
    track({
      delete() {
        BoneAnimator.prototype.displayScale = original_display_scale;
        BoneAnimator.prototype.displayRotation = original_display_rotation;
        Animator.showDefaultPose = original_show_default_pose;
      }
    });
  }

  // src/element.ts
  function setupElements() {
    let property_shading_mode = new Property(Cube, "enum", "shading_mode", {
      default: "flat",
      values: ["flat", "standard", "fullbright", "reflective"],
      condition: { formats: FORMAT_IDS },
      inputs: {
        element_panel: {
          input: { label: "Shading Mode", type: "select", options: {
            flat: "Flat",
            standard: "Standard",
            fullbright: "Always Lit",
            reflective: "Reflective"
          } },
          onChange() {
          }
        }
      }
    });
    track(property_shading_mode);
    let property_double_sided = new Property(Cube, "boolean", "double_sided", {
      condition: { formats: FORMAT_IDS },
      inputs: {
        element_panel: {
          input: { label: "Double Sided", type: "checkbox" },
          onChange() {
            Canvas.updateView({ elements: Cube.all, element_aspects: { transform: true } });
          }
        }
      }
    });
    track(property_double_sided);
    let is_piece_property = new Property(Group, "boolean", "is_piece", {
      condition: { formats: FORMAT_IDS },
      inputs: {
        element_panel: {
          input: {
            label: "Attachment Piece",
            type: "checkbox",
            description: "When checked, the node will be attached to a node of the same name when displayed as an attachment in-game."
          }
        }
      }
    });
    track(is_piece_property);
    let original_position_property = new Property(Group, "vector", "original_position", {
      condition: { formats: FORMAT_IDS }
    });
    track(original_position_property);
    let original_offset_property = new Property(Group, "vector", "original_offset", {
      condition: { formats: FORMAT_IDS }
    });
    track(original_offset_property);
    let add_quad_action = new Action("hytale_add_quad", {
      name: "Add Quad",
      icon: "highlighter_size_5",
      category: "edit",
      condition: { formats: FORMAT_IDS, modes: ["edit"] },
      click() {
        let color = Math.floor(Math.random() * markerColors.length);
        let initial = "pos_z";
        function runEdit(amended, normal) {
          Undo.initEdit({ outliner: true, elements: [], selection: true }, amended);
          let base_quad = new Cube({
            autouv: settings.autouv.value ? 1 : 0,
            // @ts-ignore
            double_sided: true,
            box_uv: false,
            color
          }).init();
          base_quad.mapAutoUV();
          let group = getCurrentGroup();
          if (group) {
            base_quad.addTo(group);
            if (settings.inherit_parent_color.value) base_quad.color = group.color;
          }
          let texture = Texture.all.length && Format.single_texture ? Texture.getDefault().uuid : false;
          for (let face in base_quad.faces) {
            base_quad.faces[face].texture = null;
          }
          let size = [8, 8, 8];
          let positive = normal.startsWith("pos");
          switch (normal[4]) {
            case "x": {
              base_quad.faces.west.texture = positive ? null : texture;
              base_quad.faces.east.texture = positive ? texture : null;
              size[0] = 0;
              break;
            }
            case "y": {
              base_quad.faces.down.texture = positive ? null : texture;
              base_quad.faces.up.texture = positive ? texture : null;
              size[1] = 0;
              break;
            }
            case "z": {
              base_quad.faces.north.texture = positive ? null : texture;
              base_quad.faces.south.texture = positive ? texture : null;
              size[2] = 0;
              break;
            }
          }
          base_quad.extend({
            from: [-size[0] / 2, 0, -size[2] / 2],
            to: [size[0] / 2, size[1], size[2] / 2]
          });
          let fkey = Object.keys(base_quad.faces).find((fkey2) => base_quad.faces[fkey2].texture != null);
          UVEditor.getSelectedFaces(base_quad, true).replace([fkey]);
          base_quad.select();
          Canvas.updateView({ elements: [base_quad], element_aspects: { transform: true, geometry: true, faces: true } });
          Undo.finishEdit("Add quad", { outliner: true, elements: selected, selection: true });
          Vue.nextTick(function() {
            if (settings.create_rename.value) {
              base_quad.rename();
            }
          });
        }
        runEdit(false, initial);
        Undo.amendEdit({
          normal: {
            type: "inline_select",
            value: initial,
            label: "Normal",
            options: {
              "pos_x": "+X",
              "neg_x": "-X",
              "pos_y": "+Y",
              "neg_y": "-Y",
              "pos_z": "+Z",
              "neg_z": "-Z"
            }
          }
        }, (form) => {
          runEdit(true, form.normal);
        });
      }
    });
    track(add_quad_action);
    let add_element_menu = BarItems.add_element.side_menu;
    add_element_menu.addAction(add_quad_action);
    let set_uv_mode_original = Cube.prototype.setUVMode;
    Cube.prototype.setUVMode = function(box_uv, ...args) {
      if (isHytaleFormat()) {
        if (cubeIsQuad(this) && box_uv) return;
      }
      return set_uv_mode_original.call(this, box_uv, ...args);
    };
    track({
      delete() {
        Cube.prototype.setUVMode = set_uv_mode_original;
      }
    });
    let inflate_condition_original = BarItems.slider_inflate.condition;
    BarItems.slider_inflate.condition = () => {
      if (isHytaleFormat()) return false;
      return Condition(inflate_condition_original);
    };
    track({
      delete() {
        BarItems.slider_inflate.condition = inflate_condition_original;
      }
    });
    Blockbench.on("finish_edit", (arg) => {
      if (!FORMAT_IDS.includes(Format.id)) return;
      if (arg.aspects?.elements) {
        let uv_changes = false;
        for (let element of arg.aspects.elements) {
          if (element instanceof Cube == false) continue;
          if (!element.autouv) {
            element.autouv = 1;
            element.mapAutoUV();
            element.preview_controller.updateUV(element);
            uv_changes = true;
          }
          if (element.inflate) {
            element.inflate = 0;
            element.preview_controller.updateGeometry(element);
            TickUpdates.selection = true;
          }
        }
        if (uv_changes) {
          UVEditor.vue.$forceUpdate();
        }
      }
    });
  }

  // src/uv_cycling.ts
  var cycleState = null;
  var CLICK_THRESHOLD = 0;
  function screenToUV(event) {
    return UVEditor.getBrushCoordinates(event, UVEditor.texture);
  }
  function isPointInRect(x, y, rect) {
    const minX = Math.min(rect.ax, rect.bx);
    const maxX = Math.max(rect.ax, rect.bx);
    const minY = Math.min(rect.ay, rect.by);
    const maxY = Math.max(rect.ay, rect.by);
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }
  function getFacesAtUVPosition(uvX, uvY) {
    const faces = [];
    for (const cube of Cube.all) {
      if (!cube.visibility) continue;
      for (const faceKey in cube.faces) {
        const face = cube.faces[faceKey];
        if (face.enabled === false) continue;
        const rect = face.getBoundingRect();
        if (isPointInRect(uvX, uvY, rect)) {
          faces.push({ cube, faceKey });
        }
      }
    }
    faces.sort((a, b) => {
      if (a.cube.name !== b.cube.name) {
        return a.cube.name.localeCompare(b.cube.name);
      }
      return a.faceKey.localeCompare(b.faceKey);
    });
    const currentSelectedFaces = UVEditor.selected_faces || [];
    const currentCube = Cube.selected[0];
    if (currentCube && currentSelectedFaces.length > 0) {
      const currentFaceKey = currentSelectedFaces[0];
      const currentIndex = faces.findIndex(
        (f) => f.cube.uuid === currentCube.uuid && f.faceKey === currentFaceKey
      );
      if (currentIndex > 0) {
        return [...faces.slice(currentIndex), ...faces.slice(0, currentIndex)];
      }
    }
    return faces;
  }
  function selectFace(cube, faceKey) {
    cube.select();
    UVEditor.getSelectedFaces(cube, true).replace([faceKey]);
    UVEditor.vue.$forceUpdate();
    Canvas.updateView({
      elements: [cube],
      element_aspects: { faces: true }
    });
  }
  function setupUVCycling() {
    const uvPanel = Panels.uv;
    if (!uvPanel) return;
    function initializeClickHandler() {
      const uv_viewport = uvPanel.node?.querySelector("#uv_viewport");
      if (!uv_viewport) return false;
      let pendingClick = null;
      function handleMouseDown(event) {
        if (!FORMAT_IDS.includes(Format.id)) return;
        if (Modes.paint) return;
        if (event.button !== 0) return;
        pendingClick = { uvPos: screenToUV(event) };
      }
      function handleMouseUp(event) {
        if (!pendingClick) return;
        if (event.button !== 0) return;
        const uvPos = screenToUV(event);
        pendingClick = null;
        const isSamePosition = cycleState !== null && Math.abs(uvPos.x - cycleState.lastClickX) <= CLICK_THRESHOLD && Math.abs(uvPos.y - cycleState.lastClickY) <= CLICK_THRESHOLD;
        if (isSamePosition && cycleState) {
          cycleState.currentIndex = (cycleState.currentIndex + 1) % cycleState.facesAtPosition.length;
          const { cube, faceKey } = cycleState.facesAtPosition[cycleState.currentIndex];
          setTimeout(() => selectFace(cube, faceKey), 50);
        } else {
          const faces = getFacesAtUVPosition(uvPos.x, uvPos.y);
          if (faces.length > 1) {
            cycleState = {
              lastClickX: uvPos.x,
              lastClickY: uvPos.y,
              currentIndex: 0,
              facesAtPosition: faces
            };
          } else {
            cycleState = null;
          }
        }
      }
      uv_viewport.addEventListener("mousedown", handleMouseDown);
      uv_viewport.addEventListener("mouseup", handleMouseUp);
      track({
        delete() {
          uv_viewport.removeEventListener("mousedown", handleMouseDown);
          uv_viewport.removeEventListener("mouseup", handleMouseUp);
        }
      });
      return true;
    }
    if (uvPanel.node && initializeClickHandler()) return;
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (uvPanel.node && initializeClickHandler()) {
        clearInterval(interval);
      } else if (attempts >= 50) {
        clearInterval(interval);
      }
    }, 100);
    track({ delete() {
      clearInterval(interval);
    } });
  }

  // src/validation.ts
  var MAX_NODE_COUNT = 255;
  function getNodeCount() {
    let node_count = 0;
    for (let group of Group.all) {
      if (group.export == false) return;
      if (Collection.all.find((c) => c.contains(group))) continue;
      node_count++;
      let main_shape = getMainShape(group);
      for (let cube of group.children) {
        if (cube instanceof Cube == false || cube.export == false) continue;
        if (cube == main_shape) continue;
        node_count++;
      }
    }
    return node_count;
  }
  function setupChecks() {
    let check = new ValidatorCheck("hytale_node_count", {
      update_triggers: ["update_selection"],
      condition: { formats: FORMAT_IDS },
      run() {
        let node_count = getNodeCount();
        if (node_count > MAX_NODE_COUNT) {
          this.fail({
            message: `The model contains ${node_count} nodes, which exceeds the maximum of ${MAX_NODE_COUNT} that Hytale will display.`
          });
        }
      }
    });
    check.name = "Hytale Node Count";
    track(check);
    let uv_check = new ValidatorCheck("hytale_uv_size", {
      update_triggers: ["update_selection"],
      condition: { formats: FORMAT_IDS },
      run() {
        for (let texture of Texture.all) {
          if (texture.uv_width != texture.width || texture.uv_height != texture.height) {
            this.fail({
              message: `The texture ${texture.name} has a resolution (${texture.width}x${texture.height}) that does not match its UV size (${texture.uv_width}x${texture.uv_height}). Ensure that your pixel density is 64 for characters and 32 for props.`,
              buttons: [
                {
                  name: "Fix UV Size",
                  icon: "build",
                  click() {
                    updateUVSize(texture);
                    texture.select();
                  }
                }
              ]
            });
          }
        }
      }
    });
    uv_check.name = "Hytale UV Size";
    track(uv_check);
    let listener = Blockbench.on("display_model_stats", ({ stats }) => {
      if (!FORMAT_IDS.includes(Format.id)) return;
      let node_count = getNodeCount();
      stats.splice(0, 0, { label: "Nodes", value: node_count + " / " + MAX_NODE_COUNT });
    });
    track(listener);
  }

  // package.json
  var package_default = {
    name: "hytale-blockbench-plugin",
    version: "0.8.1",
    description: "Create models and animations for Hytale",
    main: "src/plugin.ts",
    type: "module",
    scripts: {
      build: "esbuild src/plugin.ts --bundle --loader:.png=dataurl --outfile=dist/hytale_plugin.js",
      dev: "esbuild src/plugin.ts --bundle --loader:.png=dataurl --outfile=dist/hytale_plugin.js --watch"
    },
    author: "JannisX11, Kanno",
    license: "GPL-3.0",
    dependencies: {
      "blockbench-types": "^5.1.0-beta.0-next.4"
    },
    devDependencies: {
      esbuild: "^0.25.9"
    }
  };

  // src/photoshop_copy_paste.ts
  function setupPhotoshopTools() {
    let setting = new Setting("copy_paste_magenta_alpha", {
      name: "Copy-Paste with Magenta Alpha",
      description: "Copy image selections with magenta background and remove magenta when pasting to help transfer transparency to Photoshop",
      type: "toggle",
      category: "paint",
      value: false
    });
    track(setting);
    let shared_copy = SharedActions.add("copy", {
      subject: "image_content_photoshop",
      condition: () => Prop.active_panel == "uv" && Modes.paint && Texture.getDefault() && FORMAT_IDS.includes(Format.id) && setting.value == true,
      priority: 2,
      run(event, cut) {
        let texture = Texture.getDefault();
        let selection = texture.selection;
        let { canvas, ctx, offset } = texture.getActiveCanvas();
        if (selection.override != null) {
          Clipbench.image = {
            x: offset[0],
            y: offset[1],
            frame: texture.currentFrame,
            data: ""
          };
        } else {
          let rect = selection.getBoundingRect();
          let copy_canvas = document.createElement("canvas");
          let copy_ctx = copy_canvas.getContext("2d");
          copy_canvas.width = rect.width;
          copy_canvas.height = rect.height;
          selection.maskCanvas(copy_ctx, [rect.start_x, rect.start_y]);
          copy_ctx.drawImage(canvas, -rect.start_x + offset[0], -rect.start_y + offset[1]);
          Clipbench.image = {
            x: rect.start_x,
            y: rect.start_y,
            frame: texture.currentFrame,
            data: ""
          };
          canvas = copy_canvas;
        }
        let canvas_copy_magenta = document.createElement("canvas");
        let copy_ctx_magenta = canvas_copy_magenta.getContext("2d");
        canvas_copy_magenta.width = canvas.width;
        canvas_copy_magenta.height = canvas.height;
        copy_ctx_magenta.fillStyle = "#ff00ff";
        copy_ctx_magenta.fillRect(0, 0, canvas.width, canvas.height);
        copy_ctx_magenta.drawImage(canvas, 0, 0);
        canvas = canvas_copy_magenta;
        Clipbench.image.data = canvas.toDataURL("image/png", 1);
        if (isApp) {
          let clipboard = requireNativeModule("clipboard");
          let img = nativeImage.createFromDataURL(Clipbench.image.data);
          clipboard.writeImage(img);
        } else {
          canvas.toBlob((blob) => {
            navigator.clipboard.write([
              new ClipboardItem({
                [blob.type]: blob
              })
            ]);
          });
        }
        if (cut) {
          SharedActions.runSpecific("delete", "image_content", event, { message: "Cut texture selection" });
        }
      }
    });
    track(shared_copy);
    let shared_paste = SharedActions.add("paste", {
      subject: "image_content_photoshop",
      condition: () => Prop.active_panel == "uv" && Modes.paint && Texture.getDefault() && FORMAT_IDS.includes(Format.id) && setting.value == true,
      priority: 2,
      run(event) {
        let texture = Texture.getDefault();
        async function loadFromDataUrl(data_url) {
          let frame = new CanvasFrame();
          await frame.loadFromURL(data_url);
          Undo.initEdit({ textures: [texture], bitmap: true });
          if (!texture.layers_enabled) {
            texture.flags.add("temporary_layers");
            texture.activateLayers(false);
          }
          let offset;
          if (Clipbench.image) {
            offset = [Math.clamp(Clipbench.image.x, 0, texture.width), Math.clamp(Clipbench.image.y, 0, texture.height)];
            offset[0] = Math.clamp(offset[0], 0, texture.width - frame.width);
            offset[1] = Math.clamp(offset[1], 0, texture.height - frame.height);
          }
          let old_frame = Clipbench.image?.frame || 0;
          if (old_frame || texture.currentFrame) {
            offset[1] += texture.display_height * ((texture.currentFrame || 0) - old_frame);
          }
          let layer = new TextureLayer({ name: "pasted", offset }, texture);
          let image_data = frame.ctx.getImageData(0, 0, frame.width, frame.height);
          for (let i = 0; i < image_data.data.length; i += 4) {
            if (image_data.data[i] == 255 && image_data.data[i + 1] == 0 && image_data.data[i + 2] == 255) {
              image_data.data[i + 0] = 0;
              image_data.data[i + 1] = 0;
              image_data.data[i + 2] = 0;
              image_data.data[i + 3] = 0;
            }
          }
          layer.setSize(frame.width, frame.height);
          layer.ctx.putImageData(image_data, 0, 0);
          if (!offset) layer.center();
          layer.addForEditing();
          layer.setLimbo();
          texture.updateChangesAfterEdit();
          Undo.finishEdit("Paste into texture");
          if (Toolbox.selected.id != "selection_tool") BarItems.move_layer_tool.select();
          updateInterfacePanels();
          BARS.updateConditions();
        }
        if (isApp) {
          let clipboard = requireNativeModule("clipboard");
          var image = clipboard.readImage().toDataURL();
          loadFromDataUrl(image);
        } else {
          navigator.clipboard.read().then((content) => {
            if (content && content[0] && content[0].types.includes("image/png")) {
              content[0].getType("image/png").then((blob) => {
                let url = URL.createObjectURL(blob);
                loadFromDataUrl(url);
              });
            }
          }).catch(() => {
          });
        }
      }
    });
    track(shared_paste);
  }

  // src/pivot_marker.ts
  var ThickLineAxisHelper = class ThickLineAxisHelper2 extends THREE.LineSegments {
    constructor(size = 1) {
      let a = 0.04, b = 0.025;
      let vertices = [
        0,
        a,
        0,
        size,
        a,
        0,
        0,
        0,
        b,
        size,
        0,
        b,
        0,
        0,
        -b,
        size,
        0,
        -b,
        0,
        0,
        a,
        0,
        size,
        a,
        b,
        0,
        0,
        b,
        size,
        0,
        -b,
        0,
        0,
        -b,
        size,
        0,
        a,
        0,
        0,
        a,
        0,
        size,
        0,
        b,
        0,
        0,
        b,
        size,
        0,
        -b,
        0,
        0,
        -b,
        size
      ];
      let geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
      let material = new THREE.LineBasicMaterial({ vertexColors: true });
      super(geometry, material);
      this.updateColors();
      material.transparent = true;
      material.depthTest = false;
      this.renderOrder = 800;
    }
    updateColors() {
      let colors = [
        ...gizmo_colors.r.toArray(),
        ...gizmo_colors.r.toArray(),
        ...gizmo_colors.r.toArray(),
        ...gizmo_colors.r.toArray(),
        ...gizmo_colors.r.toArray(),
        ...gizmo_colors.r.toArray(),
        ...gizmo_colors.g.toArray(),
        ...gizmo_colors.g.toArray(),
        ...gizmo_colors.g.toArray(),
        ...gizmo_colors.g.toArray(),
        ...gizmo_colors.g.toArray(),
        ...gizmo_colors.g.toArray(),
        ...gizmo_colors.b.toArray(),
        ...gizmo_colors.b.toArray(),
        ...gizmo_colors.b.toArray(),
        ...gizmo_colors.b.toArray(),
        ...gizmo_colors.b.toArray(),
        ...gizmo_colors.b.toArray()
      ];
      this.geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    }
  };
  ThickLineAxisHelper.prototype.constructor = ThickLineAxisHelper;
  var CustomPivotMarker = class {
    original_helpers;
    constructor() {
      this.original_helpers = Canvas.pivot_marker.children.slice();
      let [helper1, helper2] = this.original_helpers;
      let helper1_new = new ThickLineAxisHelper(1);
      let helper2_new = new ThickLineAxisHelper(1);
      helper1_new.rotation.copy(helper1.rotation);
      helper2_new.rotation.copy(helper2.rotation);
      Canvas.pivot_marker.children.empty();
      Canvas.pivot_marker.add(helper1_new, helper2_new);
    }
    delete() {
      Canvas.pivot_marker.children.empty();
      Canvas.pivot_marker.add(...this.original_helpers);
    }
  };
  var GroupPivotIndicator = class {
    dot;
    listener;
    cameraListener;
    setting;
    constructor() {
      this.setting = new Setting("show_group_pivot_indicator", {
        name: "Show Group Pivot Indicator",
        description: "Show a dot in Edit mode indicating the rotation pivot point for animations",
        category: "preview",
        type: "toggle",
        value: true
      });
      let geometry = new THREE.SphereGeometry(0.65, 12, 12);
      let material = new THREE.MeshBasicMaterial({
        color: this.getAccentColor(),
        transparent: true,
        opacity: 0.9,
        depthTest: false
      });
      this.dot = new THREE.Mesh(geometry, material);
      this.dot.renderOrder = 900;
      this.dot.visible = false;
      Canvas.scene.add(this.dot);
      Canvas.gizmos.push(this.dot);
      this.listener = Blockbench.on("update_selection", () => this.update());
      this.cameraListener = Blockbench.on("update_camera_position", () => this.updateScale());
      this.update();
    }
    updateScale() {
      if (!this.dot.visible) return;
      let scale = Preview.selected.calculateControlScale(this.dot.position) || 0.8;
      this.dot.scale.setScalar(scale * 0.7);
    }
    getAccentColor() {
      let cssColor = getComputedStyle(document.body).getPropertyValue("--color-accent").trim();
      return new THREE.Color(cssColor || "#3e90ff");
    }
    update() {
      if (!this.setting.value) {
        this.dot.visible = false;
        return;
      }
      if (Modes.paint) {
        this.dot.visible = false;
        return;
      }
      let group = this.getRelevantGroup();
      if (!group) {
        this.dot.visible = false;
        return;
      }
      this.dot.material.color.copy(this.getAccentColor());
      let mesh = group.mesh;
      if (mesh) {
        let worldPos = new THREE.Vector3();
        mesh.getWorldPosition(worldPos);
        this.dot.position.copy(worldPos);
        this.dot.visible = true;
        this.updateScale();
      } else {
        this.dot.visible = false;
      }
    }
    getRelevantGroup() {
      let sel = Outliner.selected[0];
      if (!sel) return null;
      while (sel.parent instanceof OutlinerNode && sel.parent.selected) {
        sel = sel.parent;
      }
      if (sel instanceof Group) {
        return sel;
      }
      if (sel.parent instanceof Group) {
        return sel.parent;
      }
      return null;
    }
    delete() {
      Canvas.scene.remove(this.dot);
      this.dot.geometry.dispose();
      this.dot.material.dispose();
      this.listener.delete();
      this.cameraListener.delete();
      this.setting.delete();
    }
  };

  // src/outliner_filter.ts
  var HIDDEN_CLASS = "hytale_attachment_hidden";
  var attachmentsHidden = false;
  var visibilityUpdatePending = false;
  function scheduleVisibilityUpdate() {
    if (!attachmentsHidden || visibilityUpdatePending) return;
    visibilityUpdatePending = true;
    requestAnimationFrame(() => {
      visibilityUpdatePending = false;
      applyOutlinerVisibility();
    });
  }
  function getAttachmentUUIDs() {
    let uuids = [];
    if (!Collection.all?.length) return uuids;
    for (let collection of Collection.all) {
      for (let child of collection.getChildren()) {
        uuids.push(child.uuid);
        if ("children" in child && Array.isArray(child.children)) {
          collectChildUUIDs(child, uuids);
        }
      }
    }
    return uuids;
  }
  function collectChildUUIDs(parent, uuids) {
    for (let child of parent.children) {
      if (child instanceof OutlinerNode) {
        uuids.push(child.uuid);
        if ("children" in child && Array.isArray(child.children)) {
          collectChildUUIDs(child, uuids);
        }
      }
    }
  }
  function applyOutlinerVisibility() {
    if (!isHytaleFormat()) return;
    const outlinerNode = Panels.outliner?.node;
    if (!outlinerNode) return;
    if (!attachmentsHidden) {
      outlinerNode.querySelectorAll(`.${HIDDEN_CLASS}`).forEach((el) => {
        el.classList.remove(HIDDEN_CLASS);
      });
      for (let collection of Collection.all ?? []) {
        for (let child of collection.getChildren()) {
          unlockRecursive(child);
        }
      }
      return;
    }
    const uuids = getAttachmentUUIDs();
    for (let uuid of uuids) {
      let node = outlinerNode.querySelector(`[id="${uuid}"]`);
      if (node) {
        node.classList.add(HIDDEN_CLASS);
      }
      let element = OutlinerNode.uuids[uuid];
      if (element) {
        element.locked = true;
      }
    }
  }
  function unlockRecursive(node) {
    node.locked = false;
    if ("children" in node && Array.isArray(node.children)) {
      for (let child of node.children) {
        if (child instanceof OutlinerNode) {
          unlockRecursive(child);
        }
      }
    }
  }
  function setupOutlinerFilter() {
    let style = Blockbench.addCSS(`
		.outliner_node.${HIDDEN_CLASS} {
			display: none !important;
		}
		/* Lock overlay on attachment toggle when active */
		.tool[toolbar_item="toggle_attachment_editing"].enabled .fa-paperclip::after {
			content: "lock";
			font-family: "Material Icons";
			font-size: 14px;
			position: absolute;
			bottom: -1px;
			right: -3px;
			text-shadow:
				-1.5px -1.5px 0 var(--color-accent),
				1.5px -1.5px 0 var(--color-accent),
				-1.5px 1.5px 0 var(--color-accent),
				1.5px 1.5px 0 var(--color-accent),
				0px -1.5px 0 var(--color-accent),
				0px 1.5px 0 var(--color-accent),
				-1.5px 0px 0 var(--color-accent),
				1.5px 0px 0 var(--color-accent);
		}
		.tool[toolbar_item="toggle_attachment_editing"] .fa-paperclip {
			position: relative;
		}
	`);
    StateMemory.init("hytale_attachments_hidden", "boolean");
    attachmentsHidden = StateMemory.get("hytale_attachments_hidden") ?? false;
    let toggle = new Toggle("toggle_attachment_editing", {
      name: "Toggle Attachment Editing",
      description: "Lock or unlock attachment elements for editing",
      icon: "fa-paperclip",
      category: "view",
      condition: { formats: FORMAT_IDS },
      default: attachmentsHidden,
      onChange(value) {
        attachmentsHidden = value;
        StateMemory.set("hytale_attachments_hidden", value);
        applyOutlinerVisibility();
      }
    });
    let outlinerPanel = Panels.outliner;
    if (outlinerPanel && outlinerPanel.toolbars.length > 0) {
      outlinerPanel.toolbars[0].add(toggle, -1);
    }
    let hookFinishedEdit = Blockbench.on("finished_edit", scheduleVisibilityUpdate);
    let hookSelectMode = Blockbench.on("select_mode", scheduleVisibilityUpdate);
    let hookSelection = Blockbench.on("update_selection", scheduleVisibilityUpdate);
    if (attachmentsHidden) {
      setTimeout(applyOutlinerVisibility, 100);
    }
    track(toggle, hookFinishedEdit, hookSelectMode, hookSelection, style, {
      delete() {
        Panels.outliner?.node?.querySelectorAll(`.${HIDDEN_CLASS}`).forEach((el) => {
          el.classList.remove(HIDDEN_CLASS);
        });
      }
    });
  }

  // src/uv_outline.ts
  var UV_OUTLINE_CSS = `
body.hytale-format[mode=edit] #uv_frame .uv_resize_corner,
body.hytale-format[mode=edit] #uv_frame .uv_resize_side,
body.hytale-format[mode=edit] #uv_frame #uv_scale_handle,
body.hytale-format[mode=edit] #uv_frame #uv_selection_frame {
    display: none;
}

body.hytale-format #uv_frame.overlay_mode {
    --uv-line-width: 2px;
}
body.hytale-format #uv_frame.overlay_mode .cube_uv_face {
    border-color: transparent !important;
}
body.hytale-format #uv_frame.overlay_mode .cube_uv_face::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border: 1px solid var(--color-text);
    pointer-events: none;
}
body.hytale-format #uv_frame.overlay_mode .cube_uv_face.selected:not(.unselected) {
    outline: none;
}

body.hytale-uv-outline-only #uv_frame {
    --color-uv-background: transparent;
    --color-uv-background-hover: transparent;
}
body.hytale-uv-outline-only #uv_frame .cube_uv_face {
    border-color: transparent !important;
}
body.hytale-uv-outline-only #uv_frame .cube_uv_face::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border: 1px solid var(--color-text);
    pointer-events: none;
}
body.hytale-uv-outline-only #uv_frame .cube_uv_face:hover::before {
    border-color: var(--color-accent);
}
body.hytale-uv-outline-only #uv_frame:not(.overlay_mode) .cube_uv_face.selected:not(.unselected)::before {
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-width: 2px;
    border-color: var(--color-accent);
}
body.hytale-uv-outline-only #uv_frame .mesh_uv_face polygon {
    stroke-width: 1px;
}
body.hytale-uv-outline-only #uv_frame:not(.overlay_mode) .mesh_uv_face.selected polygon {
    stroke-width: 2px;
}
body.hytale-uv-outline-only #uv_frame .selection_rectangle {
    background-color: transparent;
}
`;
  function updateHytaleFormatClass() {
    document.body.classList.toggle("hytale-format", isHytaleFormat());
  }
  function setupUVOutline() {
    const style = Blockbench.addCSS(UV_OUTLINE_CSS);
    track(style);
    const setting = new Setting("uv_outline_only", {
      name: "UV Outline Only",
      description: "Show only outlines for UV faces instead of filled overlays",
      category: "edit",
      value: false,
      onChange(value) {
        document.body.classList.toggle("hytale-uv-outline-only", value);
      }
    });
    track(setting);
    const selectProjectListener = Blockbench.on("select_project", updateHytaleFormatClass);
    track(selectProjectListener);
    document.body.classList.toggle("hytale-uv-outline-only", settings.uv_outline_only?.value ?? true);
    updateHytaleFormatClass();
  }

  // src/temp_fixes.js
  function setupTempFixes() {
    if (!Blockbench.isOlderThan("5.0.7")) return;
    Cube.prototype.mapAutoUV = function(options = {}) {
      if (this.box_uv) return;
      var scope = this;
      if (scope.autouv === 2) {
        var all_faces = ["north", "south", "west", "east", "up", "down"];
        let offset = Format.centered_grid ? 8 : 0;
        all_faces.forEach(function(side) {
          var uv = scope.faces[side].uv.slice();
          let texture = scope.faces[side].getTexture();
          let uv_width = Project.getUVWidth(texture);
          let uv_height = Project.getUVHeight(texture);
          switch (side) {
            case "north":
              uv = [
                uv_width - (scope.to[0] + offset),
                uv_height - scope.to[1],
                uv_width - (scope.from[0] + offset),
                uv_height - scope.from[1]
              ];
              break;
            case "south":
              uv = [
                scope.from[0] + offset,
                uv_height - scope.to[1],
                scope.to[0] + offset,
                uv_height - scope.from[1]
              ];
              break;
            case "west":
              uv = [
                scope.from[2] + offset,
                uv_height - scope.to[1],
                scope.to[2] + offset,
                uv_height - scope.from[1]
              ];
              break;
            case "east":
              uv = [
                uv_width - (scope.to[2] + offset),
                uv_height - scope.to[1],
                uv_width - (scope.from[2] + offset),
                uv_height - scope.from[1]
              ];
              break;
            case "up":
              uv = [
                scope.from[0] + offset,
                scope.from[2] + offset,
                scope.to[0] + offset,
                scope.to[2] + offset
              ];
              break;
            case "down":
              uv = [
                scope.from[0] + offset,
                uv_height - (scope.to[2] + offset),
                scope.to[0] + offset,
                uv_height - (scope.from[2] + offset)
              ];
              break;
          }
          if (Math.max(uv[0], uv[2]) > uv_width) {
            let offset2 = Math.max(uv[0], uv[2]) - uv_width;
            uv[0] -= offset2;
            uv[2] -= offset2;
          }
          if (Math.min(uv[0], uv[2]) < 0) {
            let offset2 = Math.min(uv[0], uv[2]);
            uv[0] = Math.clamp(uv[0] - offset2, 0, uv_width);
            uv[2] = Math.clamp(uv[2] - offset2, 0, uv_width);
          }
          if (Math.max(uv[1], uv[3]) > uv_height) {
            let offset2 = Math.max(uv[1], uv[3]) - uv_height;
            uv[1] -= offset2;
            uv[3] -= offset2;
          }
          if (Math.min(uv[1], uv[3]) < 0) {
            let offset2 = Math.min(uv[1], uv[3]);
            uv[1] = Math.clamp(uv[1] - offset2, 0, uv_height);
            uv[3] = Math.clamp(uv[3] - offset2, 0, uv_height);
          }
          scope.faces[side].uv = uv;
        });
        scope.preview_controller.updateUV(scope);
      } else if (scope.autouv === 1) {
        let calcAutoUV = function(fkey, dimension_axes, world_directions) {
          let size = dimension_axes.map((axis) => scope.size(axis));
          let face = scope.faces[fkey];
          size[0] = Math.abs(size[0]);
          size[1] = Math.abs(size[1]);
          let sx = face.uv[0];
          let sy = face.uv[1];
          let previous_size = face.uv_size;
          let rot = face.rotation;
          let texture = face.getTexture();
          let uv_width = Project.getUVWidth(texture);
          let uv_height = Project.getUVHeight(texture);
          if (rot === 90 || rot === 270) {
            size.reverse();
            dimension_axes.reverse();
            world_directions.reverse();
          }
          if (rot == 180) {
            world_directions[0] *= -1;
            world_directions[1] *= -1;
          }
          size[0] = Math.clamp(size[0], -uv_width, uv_width) * (Math.sign(previous_size[0]) || 1);
          size[1] = Math.clamp(size[1], -uv_height, uv_height) * (Math.sign(previous_size[1]) || 1);
          if (options && typeof options.axis == "number") {
            if (options.axis == dimension_axes[0] && options.direction == world_directions[0]) {
              sx += previous_size[0] - size[0];
            }
            if (options.axis == dimension_axes[1] && options.direction == world_directions[1]) {
              sy += previous_size[1] - size[1];
            }
          }
          if (sx < 0) sx = 0;
          if (sy < 0) sy = 0;
          let endx = sx + size[0];
          let endy = sy + size[1];
          if (endx > uv_width) {
            sx = uv_width - (endx - sx);
            endx = uv_width;
          }
          if (endy > uv_height) {
            sy = uv_height - (endy - sy);
            endy = uv_height;
          }
          return [sx, sy, endx, endy];
        };
        scope.faces.north.uv = calcAutoUV("north", [0, 1], [1, 1]);
        scope.faces.east.uv = calcAutoUV("east", [2, 1], [1, 1]);
        scope.faces.south.uv = calcAutoUV("south", [0, 1], [-1, 1]);
        scope.faces.west.uv = calcAutoUV("west", [2, 1], [-1, 1]);
        scope.faces.up.uv = calcAutoUV("up", [0, 2], [-1, -1]);
        scope.faces.down.uv = calcAutoUV("down", [0, 2], [-1, 1]);
        scope.preview_controller.updateUV(scope);
      }
    };
    BarItems.group_elements.click = function() {
      Undo.initEdit({ outliner: true, groups: [] });
      let add_group = Group.first_selected;
      if (!add_group && Outliner.selected.length) {
        add_group = Outliner.selected.last();
      }
      let new_name = add_group?.name;
      let base_group = new Group({
        origin: add_group ? add_group.origin : void 0,
        name: ["cube", "mesh"].includes(new_name) ? void 0 : new_name
      });
      base_group.sortInBefore(add_group);
      base_group.isOpen = true;
      base_group.init();
      if (base_group.getTypeBehavior("unique_name")) {
        base_group.createUniqueName();
      }
      Outliner.selected.concat(Group.multi_selected).forEach((s) => {
        if (s.parent?.selected) return;
        s.addTo(base_group);
        s.preview_controller.updateTransform(s);
      });
      base_group.select();
      Undo.finishEdit("Add group", { outliner: true, groups: [base_group] });
      Vue.nextTick(function() {
        updateSelection();
        if (settings.create_rename.value) {
          base_group.rename();
        }
        base_group.showInOutliner();
        Blockbench.dispatchEvent("group_elements", { object: base_group });
      });
    };
  }

  // src/references/player.json
  var player_default = {
    texture_size: [256, 128],
    cubes: [
      {
        position: [-12.74, 45.10128, -8.82],
        size: [25.48, 11.79744, 17.64],
        faces: {
          north: { uv: [68, 115, 94, 127] },
          east: { uv: [50, 115, 68, 127] },
          south: { uv: [24, 115, 50, 127] },
          west: { uv: [6, 115, 24, 127] },
          up: { uv: [216, 83, 242, 101] },
          down: { uv: [216, 101, 242, 119] }
        }
      },
      {
        position: [-13, 55, -9],
        size: [26, 16, 18],
        faces: {
          north: { uv: [68, 99, 94, 115] },
          east: { uv: [50, 99, 68, 115] },
          south: { uv: [24, 99, 50, 115] },
          west: { uv: [6, 99, 24, 115] },
          up: { uv: [52, 58, 78, 76] },
          down: { uv: [52, 58, 78, 76] }
        }
      },
      {
        position: [-13.72, 68.22, -9.5],
        size: [27.44, 21.56, 19],
        faces: {
          north: { uv: [71, 77, 99, 99] },
          east: { uv: [51, 77, 71, 99] },
          south: { uv: [23, 77, 51, 99] },
          west: { uv: [3, 77, 23, 99] },
          up: { uv: [23, 57, 51, 77] },
          down: { uv: [51, 57, 79, 77] }
        }
      },
      {
        position: [-15, 93, -13],
        size: [30, 28, 28],
        faces: {
          north: { uv: [86, 28, 116, 56] },
          east: { uv: [58, 28, 86, 56] },
          south: { uv: [28, 28, 58, 56] },
          west: { uv: [0, 28, 28, 56] },
          up: { uv: [28, 0, 58, 28] },
          down: { uv: [58, 0, 88, 28] }
        }
      },
      {
        position: [-7.5, 85.04378, -5.5],
        size: [15, 17.91244, 11],
        faces: {
          north: { uv: [106, 63, 121, 76] },
          east: { uv: [95, 63, 106, 76] },
          south: { uv: [80, 63, 95, 76] },
          west: { uv: [95, 63, 106, 76] },
          down: { uv: [30, 63, 45, 74] }
        }
      },
      {
        position: [-20.10255, 68.71157, -7.1452],
        size: [7.84, 20, 12],
        origin: [-16.18255, 78.71157, -1.1452],
        rotation: [0.6131, -6.9732, -5.0374],
        faces: {
          north: { uv: [149, 12, 157, 32] },
          east: { uv: [137, 12, 149, 32] },
          south: { uv: [129, 12, 137, 32] },
          west: { uv: [117, 12, 129, 32] },
          up: { uv: [129, 12, 117, 4] },
          down: { uv: [137, 0, 145, 12] }
        }
      },
      {
        position: [-21.73964, 52.77981, -7.33636],
        size: [8, 16, 12],
        origin: [-17.73964, 60.77981, -1.33636],
        rotation: [0.6131, -6.9732, -5.0374],
        faces: {
          north: { uv: [149, 32, 157, 48] },
          east: { uv: [137, 32, 149, 48] },
          south: { uv: [129, 32, 137, 48] },
          west: { uv: [117, 32, 129, 48] },
          up: { uv: [149, 26, 157, 38] },
          down: { uv: [129, 26, 137, 38] }
        }
      },
      {
        position: [-23.86423, 41.82928, -8.47444],
        size: [10, 12, 14],
        origin: [-18.86423, 47.82928, -1.47444],
        rotation: [0.6131, -6.9732, -5.0374],
        faces: {
          north: { uv: [165, 48, 155, 60] },
          east: { uv: [141, 48, 155, 60] },
          south: { uv: [131, 48, 141, 60] },
          west: { uv: [117, 48, 131, 60] },
          up: { uv: [118, 33, 128, 47] },
          down: { uv: [155, 70, 141, 60] }
        }
      },
      {
        position: [20.10255, 68.71157, -7.1452],
        size: [-7.84, 20, 12],
        origin: [16.18255, 78.71157, -1.1452],
        rotation: [0.6131, 6.9732, 5.0374],
        faces: {
          north: { uv: [149, 12, 157, 32] },
          east: { uv: [137, 12, 149, 32] },
          south: { uv: [129, 12, 137, 32] },
          west: { uv: [117, 12, 129, 32] },
          up: { uv: [129, 12, 117, 4] },
          down: { uv: [137, 0, 145, 12] }
        }
      },
      {
        position: [21.73964, 52.77982, -7.33636],
        size: [-8, 16, 12],
        origin: [17.73964, 60.77982, -1.33636],
        rotation: [0.6131, 6.9732, 5.0374],
        faces: {
          north: { uv: [149, 32, 157, 48] },
          east: { uv: [137, 32, 149, 48] },
          south: { uv: [129, 32, 137, 48] },
          west: { uv: [117, 32, 129, 48] },
          up: { uv: [149, 26, 157, 38] },
          down: { uv: [129, 26, 137, 38] }
        }
      },
      {
        position: [23.86423, 41.82928, -8.47444],
        size: [-10, 12, 14],
        origin: [18.86423, 47.82928, -1.47444],
        rotation: [0.6131, 6.9732, 5.0374],
        faces: {
          north: { uv: [165, 48, 155, 60] },
          east: { uv: [141, 48, 155, 60] },
          south: { uv: [131, 48, 141, 60] },
          west: { uv: [117, 48, 131, 60] },
          up: { uv: [118, 33, 128, 47] },
          down: { uv: [155, 70, 141, 60] }
        }
      },
      {
        position: [-12.40001, 29, -5],
        size: [9.8, 20, 12],
        origin: [-7.50001, 39, 1],
        rotation: [0, -2.1999, 0],
        faces: {
          north: { uv: [155, 77, 145, 97] },
          east: { uv: [133, 77, 145, 97] },
          south: { uv: [123, 77, 133, 97] },
          west: { uv: [111, 77, 123, 97] },
          down: { uv: [123, 93, 133, 105] }
        }
      },
      {
        position: [-12.50001, 5, -5],
        size: [10, 24, 12],
        origin: [-7.50001, 17, 1],
        rotation: [0, -2.1999, 0],
        faces: {
          north: { uv: [145, 97, 155, 121] },
          east: { uv: [133, 97, 145, 121] },
          south: { uv: [123, 97, 133, 121] },
          west: { uv: [111, 97, 123, 121] },
          up: { uv: [123, 85, 133, 97] },
          down: { uv: [221, 37, 209, 27] }
        }
      },
      {
        position: [-14.22678, 0.2, -6.50147],
        size: [13.3, 7.6, 19],
        origin: [-7.57678, 4, 2.99853],
        rotation: [0, -2.1999, 0],
        faces: {
          north: { uv: [215, 55, 223, 41] },
          east: { uv: [223, 33, 243, 41] },
          south: { uv: [251, 55, 243, 41] },
          west: { uv: [223, 55, 243, 63] },
          up: { uv: [243, 55, 223, 41] },
          down: { uv: [223, 77, 243, 63] }
        }
      },
      {
        position: [12.4, 29, -5],
        size: [-9.8, 20, 12],
        origin: [7.5, 39, 1],
        rotation: [0, 2.1999, 0],
        faces: {
          north: { uv: [190, 77, 200, 97] },
          east: { uv: [178, 77, 190, 97] },
          south: { uv: [168, 77, 178, 97] },
          west: { uv: [156, 77, 168, 97] },
          down: { uv: [168, 105, 178, 93] }
        }
      },
      {
        position: [12.5, 5, -5],
        size: [-10, 24, 12],
        origin: [7.5, 17, 1],
        rotation: [0, 2.1999, 0],
        faces: {
          north: { uv: [190, 97, 200, 121] },
          east: { uv: [178, 97, 190, 121] },
          south: { uv: [178, 97, 168, 121] },
          west: { uv: [156, 97, 168, 121] },
          up: { uv: [178, 86, 168, 98] },
          down: { uv: [221, 37, 209, 27] }
        }
      },
      {
        position: [14.22677, 0.2, -6.50147],
        size: [-13.3, 7.6, 19],
        origin: [7.57677, 4, 2.99853],
        rotation: [0, 2.1999, 0],
        faces: {
          north: { uv: [215, 24, 223, 10] },
          east: { uv: [223, 2, 243, 10] },
          south: { uv: [251, 24, 243, 10] },
          west: { uv: [223, 24, 243, 32] },
          up: { uv: [243, 24, 223, 10] },
          down: { uv: [223, 77, 243, 63] }
        }
      }
    ]
  };

  // src/references/player.png
  var player_default2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAACACAYAAADktbcKAAADDElEQVR4nOzdMW7TUBzH8YfUC3TqkqEbC1eAjYtE4gBRzhHlAJVyChbW9AZMIDEwREKwWOICoCAVqRKlcWw/2/l9PkuntnFTffMS+/19VSpbr9e/ygiapilj2O12L8rMbbfb/z5nq9Vq9seY6qoAsQQARtL3aniz2bReiQkABBOAC9T2leWcVw4ugwBAMAGAYAIAwQQAggkABBMAGMhzV1DW/n3/umJTACCYAND5lart99s7MB0CAMEEAIIJAAQTAAgmABBMACCYAEAwAYBgAgDBBACCCQAEEwAYyHN7HkwFBkYlABBMAKCjOW+Hvqp9r77FYlESPBxn7akw9trThhUABBMACCYAEEwAYCRTuCejAMBIXAgEjEoAIJgAQDABgI7mfPGVAEAwAYBgAgDBBAAG4vbgwKQJAAQTAAgmABBMACCYAEAwAaAcDoc/X2vNazzndBXDEAAIJgAQTAAgmABAMAGAYAIAwQQABjKL24NPYTY5MI5BVwCXfuNRF6wwd94CQDABgGACcIGG/lxnuVye9dZut9t5yzQxAgDBBACCCUBHXSa/PmzDPUWXMxzOVkxT0zRlbAIAwQQAggkABBMACCYAEEwAIJgA0Jor+i6HAEAwAYBgAgDBBACCCQAEE4CObLRhzh798/Y9w6/2jL42u+tOMfUZg22fr1OPp+3f8dSfezy+OT7mcsGsACCYAEAwAYBgAgDBBACCCQAM6PWbd1XujnW/vzvrbIUAQDABgGACAMEEAIIJAAQTAAgmABBMACCYAEAwAYBgAgDBBACCCQAEEwAIJgAQ7FEANpvN3z3FfUwIPk5qrTVZt6+JwLUer3HiTIEVAAQTABjQl0/7MmUCAMEEAIIJAAQTAAgmABBMACCYAEAwAYBgAgDBBACCCQAEEwAIJgAQ7MkAfHj/sfTh+uZnqaH5/rX0odbjhSmwAoBgAgDBBACCCQAM6NuPz5Oe/SgAEOzJOr16+bbzVOCj65vbUkN/ZwFuSw33+ztTgRmdFQAEEwAIJgAQTAAgmABAMJ9EQ7DfAAAA//+uHsCBAAAABklEQVQDADCBnIyfROhlAAAAAElFTkSuQmCC";

  // src/references/default.json
  var default_default = {
    fov: 70,
    preview_models: [
      {
        id: "hytale_default",
        texture: "hytale/default/default.png",
        texture_size: [32, 32],
        prefabs: {
          grass_block: {
            position: [-8, 0, -8],
            size: [16, 16, 16],
            faces: {
              north: { uv: [0, 16, 16, 32] },
              south: { uv: [0, 16, 16, 32] },
              east: { uv: [0, 16, 16, 32] },
              west: { uv: [0, 16, 16, 32] },
              up: { uv: [0, 0, 16, 16] },
              down: { uv: [16, 16, 32, 32] }
            }
          }
        },
        cubes: [
          {
            prefab: "grass_block",
            offset: [0, -1, 0],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [-1, -1, 0],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [1, -1, 1],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [1, -1, 0],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [1, -1, -1],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [0, -1, 1],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [-1, -1, -1],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [0, -1, -1],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [-1, -1, 1],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [2, -1, 0],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [2, -1, 1],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [2, -1, -1],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [-2, -1, -1],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [-2, -1, 0],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [-2, -1, 1],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [0, -1, -2],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [-1, -1, -2],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [1, -1, -2],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [-1, -1, 2],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [1, -1, 2],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [0, -1, 2],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [3, -2, 0],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [3, -2, 1],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [3, -2, -1],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [-3, -2, -1],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [-3, -2, 0],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [-3, -2, 1],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [0, -2, -3],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [-1, -2, -3],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [1, -2, -3],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [-1, -2, 3],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [1, -2, 3],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [0, -2, 3],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [2, -2, -2],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [-2, -2, 2],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [2, -2, 2],
            offset_space: "block"
          },
          {
            prefab: "grass_block",
            offset: [-2, -2, -2],
            offset_space: "block"
          }
        ]
      }
    ]
  };

  // src/references/default/default.png
  var default_default2 = "data:image/png;base64,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";

  // src/preview_scenes.ts
  function setupPreviewScenes() {
    PreviewScene.menu_categories.hytale = {
      _label: "Hytale"
    };
    let base_path = "https://cdn.jsdelivr.net/gh/JannisX11/hytale-blockbench-plugin/src/references/default/";
    default_default.preview_models.forEach((model) => model.texture = default_default2);
    new PreviewScene("hytale_default", {
      ...default_default,
      name: "Hytale",
      category: "hytale",
      cubemap: [
        base_path + "skybox_0.webp",
        base_path + "skybox_1.webp",
        base_path + "skybox_2.webp",
        base_path + "skybox_3.webp",
        base_path + "skybox_4.webp",
        base_path + "skybox_5.webp"
      ]
    });
    let player_model = new PreviewModel("hytale_player", {
      ...player_default,
      texture: player_default2
    });
    ViewOptionsDialog.form_config.hytale_player = {
      label: "Hytale Player",
      type: "checkbox",
      style: "toggle_switch",
      condition: { formats: FORMAT_IDS }
    };
    if (!ViewOptionsDialog.form) {
      ViewOptionsDialog.build();
    } else {
      ViewOptionsDialog.form.buildForm();
    }
    ViewOptionsDialog.form.on("change", (arg) => {
      if (arg.result.hytale_player) {
        player_model.enable();
        updateSizes();
      } else {
        player_model.disable();
      }
    });
    function updateSizes() {
      let block_size = Format?.block_size ?? 64;
      player_model.model_3d.scale.set(block_size / 64, block_size / 64, block_size / 64);
      player_model.model_3d.position.x = -block_size;
      let model = PreviewModel.models.hytale_default;
      model.model_3d.scale.set(block_size / 16, block_size / 16, block_size / 16);
    }
    track(Blockbench.on("select_format", updateSizes));
  }

  // src/alt_duplicate.ts
  function setupAltDuplicate() {
    const keybindItem = new KeybindItem("hytale_duplicate_drag_modifier", {
      name: "Duplicate While Dragging",
      description: "Hold this key while dragging the gizmo to duplicate",
      keybind: new Keybind({ key: 18 }),
      category: "edit"
    });
    track(keybindItem);
    let isDragging = false;
    let modifierWasPressed = false;
    let isCombinedUndoActive = false;
    let combinedUndoCubesBefore = 0;
    let combinedUndoGroups = [];
    let originalInitEdit = null;
    let originalFinishEdit = null;
    function isModifierPressed(event) {
      const kb = keybindItem.keybind;
      if (kb.key === 18 || kb.alt) return event.altKey || Pressing.overrides.alt;
      if (kb.key === 17 || kb.ctrl) return event.ctrlKey || Pressing.overrides.ctrl;
      if (kb.key === 16 || kb.shift) return event.shiftKey || Pressing.overrides.shift;
      if (kb.key === 91 || kb.ctrl) return event.metaKey || Pressing.overrides.ctrl;
    }
    function isModifierKey(event) {
      const kb = keybindItem.keybind;
      return event.keyCode === kb.key || event.key === "Alt" && (kb.key === 18 || kb.alt) || event.key === "Control" && (kb.key === 17 || kb.ctrl) || event.key === "Shift" && (kb.key === 16 || kb.shift);
    }
    function duplicateGroups() {
      const allNewGroups = [];
      const oldSelectedGroups = Group.multi_selected.slice();
      Group.multi_selected.empty();
      for (const group of oldSelectedGroups) {
        group.selected = false;
        const newGroup = group.duplicate();
        newGroup.forEachChild((g) => allNewGroups.push(g), Group, true);
        newGroup.multiSelect();
        allNewGroups.push(newGroup);
      }
      return allNewGroups;
    }
    function duplicateElements() {
      Outliner.selected.slice().forEach((obj, i) => {
        if (obj.parent instanceof OutlinerElement && obj.parent.selected) return;
        Outliner.selected[i] = obj.duplicate();
      });
    }
    function performDuplicationForCombinedUndo(shouldInitEdit) {
      const hasGroups = Group.all.some((g) => g.selected);
      const hasElements = Outliner.selected.length > 0;
      if (!hasGroups && !hasElements) return false;
      combinedUndoCubesBefore = Outliner.elements.length;
      combinedUndoGroups = [];
      originalInitEdit = Undo.initEdit.bind(Undo);
      originalFinishEdit = Undo.finishEdit.bind(Undo);
      if (shouldInitEdit) {
        originalInitEdit({ outliner: true, elements: [], groups: [], selection: true });
      }
      Undo.initEdit = () => {
      };
      Undo.finishEdit = () => {
      };
      if (hasGroups) {
        combinedUndoGroups = duplicateGroups();
      } else {
        duplicateElements();
      }
      updateSelection();
      isCombinedUndoActive = true;
      return true;
    }
    function finishCombinedUndo() {
      if (!isCombinedUndoActive) return;
      isCombinedUndoActive = false;
      if (originalInitEdit) Undo.initEdit = originalInitEdit;
      if (originalFinishEdit) Undo.finishEdit = originalFinishEdit;
      originalInitEdit = null;
      originalFinishEdit = null;
      Undo.finishEdit("Duplicate and move", {
        outliner: true,
        elements: Outliner.elements.slice(combinedUndoCubesBefore),
        groups: combinedUndoGroups,
        selection: true
      });
    }
    function onMouseDown(event) {
      if (isCombinedUndoActive) return;
      const axis = Transformer?.axis;
      const hasSelection = Outliner.selected.length > 0 || Group.all.some((g) => g.selected);
      const isTransformTool = Toolbox.selected?.id === "move_tool" || Toolbox.selected?.id === "rotate_tool";
      if (!axis || !hasSelection || !isTransformTool) return;
      if (isModifierPressed(event)) {
        event.stopImmediatePropagation();
        if (!performDuplicationForCombinedUndo(true)) return;
        isDragging = true;
        modifierWasPressed = true;
        setTimeout(() => {
          event.target?.dispatchEvent(new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true,
            clientX: event.clientX,
            clientY: event.clientY,
            button: event.button,
            buttons: event.buttons,
            view: window,
            pointerId: 1,
            pointerType: "mouse"
          }));
        }, 0);
      } else {
        isDragging = true;
        modifierWasPressed = false;
      }
    }
    function onKeyDown(event) {
      if (!isDragging || !isModifierKey(event) || modifierWasPressed) return;
      const isTransformTool = Toolbox.selected?.id === "move_tool" || Toolbox.selected?.id === "rotate_tool";
      if (!isTransformTool) return;
      modifierWasPressed = true;
      const shouldInitEdit = isCombinedUndoActive;
      if (isCombinedUndoActive) finishCombinedUndo();
      performDuplicationForCombinedUndo(shouldInitEdit);
    }
    function onKeyUp(event) {
      if (isModifierKey(event)) modifierWasPressed = false;
    }
    function onMouseUp() {
      isDragging = false;
      modifierWasPressed = false;
      if (isCombinedUndoActive) setTimeout(finishCombinedUndo, 0);
    }
    const events = [
      ["pointerdown", onMouseDown],
      ["pointerup", onMouseUp],
      ["mouseup", onMouseUp],
      ["keydown", onKeyDown],
      ["keyup", onKeyUp]
    ];
    events.forEach(([type, handler]) => document.addEventListener(type, handler, true));
    track({ delete: () => events.forEach(([type, handler]) => document.removeEventListener(type, handler, true)) });
  }

  // src/plugin.ts
  BBPlugin.register("hytale_plugin", {
    title: "Hytale Models",
    author: "JannisX11, Kanno",
    icon: "icon.png",
    version: package_default.version,
    description: "Create models and animations for Hytale",
    tags: ["Hytale"],
    variant: "both",
    min_version: "5.0.5",
    await_loading: true,
    has_changelog: true,
    creation_date: "2025-12-22",
    contributes: {
      formats: FORMAT_IDS,
      open_extensions: ["blockymodel"]
    },
    repository: "https://github.com/JannisX11/hytale-blockbench-plugin",
    bug_tracker: "https://github.com/JannisX11/hytale-blockbench-plugin/issues",
    contributors: ["Hedaox"],
    onload() {
      setupFormats();
      setupElements();
      setupAnimation();
      setupAnimationCodec();
      setupAttachments();
      setupOutlinerFilter();
      setupChecks();
      setupPhotoshopTools();
      setupUVCycling();
      setupTextureHandling();
      setupAltDuplicate();
      setupNameOverlap();
      setupUVOutline();
      setupTempFixes();
      setupPreviewScenes();
      let panel_setup_listener;
      function showCollectionPanel() {
        const local_storage_key = "hytale_plugin:collection_panel_setup";
        if (localStorage.getItem(local_storage_key)) return true;
        if (!Modes.edit) return false;
        if (Panels.collections.slot == "hidden") {
          Panels.collections.moveTo("right_bar");
        }
        if (Panels.collections.folded) {
          Panels.collections.fold();
        }
        if (panel_setup_listener) {
          panel_setup_listener.delete();
          panel_setup_listener = void 0;
        }
        localStorage.setItem(local_storage_key, "true");
        return true;
      }
      if (!showCollectionPanel()) {
        panel_setup_listener = Blockbench.on("select_mode", showCollectionPanel);
      }
      let on_finish_edit = Blockbench.on("generate_texture_template", (arg) => {
        for (let element of arg.elements) {
          if (typeof element.autouv != "number") continue;
          element.autouv = 1;
        }
      });
      track(on_finish_edit);
      let pivot_marker = new CustomPivotMarker();
      track(pivot_marker);
      let group_pivot_indicator = new GroupPivotIndicator();
      track(group_pivot_indicator);
    },
    onunload() {
      cleanup();
    }
  });
})();
//! Copyright (C) 2025 Hypixel Studios Canada inc.
//! Licensed under the GNU General Public License, see LICENSE.MD
