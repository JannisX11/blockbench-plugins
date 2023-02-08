(async function () {
  let format, codec, action, config, property, setResolution, textureAdd, model, aboutAction, styles
  const id = "optifine_player_models"
  const name = "OptiFine Player Models"
  const icon = "icon-player"
  const author = "Ewan Howell"
  const links = {
    discord: "https://discord.com/invite/FcpnSjrP82",
    ewan: "https://ewanhowell.com/",
    tutorial: "https://youtu.be/0rT-q95dpV0"
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
    icon,
    author,
    description: "Adds a new format that allows you to create OptiFine player models.",
    about: "This plugin adds a new format that allows you to make you own custom OptiFine player models.\n## Setup\n1. Open your launcher and go to the **Installations** tab.\n2. Find your installation, click the triple dot, and slect **Edit**.\n3. Select **More Options**.\n4. Inside the **JVM ARGUMENTS** field, add:\n`-Dplayer.models.local=true -Dplayer.models.reload=true`\nNote:\t**player.models.reload** reloads the model every 5 seconds in game, and can be disabled after you finish making the model.\n5. Make a folder named <code>playermodels</code> inside your **.minecraft** folder.\n6. Inside that folder, make 2 more folders named <code>items</code> and <code>users</code>.\n\n## Usage\n- You need a config file for every player with a player model. This config file must be the players username, and needs to go in the **users** folder.\n**Example**: `.minecraft/playermodels/users/ewanhowell5195.cfg`\n- You can create a user config by going to **File > Export > Create OptiFine Player Model Config**.\n- Exported player models should go in a folder named what the player model is, inside the **items** folder, and be named `model.cfg`.\n**Example**: `.minecraft/playermodels/items/horns/model.cfg`\n- If not using **Use Player Texture**, textures must go inside a folder named `users` located next to the model file, and be named the players username.\n**Example**: `.minecraft/playermodels/items/horns/users/ewanhowell5195.png`\n\n## Limitations\n- They are client side only.\n- They are not part of resource packs.\n- They require OptiFine, and JVM args set in the launcher.\n- Animations are not supported.\n- You can only target specific players, not all players.\n\n## Important\nEnabling the player model JVM arguments **will disable any online player models**, usually being seasonal cosmetics like the Santa and Witch hats.",
    tags: ["Minecraft: Java Edition", "OptiFine", "Player Models"],
    version: "1.3.2",
    min_version: "4.2.0",
    variant: "both",
    oninstall: () => showAbout(true),
    async onload() {
      addStyles()
      addAbout()
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
        icon: "icon-player",
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
              load: () => loadInterface(entityData.categories[0].name, data),
              info: () => showAbout()
            },
            template: `
              <div style="display:flex;flex-direction:column;height:100%;">
                <p class="format_description">Create player models for use with OptiFine</p>
                <p class="format_target"><b>Target</b> : <span>Minecraft: Java Edition with OptiFine</span></p>
                <content style="flex:1;margin:-22px 0 20px">
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
                <div class="socials">
                  <a href="${links["website"]}" class="open-in-browser">
                    <i class="icon material-icons" style="color:#33E38E">language</i>
                    <label>By ${author}</label>
                  </a>
                  <a href="${links["discord"]}" class="open-in-browser">
                    <i class="icon fab fa-discord" style="color:#727FFF"></i>
                    <label>Discord Server</label>
                  </a>
                  <a href="${links["tutorial"]}" class="open-in-browser">
                    <i class="icon fab fa-youtube" style="color:#FF4444"></i>
                    <label>Player Model Tutorial</label>
                  </a>
                </div>
                <div class="button_bar">
                  <button id="create_new_model_button" style="margin-top:20px;" @click="Formats.optifine_player_model.new()">
                    <i class="icon icon-player"></i>
                    <span id="create_new_model_button_text">Create New OptiFine Player Model</span>
                  </button>
                </div>
              </div>
            `,
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
                  if (isApp) {
                    const dir = electron.dialog.showOpenDialogSync({
                      properties: ["openDirectory"]
                    })
                    if (!dir) return
                    const fs = require("fs")
                    const path = require("path")
                    const file = path.join(dir[0], `${$("#optifine_player_model_config_username").val().trim()}.cfg`)
                    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8")
                    Blockbench.showQuickMessage(`Saved as: ${file}`, 2000)
                  } else {
                    saveAs(new Blob([JSON.stringify(data, null, 2)], {type: "application/json;charset=utf-8"}), `${$("#optifine_player_model_config_username").val().trim()}.cfg`)
                  }
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
      let about = MenuBar.menus.help.structure.find(e => e.id === "about_plugins")
    },
    onunload() {
      Blockbench.removeListener("new_project", setResolution)
      Blockbench.removeListener("add_texture", textureAdd)
      codec.delete()
      format.delete()
      action.delete()
      config.delete()
      styles.delete()
      property.delete()
      aboutAction.delete()
      MenuBar.removeAction("file.export.export_optifine_player_model")
      MenuBar.removeAction("file.export.create_optifine_player_model_config")
      MenuBar.removeAction("help.about_plugins.about_optifine_player_models")
    }
  })
  function addStyles() {
    styles = Blockbench.addCSS(`
      #format_page_optifine_player_model .socials {
        padding: 0!important;
        display: flex;
        max-width: 540px;
        margin: auto;
        width: 100%;
      }
      #format_page_optifine_player_model .socials a {
        text-align: center;
        flex-basis: 0;
        flex-grow: 1;
        text-decoration: none;
        padding: 6px;
        padding-top: 10px;
      }
      #format_page_optifine_player_model .socials a i {
        display: block;
        font-size: 2em;
        max-width: none;
        pointer-events: none;
      }
      #format_page_optifine_player_model .socials a label {
        color: var(--color-subtle_text);
        cursor: inherit;
        pointer-events: none;
      }
      #format_page_optifine_player_model .socials a:hover {
        background-color: var(--color-accent);
      }
      #format_page_optifine_player_model .socials a:hover * {
        color: var(--color-light)!important;
      }
      #format_page_optifine_player_model code {
        padding: 0 2px;
        background-color: var(--color-back);
        border: 1px solid var(--color-border);
        user-select: text;
        font-family: var(--font-code);
      }
      #format_page_optifine_player_model #create_new_model_button {
        text-decoration: none!important;
      }
      #format_page_optifine_player_model #create_new_model_button:focus #create_new_model_button_text {
        text-decoration: underline;
      }
    `)
  }
  function addAbout() {
    let about = MenuBar.menus.help.structure.find(e => e.id === "about_plugins")
    if (!about) {
      about = new Action("about_plugins", {
        name: "About Plugins...",
        icon: "info",
        children: []
      })
      MenuBar.addAction(about, "help")
    }
    aboutAction = new Action(`about_${id}`, {
      name: `About ${name}...`,
      icon,
      click: () => showAbout()
    })
    about.children.push(aboutAction)
  }
  function showAbout(banner) {
    new Dialog({
      id: "about",
      title: name,
      width: 780,
      buttons: [],
      lines: [`
        <style>
          dialog#about .dialog_title {
            padding-left: 0;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          dialog#about .dialog_content {
            text-align: left!important;
            margin: 0!important;
          }
          dialog#about .socials {
            padding: 20px 0 0!important;
            margin-bottom: -30px!important;
          }
          dialog#about code {
            padding: 0 2px;
          }
          dialog#about ul > li {
            list-style: disc;
          }
          dialog#about ol, dialog#about ul {
            padding-left: 20px;
          }
          dialog#about ol > li {
            list-style: decimal;
          }
          dialog#about div > ol > li > p {
            padding-left: 8px;
          }
          dialog#about li > p{
            white-space: pre-wrap;
          }
          dialog#about #banner {
            background-color: var(--color-accent);
            color: var(--color-accent_text);
            width: 100%;
            padding: 0 8px
          }
          dialog#about #content {
            margin: 24px;
          }
        </style>
        ${banner ? `<div id="banner">This window can be reopened at any time from <strong>Help > About Plugins > ${name}</strong></div>` : ""}
        <div id="content">
          <h1 style="margin-top:-10px">OptiFine Player Models</h1>
          <p>This plugin adds a new format that allows you to make you own custom OptiFine player models.</p>
          <div class="socials">
            <a href="${links["ewan"]}" class="open-in-browser">
              <i class="icon material-icons" style="color:#33E38E">language</i>
              <label>By Ewan Howell</label>
            </a>
            <a href="${links["discord"]}" class="open-in-browser">
              <i class="icon fab fa-discord" style="color:#727FFF"></i>
              <label>Discord Server</label>
            </a>
            <a href="${links["tutorial"]}" class="open-in-browser" title="Outdated but still valid for getting it all working">
              <i class="icon fab fa-youtube" style="color:#FF4444"></i>
              <label>Player Model Tutorial</label>
            </a>
          </div>
          <br>
          <h2>Setup</h2>
          <ol>
            <li><p>Open your launcher and go to the <strong>Installations</strong> tab.</p></li>
            <li><p>Find your installation, click the triple dot, and slect <strong>Edit</strong>.</p></li>
            <li><p>Select <strong>More Options</strong>.</p></li>
            <li><p>Inside the <strong>JVM ARGUMENTS</strong> field, add:\n<code>-Dplayer.models.local=true -Dplayer.models.reload=true</code>\nNote:\t<strong>player.models.reload</strong> reloads the model every 5 seconds in game, and can be disabled after you finish making the model.</p></li>
            <li><p>Make a folder named <code>playermodels</code> inside your <strong>.minecraft</strong> folder.</p></li>
            <li><p>Inside that folder, make 2 more folders named <code>items</code> and <code>users</code>.</p></li>
          </ol>
          <br>
          <h2>Usage</h2>
          <ul>
            <li><p>You need a config file for every player with a player model. This config file must be the players username, and needs to go in the <strong>users</strong> folder.\n<strong>Example</strong>: <code>.minecraft/playermodels/users/ewanhowell5195.cfg</code><p></li>
            <li>You can create a user config by going to <strong>File > Export > Create OptiFine Player Model Config</strong>.</li>
            <li><p>Exported player models should go in a folder named what the player model is, inside the <strong>items</strong> folder, and be named <code>model.cfg</code>.\n<strong>Example</strong>: <code>.minecraft/playermodels/items/horns/model.cfg</code></p></li>
            <li><p>If not using <strong>Use Player Texture</strong>, textures must go inside a folder named <code>users</code> located next to the model file, and be named the players username.\n<strong>Example</strong>: <code>.minecraft/playermodels/items/horns/users/ewanhowell5195.png</code></p></li>
          </ul>
          <br>
          <h2>Limitations</h2>
          <ul>
            <li>They are client side only.</li>
            <li>They are not part of resource packs.</li>
            <li>They require OptiFine, and JVM args set in the launcher.</li>
            <li>Animations are not supported.</li>
            <li>You can only target specific players, not all players.</li>
          </ul>
          <br>
          <h2>Important</h2>
          <p>Enabling the player model JVM arguments <strong>will disable any online player models</strong>, usually being seasonal cosmetics like the Santa and Witch hats.</p>
        </div>
      `]
    }).show()
    $("dialog#about .dialog_title").html(`
      <i class="icon icon-player"></i>
      ${name}
    `)
  }
})()
