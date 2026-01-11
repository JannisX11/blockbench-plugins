(async function () {
  let fs, format, codec, action, config, property, setResolution, textureAdd, model, styles
  const id = "optifine_player_models"
  const name = "OptiFine Player Models"
  const icon = "icon-player"
  const description = "Adds a new format that allows you to create OptiFine player models."
  const links = {
    website: {
      text: "By Ewan Howell",
      link: "https://ewanhowell.com/",
      icon: "language",
      colour: "#33E38E"
    },
    discord: {
      text: "Discord Server",
      link: "https://discord.ewanhowell.com/",
      icon: "fab.fa-discord",
      colour: "#727FFF"
    },
    tutorial: {
      text: "Player Model Tutorial",
      link: "https://youtu.be/0rT-q95dpV0",
      icon: "fab.fa-youtube",
      colour: "#FF4444"
    }
  }
  const groups = [
    {
      name: "head",
      origin: [0, 24, 0]
    },
    {
      name: "body",
      origin: [0, 24, 0]
    },
    {
      name: "leftArm",
      origin: [-5, 22, 0]
    },
    {
      name: "rightArm",
      origin: [5, 22, 0]
    },
    {
      name: "leftLeg",
      origin: [-1.95, 12, 0]
    },
    {
      name: "rightLeg",
      origin: [1.95, 12, 0]
    }
  ]
  const groupNames = groups.map(e => e.name)
  Plugin.register(id, {
    title: name,
    icon: "icon.png",
    author: "Ewan Howell",
    description,
    tags: ["Minecraft: Java Edition", "OptiFine", "Player Models"],
    version: "1.5.1",
    min_version: "5.0.0",
    variant: "both",
    await_loading: true,
    creation_date: "2022-05-29",
    contributes: {
      formats: ["optifine_player_model"]
    },
    website: "https://ewanhowell.com/plugins/optifine-player-models/",
    repository: "https://github.com/ewanhowell5195/blockbenchPlugins/tree/main/optifine_player_models",
    bug_tracker: "https://github.com/ewanhowell5195/blockbenchPlugins/issues?title=[OptiFine Player Models]",
    has_changelog: true,
    async onload() {
      fs = require("fs", {
        message: "This permission is required for exporting your model",
        optional: false
      })

      if (!fs) {
        throw new Error("fs access denied")
      }

      addStyles()
      codec = new Codec("optifine_player_model_codec", {
        name: "OptiFine Player Model",
        extension: "cfg",
        remember: true,
        load_filter: {
          type: "json",
          extensions: ["cfg"],
          condition: file => file && file.models != undefined
        },
        compile() {
          const entityModel = {
            type: "PlayerItem",
            credit: Project.credit || settings.credit.value
          }
          if (Project.use_player_texture) entityModel.usePlayerTexture = true
          entityModel.textureSize = [Project.texture_width, Project.texture_height]
          entityModel.models = []
          Outliner.root.forEach(g => {
            if (g instanceof Group == false || !groupNames.includes(g.name)) return
            if (!settings.export_empty_groups.value && !g.children.find(child => child.export)) return

            if (!g.children.length) return

            //Bone
            const bone = {
              type: "ModelBox",
              attachTo: g.name,
              invertAxis: "xy",
              mirrorTexture: undefined,
              translate: g.origin.slice().V3_multiply(-1)
            }

            if (!g.rotation.allEqual(0)) bone.rotate = g.rotation.slice()
            if (g.mirror_uv) bone.mirrorTexture = "u"

            function populate(p_model, group, depth) {
              if (group.children.length === 0) return
              let mirror_sub

              let child_cubes = group.children.filter(obj => obj.export && obj.type === 'cube')
              let has_different_mirrored_children = !!child_cubes.find(obj => obj.mirror_uv !== child_cubes[0].mirror_uv)

              group.children.forEach(obj => {
                if (!obj.export) return
                if (obj.type === "cube") {

                  let box
                  if (Project.box_uv) {
                    box = new oneLiner()
                  } else {
                    box = {}
                  }
                  const c_size = obj.size()
                  box.coordinates = [
                    obj.from[0],
                    obj.from[1],
                    obj.from[2],
                    c_size[0],
                    c_size[1],
                    c_size[2]
                  ]
                  if (depth === 0) {
                    box.coordinates[0] += p_model.translate[0]
                    box.coordinates[1] += p_model.translate[1]
                    box.coordinates[2] += p_model.translate[2]
                  } else {
                    box.coordinates[0] -= p_model.translate[0]
                    box.coordinates[1] -= p_model.translate[1]
                    box.coordinates[2] -= p_model.translate[2]
                  }
                  if (Project.box_uv) {
                    box.textureOffset = obj.uv_offset
                  } else {
                    for (const face in obj.faces) {
                      if (obj.faces[face].texture !== null) {
                        box[`uv${capitalizeFirstLetter(face)}`] = obj.faces[face].uv
                      }
                    }
                  }

                  if (obj.inflate && typeof obj.inflate === "number") {
                    box.sizeAdd = obj.inflate
                  }

                  if (obj.mirror_uv !== group.mirror_uv && has_different_mirrored_children) {
                    if (!mirror_sub) {
                      mirror_sub = { 
                        invertAxis: "xy",
                        mirrorTexture: "u",
                        boxes: []
                      }
                      if (!p_model.submodels) p_model.submodels = []
                      p_model.submodels.splice(0, 0, mirror_sub)
                    }
                    mirror_sub.boxes.push(box)
                  } else {
                    if (!p_model.boxes) p_model.boxes = []
                    if (obj.mirror_uv !== group.mirror_uv) p_model.mirrorTexture = obj.mirror_uv ? "u" : undefined
                    p_model.boxes.push(box)
                  }
                } else if (obj.type === "group") {

                  const bone = {
                    id: obj.name,
                    invertAxis: "xy",
                    mirrorTexture: undefined,
                    translate: obj.origin.slice()
                  }
                  if (obj.mirror_uv) {
                    bone.mirrorTexture = "u"
                  }
                  if (!obj.rotation.allEqual(0)) {
                    bone.rotate = obj.rotation.slice()
                  }
                  populate(bone, obj, depth+1)
                  if (depth === 0) {
                    bone.translate[0] += p_model.translate[0]
                    bone.translate[1] += p_model.translate[1]
                    bone.translate[2] += p_model.translate[2]
                  } else {
                    bone.translate[0] -= group.origin[0]
                    bone.translate[1] -= group.origin[1]
                    bone.translate[2] -= group.origin[2]
                  }

                  if (!p_model.submodels) p_model.submodels = []
                  p_model.submodels.push(bone)
                } 
              })
            }
            populate(bone, g, 0)

            bone.translate[2] = 0 - bone.translate[2]

            switch (g.name) {
              case "head":
              case "body":
                bone.translate[0] = 0 - bone.translate[0]
                bone.translate[1] = -24 - bone.translate[1]
                break
              case "leftArm":
                bone.translate[0] = 5 - bone.translate[0]
                bone.translate[1] = -22 - bone.translate[1]
                break
              case "rightArm":
                bone.translate[0] = -5 - bone.translate[0]
                bone.translate[1] = -22 - bone.translate[1]
                break
              case "leftLeg":
                bone.translate[0] = 2 - bone.translate[0]
                bone.translate[1] = -12 - bone.translate[1]
                break
              case "rightLeg":
                bone.translate[0] = -2 - bone.translate[0]
                bone.translate[1] = -12 - bone.translate[1]
                break
            }

            entityModel.models.push(bone)
          })

          this.dispatchEvent("compile", {entityModel})

          return autoStringify(entityModel)
        },
        parse(model, path) {
          this.dispatchEvent("parse", {model})
          if (typeof model.credit === "string") Project.credit = model.credit
          if (model.textureSize) {
            Project.texture_width = parseInt(model.textureSize[0]) || 64
            Project.texture_height = parseInt(model.textureSize[1]) || 64
          }
          if (model.usePlayerTexture) Project.use_player_texture = true
          let empty_face = {uv: [0, 0, 0, 0], texture: null}
          if (model.models) {
            model.models.forEach(b => {
              if (typeof b !== "object" || !b.attachTo || !groupNames.includes(b.attachTo)) return
              let subcount = 0

              //Bone
              const group = new Group({
                name: b.attachTo,
                origin: [b.translate[0] ?? 0, b.translate[1] ?? 0, b.translate[2] ?? 0],
                rotation: b.rotate,
                mirror_uv: (b.mirrorTexture && b.mirrorTexture.includes("u"))
              })
              group.origin.V3_multiply(-1)

              group.origin[2] = 0 - group.origin[2]

              switch (b.attachTo) {
                case "head":
                case "body":
                  group.origin[0] = 0 - group.origin[0]
                  group.origin[1] = 24 - group.origin[1]
                  break
                case "leftArm":
                  group.origin[0] = -5 - group.origin[0]
                  group.origin[1] = 22 - group.origin[1]
                  break
                case "rightArm":
                  group.origin[0] = 5 - group.origin[0]
                  group.origin[1] = 22 - group.origin[1]
                  break
                case "leftLeg":
                  group.origin[0] = -2 - group.origin[0]
                  group.origin[1] = 12 - group.origin[1]
                  break
                case "rightLeg":
                  group.origin[0] = 2 - group.origin[0]
                  group.origin[1] = 12 - group.origin[1]
                  break
              }

              function readContent(submodel, p_group, depth) {

                if (submodel.boxes && submodel.boxes.length) {
                  submodel.boxes.forEach(box => {

                    const base_cube = new Cube({
                      name: box.name || p_group.name,
                      autouv: 0,
                      uv_offset: box.textureOffset,
                      inflate: box.sizeAdd,
                      mirror_uv: p_group.mirror_uv
                    })
                    if (box.coordinates) {
                      if (depth === 0) {
                        box.coordinates[0] += p_group.origin[0]
                        box.coordinates[1] += p_group.origin[1]
                        box.coordinates[2] += p_group.origin[2]
                      }
                      base_cube.extend({
                        from: [
                          box.coordinates[0],
                          box.coordinates[1],
                          box.coordinates[2]
                        ],
                        to: [
                          box.coordinates[0] + box.coordinates[3],
                          box.coordinates[1] + box.coordinates[4],
                          box.coordinates[2] + box.coordinates[5]
                        ]
                      })
                    }
                    if (!box.textureOffset && (
                        box.uvNorth
                       || box.uvEast
                       || box.uvSouth
                       || box.uvWest
                       || box.uvUp
                       || box.uvDown
                    )) {
                      Project.box_uv = false
                      base_cube.extend({faces: {
                        north: box.uvNorth ? {uv: box.uvNorth} : empty_face,
                        east:  box.uvEast  ? {uv: box.uvEast}  : empty_face,
                        south: box.uvSouth ? {uv: box.uvSouth} : empty_face,
                        west:  box.uvWest  ? {uv: box.uvWest}  : empty_face,
                        up:    box.uvUp    ? {uv: box.uvUp}    : empty_face,
                        down:  box.uvDown  ? {uv: box.uvDown}  : empty_face,
                      }})
                    }
                    if (p_group.parent !== "root") {
                      for (let i = 0; i < 3; i++) {
                        base_cube.from[i] += p_group.origin[i]
                        base_cube.to[i] += p_group.origin[i]
                      }
                    }
                    base_cube.addTo(p_group).init()
                  })
                }
                if (submodel.submodels && submodel.submodels.length) {
                  submodel.submodels.forEach(subsub => {
                    if (subsub.translate) {
                      subsub.translate[0] += p_group.origin[0]
                      subsub.translate[1] += p_group.origin[1]
                      subsub.translate[2] += p_group.origin[2]
                    }
                    const group = new Group({
                      name: subsub.id || `${b.attachTo}_sub_${subcount}`,
                      origin: subsub.translate || (depth >= 1 ? submodel.translate : undefined),
                      rotation: subsub.rotate,
                      mirror_uv: (subsub.mirrorTexture && subsub.mirrorTexture.includes("u"))
                    })
                    subcount++
                    group.addTo(p_group).init()
                    readContent(subsub, group, depth + 1)
                  })
                }
              }

              group.init().addTo()
              readContent(b, group, 0)
            })
          }
          this.dispatchEvent("parsed", {model})
          Canvas.updateAllBones()

          for (const group of groups) if (!Group.all.find(e => e.name === group.name)) new Group(group).init()
        }
      })
      async function getTexture(path) {
        const texture = await new Promise(fulfill => new THREE.TextureLoader().load(path, fulfill, null, fulfill))
        const canvas = document.createElement("canvas")
        canvas.width = 64
        canvas.height = 64
        const ctx = canvas.getContext("2d")
        ctx.drawImage(texture.image, 0, 0, 32, 16, 0, 0, 32, 16)     //head
        ctx.drawImage(texture.image, 8, 16, 4, 4, 8, 16, 4, 4)       //right leg bottom
        ctx.drawImage(texture.image, 0, 20, 8, 12, 0, 20, 8, 12)     //right leg right front
        ctx.drawImage(texture.image, 12, 20, 4, 20, 12, 20, 4, 20)   //right leg back
        ctx.drawImage(texture.image, 20, 16, 8, 4, 20, 16, 8, 4)     //body top
        ctx.drawImage(texture.image, 20, 20, 8, 12, 20, 20, 8, 12)   //body front
        ctx.drawImage(texture.image, 32, 20, 8, 12, 32, 20, 8, 12)   //body back
        ctx.drawImage(texture.image, 44, 16, 8, 4, 44, 16, 8, 4)     //right arm top bottom
        ctx.drawImage(texture.image, 40, 20, 8, 12, 40, 20, 8, 12)   //right arm right front
        ctx.drawImage(texture.image, 52, 20, 4, 12, 52, 20, 4, 12)   //right arm back
        ctx.drawImage(texture.image, 24, 48, 4, 4, 24, 48, 4, 4)     //left leg bottom
        ctx.drawImage(texture.image, 20, 52, 12, 12, 20, 52, 12, 12) //left leg front left back 
        ctx.drawImage(texture.image, 36, 48, 8, 4, 36, 48, 8, 4)     //left arm bottom
        ctx.drawImage(texture.image, 36, 52, 12, 12, 36, 52, 12, 12) //left arm front left back
        const skin = new THREE.CanvasTexture(canvas)
        const img = new Image()
        img.tex = skin
        img.tex.magFilter = THREE.NearestFilter
        img.tex.minFilter = THREE.NearestFilter
        return skin
      }
      const greyscale = new Uint8Array(4)
      greyscale[0] = 64
      greyscale[1] = 64
      greyscale[2] = 64
      greyscale[3] = 255
      const material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        map: await getTexture("assets/player_skin.png"),
        alphaMap: new THREE.DataTexture(greyscale, 1, 1),
        transparent: true
      })
      model = new THREE.Object3D()
      model.name = "optifine_player_model_guide"
      model.position.x = 0.001
      model.position.y = 0.001
      model.position.z = 0.001
      const cubes = [
        {
          //Head
          "size": [8, 8, 8],
          "pos": [0, 28, 0],
          "origin": [0, 24, 0],
          "north": {"uv": [2.032, 2.032, 3.968, 3.968]},
          "east": {"uv": [0.032, 2.032, 1.968, 3.968]},
          "south": {"uv": [6.032, 2.032, 7.968, 3.968]},
          "west": {"uv": [4.032, 2.032, 5.968, 3.968]},
          "up": {"uv": [3.968, 1.968, 2.032, 0.032]},
          "down": {"uv": [5.968, 0.032, 4.032, 1.968]}
        },
        {
          //Body
          "size": [8, 12, 4],
          "pos": [0, 18, 0],
          "north": {"uv": [5.032, 5.032, 6.968, 7.968]},
          "east": {"uv": [4.032, 5.032, 4.968, 7.968]},
          "south": {"uv": [8.032, 5.032, 9.968, 7.968]},
          "west": {"uv": [7.032, 5.032, 7.968, 7.968]},
          "up": {"uv": [5.032, 4.968, 6.968, 4.032]},
          "down": {"uv": [7.032, 4.032, 8.968, 4.968]}
        },
        {
          //L Arm
          "size": [4, 12, 4],
          "pos": [-6, 18, 0],
          "origin": [-4, 22, 0],
          "north": {"uv": [9.032, 13.032, 9.968, 15.968]},
          "east": {"uv": [8.032, 13.032, 8.968, 15.968]},
          "south": {"uv": [11.032, 13.032, 11.968, 15.968]},
          "west": {"uv": [10.032, 13.032, 10.968, 15.968]},
          "up": {"uv": [9.968, 12.968, 9.032, 12.032]},
          "down": {"uv": [10.968, 12.032, 10.032, 12.968]}
        },
        {
          //R Arm
          "size": [4, 12, 4],
          "pos": [6, 18, 0],
          "origin": [4, 22, 0],
          "north": {"uv": [11.032, 5.032, 11.968, 7.968]},
          "east": {"uv": [10.032, 5.032, 10.968, 7.968]},
          "south": {"uv": [13.032, 5.032, 13.968, 7.968]},
          "west": {"uv": [12.032, 5.032, 12.968, 7.968]},
          "up": {"uv": [11.968, 4.968, 11.032, 4.032]},
          "down": {"uv": [12.968, 4.032, 12.032, 4.968]}
        },
        {
          //L Leg
          "size": [3.95, 12, 4],
          "pos": [-1.975, 6, 0],
          "origin": [0, 12, 0],
          "north": {"uv": [5.032, 13.032, 5.968, 15.968]},
          "east": {"uv": [4.032, 13.032, 4.968, 15.968]},
          "south": {"uv": [7.032, 13.032, 7.968, 15.968]},
          "west": {"uv": [6.032, 13.032, 6.968, 15.968]},
          "up": {"uv": [5.968, 12.968, 5.032, 12.032]},
          "down": {"uv": [6.968, 12.032, 6.032, 12.968]}
        },
        {
          //R Leg
          "size": [3.95, 12, 4],
          "pos": [1.975, 6, 0],
          "origin": [0, 12, 0],
          "north": {"uv": [1.032, 5.032, 1.968, 7.968]},
          "east": {"uv": [0.032, 5.032, 0.968, 7.968]},
          "south": {"uv": [3.032, 5.032, 3.968, 7.968]},
          "west": {"uv": [2.032, 5.032, 2.968, 7.968]},
          "up": {"uv": [1.968, 4.968, 1.032, 4.032]},
          "down": {"uv": [2.968, 4.032, 2.032, 4.968]}
        }
      ]
      for (const cube of cubes) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(...cube.size), material)
        if (cube.origin) {
          mesh.position.set(cube.origin[0], cube.origin[1], cube.origin[2])
          mesh.geometry.translate(-cube.origin[0], -cube.origin[1], -cube.origin[2])
        }
        mesh.geometry.translate(cube.pos[0], cube.pos[1], cube.pos[2])
        for (const [key, face] of Object.entries(cube)) {
          if (face.uv !== undefined) {
            let fIndex = 0;
            switch(key) {
              case "north": fIndex = 10; break
              case "east": fIndex = 0; break
              case "south": fIndex = 8; break
              case "west": fIndex = 2; break
              case "up": fIndex = 4; break
              case "down": fIndex = 6; break
            }
            let uv_array = [
              [face.uv[0] / 16, 1 - (face.uv[1] / 16)],
              [face.uv[2] / 16, 1 - (face.uv[1] / 16)],
              [face.uv[0] / 16, 1 - (face.uv[3] / 16)],
              [face.uv[2] / 16, 1 - (face.uv[3] / 16)]
            ]
            const rot = (face.rotation + 0)
            while (rot > 0) {
              let a = arr[0]
              arr[0] = arr[2]
              arr[2] = arr[3]
              arr[3] = arr[1]
              arr[1] = a
              rot -= 90
            }
            mesh.geometry.attributes.uv.array.set(uv_array[0], fIndex * 4 + 0)
            mesh.geometry.attributes.uv.array.set(uv_array[1], fIndex * 4 + 2)
            mesh.geometry.attributes.uv.array.set(uv_array[2], fIndex * 4 + 4)
            mesh.geometry.attributes.uv.array.set(uv_array[3], fIndex * 4 + 6)
            mesh.geometry.attributes.uv.needsUpdate = true
          }
        }
        model.add(mesh)
      }
      if (settings.display_skin.value) {
        let val = settings.display_skin.value
        if (val.startsWith("username:")) {
          fetch(`https://api.mojang.com/users/profiles/minecraft/${val.slice(9)}`).then(async r => {
            const uuid = await r.json()
            if (uuid?.id) {
              fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid.id}`).then(async r => {
                const data = await r.json()
                model.children[0].material.map = await getTexture(JSON.parse(Buffer.from(data.properties[0].value, "base64").toString()).textures.SKIN.url)
              })
            }
          })
        } else {
          if (val.slice(1, 2) === ",") val = val.slice(2)
          try {
            model.children[0].material.map = await getTexture(val)
          } catch {}
        }
      }
      format = new ModelFormat({
        id: "optifine_player_model",
        name: "OptiFine Player Model",
        description: "Player models for OptiFine",
        icon,
        category: "minecraft",
        show_on_start_screen: true,
        model_identifier: false,
        box_uv: true,
        optional_box_uv: true,
        single_texture: true,
        bone_rig: true,
        centered_grid: true,
        integer_size: true,
        codec,
        onActivation: () => Canvas.scene.add(model),
        onDeactivation: () => Canvas.scene.remove(model),
        format_page: {
          component: {
            methods: {
              load: () => Formats.optifine_player_model.new(),
              info() {
                Plugins.dialog.show()
                Plugins.dialog.content_vue.search_term = "OptiFine Player Models"
                Plugins.dialog.content_vue.selectPlugin(Plugins.dialog.content_vue.viewed_plugins.find(e => e.id === "optifine_player_models"))
              }
            },
            template: `
              <div class="ewan-format-page" style="display:flex;flex-direction:column;height:100%">
                <p class="format_description">${description}</p>
                <p class="format_target"><b>Target</b> : <span>Minecraft: Java Edition with OptiFine</span></p>
                <content>
                  <h3 class="markdown"><strong>How to use:</strong></h3>
                  <br>
                  <button @click="info">Show information</button>
                  <br>
                  <br>
                  <h3 class="markdown"><strong>Limitations:</strong></h3>
                  <p class="markdown">
                    <ul>
                      <li>They are client side only.</li>
                      <li>They are not part of resource packs.</li>
                      <li>They require OptiFine, and JVM args set in the launcher.</li>
                      <li>Animations are not supported.</li>
                      <li>You can only target specific players, not all players.</li>
                    </ul>
                  </p>
                </content>
                <div class="spacer"></div>
                <div class="optifine-player-model-links">${Object.values(links).map(e => `
                  <a href="${e.link}">
                    ${Blockbench.getIconNode(e.icon, e.colour).outerHTML}
                    <p>${e.text}</p>
                  </a>
                `).join("")}</div>
                <div class="button_bar">
                  <button id="create_new_model_button" style="margin-top:20px;margin-bottom:24px;" @click="load">
                    <i class="${icon} icon"></i>
                    Create New OptiFine Player Model
                  </button>
                </div>
              </div>
            `
          }
        }
      })
      Object.defineProperty(format, "integer_size", {get: _ => Project.box_uv})
      codec.format = format
      action = new Action("export_optifine_player_model", {
        name: "Export OptiFine Player Model",
        icon: "icon-optifine_file",
        condition: {
          formats: [format.id]
        },
        click: () => codec.export()
      })
      MenuBar.addAction(action, "file.export.0")
      codec.export_action = action
      property = new Property(ModelProject, "boolean", "use_player_texture", {
        default: false,
        label: "Use Player Texture",
        condition: {
          formats: [format.id]
        }
      })
      setResolution = () => {
        if (Project.format === format) {
          Project.texture_width = Project.texture_height = 64
          for (const group of groups) new Group(group).init()
        }
      }
      Blockbench.on("new_project", setResolution)
      textureAdd = e => {
        if (Project.format === format) {
          Texture.all.map(tex => tex.getMaterial()).forEach(e => e.transparent = false)
        }
      }
      textureAdd()
      Blockbench.on("add_texture", textureAdd)
      const addGroupOriginal = BarItems.add_group.condition
      const addCubeOriginal = BarItems.add_cube.condition
      const deleteOriginal = BarItems.delete.condition ?? (() => true)
      BarItems.add_group.condition = () => Project.format === format ? addGroupOriginal() && (Group.selected || Cube.selected?.length) : addGroupOriginal()
      BarItems.add_cube.condition = () => Project.format === format ? addCubeOriginal() && (Group.selected || Cube.selected?.length) : addCubeOriginal()
      BarItems.delete.condition = () => Project.format === format ? deleteOriginal() && !groupNames.includes(Group.selected?.name) : deleteOriginal()
      config = new Action("create_optifine_player_model_config", {
        name: "Create OptiFine Player Model Config",
        icon: "icon-optifine_file",
        condition: {
          formats: [format.id]
        },
        click() {
          const dialog = new Dialog({
            title: "Create OptiFine Player Model Config",
            id: "optifine_player_model_config",
            lines: [`
              <style>
                .optifine_player_model_config_disabled {
                  text-decoration: none!important;
                  opacity: 0.5;
                }
                .optifine_player_model_config_disabled:hover {
                  background-color: var(--color-button);
                  color: var(--color-text)!important;
                  cursor: default;
                }
              </style>
            `],
            component: {
              methods: {
                change() {
                  const button = $("#optifine_player_model_config_create")
                  if ($("#optifine_player_model_config_username").val().trim() !== "" && $("#optifine_player_model_config_item").val().trim() !== "") {
                    button.removeClass("optifine_player_model_config_disabled")
                  } else {
                    button.addClass("optifine_player_model_config_disabled")
                  }
                },
                create() {
                  if ($("#optifine_player_model_config_create").hasClass("optifine_player_model_config_disabled")) return
                  const data = {
                    items: [
                      {
                        type: $("#optifine_player_model_config_item").val().trim(),
                        active: true
                      }
                    ]
                  }
                  Blockbench.export({
                    extensions: ["cfg"],
                    type: "CFG",
                    name: $("#optifine_player_model_config_username").val().trim(),
                    content: JSON.stringify(data, null, 2)
                  }, file => Blockbench.showQuickMessage(`Saved as: ${file}`, 2000))
                  dialog.cancel()
                },
                close: () => dialog.cancel()
              },
              template: `
                <div>
                  <p>The usernam of the player that this config applies to.</p>
                  <div class="dialog_bar form_bar">
                    <label class="name_space_left" for="optifine_player_model_config_username">Minecraft username:</label>
                    <input type="text" class="dark_bordered half focusable_input" id="optifine_player_model_config_username" placeholder="steve" @input="change()">
                  </div>
                  <br>
                  <p>The player model name is the name of the folder you put the <strong>model.cfg</strong> file in.</p>
                  <div class="dialog_bar form_bar">
                    <label class="name_space_left" for="optifine_player_model_config_item">Player model name:</label>
                    <input type="text" class="dark_bordered half focusable_input" id="optifine_player_model_config_item" placeholder="horns" @input="change()">
                  </div>
                  <br>
                  <div style="display:flex;gap:8px;justify-content:flex-end">
                    <button id="optifine_player_model_config_create" @click="create()" class="optifine_player_model_config_disabled">Create</button>
                    <button @click="close()">Cancel</button>
                  </div>
                </div>
              `
            },
            buttons: []
          }).show()
        }
      })
      MenuBar.addAction(config, "file.export.1")
    },
    onunload() {
      Blockbench.removeListener("new_project", setResolution)
      Blockbench.removeListener("add_texture", textureAdd)
      codec?.delete()
      format?.delete()
      action?.delete()
      config?.delete()
      styles?.delete()
      property?.delete()
    }
  })
  function addStyles() {
    styles = Blockbench.addCSS(`
      .spacer {
        flex: 1;
      }
      .optifine-player-model-links {
        display: flex;
        justify-content: space-around;
        margin: 20px 40px 0;
      }
      .optifine-player-model-links > a {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        padding: 5px;
        text-decoration: none;
        flex-grow: 1;
        flex-basis: 0;
        color: var(--color-subtle_text);
        text-align: center;
      }
      .optifine-player-model-links > a:hover {
        background-color: var(--color-accent);
        color: var(--color-light);
      }
      .optifine-player-model-links > a > i {
        font-size: 32px;
        width: 100%;
        max-width: initial;
        height: 32px;
        text-align: center;
      }
      .optifine-player-model-links > a:hover > i {
        color: var(--color-light) !important;
      }
      .optifine-player-model-links > a > p {
        flex: 1;
        display: flex;
        align-items: center;
      }
      #format_page_optifine_player_model {
        padding-bottom: 0;
      }
      #format_page_optifine_player_model .format_target {
        margin-bottom: 6px;
      }
      #format_page_optifine_player_model div:nth-child(3), #format_page_optifine_player_model content {
        overflow-y: auto;
      }
    `)
  }
})()