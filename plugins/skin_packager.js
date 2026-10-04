(() => {
  // src/util/uninstall_register.js
  var removables = [];
  function registerRemovable(item) {
    removables.push(item);
  }
  function deleteRemovables() {
    removables.forEach((item) => {
      if (typeof item.delete == "function") item.delete();
    });
    removables.splice(0, Infinity);
  }

  // src/generate_pack.js
  var BoneTypes = {
    body: "base",
    head: "base",
    hat: "clothing",
    helmet: "armor",
    rightArm: "base",
    rightSleeve: "clothing",
    rightArmArmor: "armor",
    rightItem: "item",
    leftArm: "base",
    leftSleeve: "clothing",
    leftArmArmor: "armor",
    leftItem: "item",
    jacket: "clothing",
    bodyArmor: "armor",
    waist: "armor_offset",
    rightLeg: "base",
    rightPants: "clothing",
    rightLegging: "armor",
    rightBoot: "armor",
    leftLeg: "base",
    leftPants: "clothing",
    leftLegging: "armor",
    leftBoot: "armor"
  };
  var FormValues = {};
  var SkinData = [];
  function isProjectSlim(project) {
    let arm_cube = project.elements.find((el) => el instanceof Cube && el.name.includes("Right Arm"));
    return arm_cube && arm_cube.size(0) < 3.8;
  }
  registerRemovable(Blockbench.addCSS(`
	.skin_pack_export_list > div {
		padding-left: 118px;
		display: flex;
	}
	.skin_pack_export_list > div > label {
		flex-grow: 1;
		width: 0;
	}
	.skin_pack_export_list > div > label.checkbox {
		flex-grow: 0;
		width: 34px;
		text-align: center;
	}
	.skin_pack_export_list li {
		display: flex;
		align-items: center;
	}
	.skin_pack_export_list li.disabled_skin {
		opacity: 0.5;
	}
	.skin_pack_export_list li > * {
		margin: 2px;
		object-fit: contain;
	}
	.skin_pack_export_list li input[type=checkbox] {
		text-align: center;
		min-width: 30px;
	}
	.skin_pack_export_list li input[type=text] {
		flex-grow: 1;
	}
	.skin_pack_export_list .skin_drag_handle {
		flex-grow: 0;
		cursor: move;
		padding-top: 6px;
	}
	.skin_pack_export_list li img {
		transition: transform 100ms ease;
		transform-origin: left;
	}
	.skin_pack_export_list li:not(.disabled_skin) img:hover {
		transform: scale(4);
		background-color: var(--color-back);
		border: 0.25px solid var(--color-accent);
	}
`));
  function cleanTextureName(name) {
    return name.replace(/\.png$/i, "");
  }
  function selectSkinsForExport() {
    let uuids = [];
    ModelProject.all.forEach((project) => {
      if (project.format.id !== "minecraft_skin_geometry" && project.format.id !== "skin") return;
      if (!project.textures[0]) return;
      if (project.format.id === "minecraft_skin_geometry") {
        let data = SkinData.find((s) => s.uuid == project.uuid);
        if (!data) {
          data = {
            uuid: project.uuid,
            export: true,
            slim: project.minecraft_skin_slim,
            free: false
          };
          SkinData.push(data);
        }
        data.thumbnail = project.thumbnail || project.textures[0].source;
        data.name = project.skin_display_name;
        data.id = project.geometry_name;
        uuids.push(project.uuid);
      } else {
        let multi = project.textures.length > 1;
        project.textures.forEach((texture, i) => {
          let uuid = project.uuid + "-" + texture.uuid;
          let data = SkinData.find((s) => s.uuid == uuid);
          if (!data) {
            data = {
              uuid,
              export: true,
              slim: isProjectSlim(project),
              free: false,
              name: multi ? cleanTextureName(texture.name) : project.skin_display_name,
              id: multi ? cleanTextureName(texture.name).replace(/\s+/g, "") : project.geometry_name
            };
            SkinData.push(data);
          }
          data.texture = texture;
          data.thumbnail = texture.source;
          if (!multi) data.name = project.skin_display_name;
          if (!multi) data.id = project.geometry_name;
          uuids.push(data.uuid);
        });
      }
    });
    SkinData.forEachReverse((skin) => {
      if (!uuids.includes(skin.uuid)) {
        SkinData.remove(skin);
      }
    });
    let dialog = new Dialog({
      id: "skin_pack_export",
      title: "Export Skin Pack",
      width: 700,
      form: {
        name: { label: "Pack Name", type: "text", value: FormValues.name },
        id: { label: "Pack Identifier", type: "text", value: FormValues.id },
        version: { label: "Version", type: "text", value: FormValues.version || "1.0.0" },
        uuid: { label: "UUID", type: "text", value: FormValues.uuid || guid() },
        regenerate_uuid: { label: " ", nocolon: true, type: "buttons", buttons: ["Regenerate UUID"], click(index) {
          dialog.setFormValues({ uuid: guid() });
        } },
        type: { type: "select", label: "Pack Type", options: {
          auger: "Ready-to-Submit",
          mcpack: "MCPack"
        } },
        separator1: "_",
        key_art: { type: "file", label: "Key Art", value: FormValues.key_art, extensions: ["jpg"], filetype: "Image", condition: (form) => form.type == "auger" },
        partner_art: { type: "file", label: "Partner Art", value: FormValues.partner_art, extensions: ["jpg"], filetype: "Image", condition: (form) => form.type == "auger" },
        hd_key_art: { type: "file", label: "HD Key Art", value: FormValues.hd_key_art, extensions: ["jpg"], filetype: "Image", condition: (form) => form.type == "auger" },
        separator2: "_"
      },
      component: {
        data() {
          return {
            skins: SkinData
          };
        },
        methods: {
          changeMeta(skin, uuid, key, event) {
            let project = ModelProject.all.find((p) => p.uuid == uuid || p.textures.length == 1 && uuid == p.uuid + "-" + p.textures[0].uuid);
            if (project) {
              if (key == "id") {
                project.geometry_name = skin.id;
              } else {
                project.skin_display_name = skin.name;
              }
              project.saved = false;
            }
          },
          sort(event) {
            var item = this.skins.splice(event.oldIndex, 1)[0];
            this.skins.splice(event.newIndex, 0, item);
          },
          drop(event) {
          }
        },
        template: `
				<div class="skin_pack_export_list">
					<div>
						<label>ID</label>
						<label>Name</label>
						<label class="checkbox">Slim</label>
						<label class="checkbox">Free</label>
					</div>
					<ul v-sortable="{onUpdate: sort, onEnd: drop, animation: 160, handle: '.skin_drag_handle'}">
						<li v-for="skin in skins" :key="skin.uuid" :class="{disabled_skin: !skin.export}">
							<div class="skin_drag_handle"><i class="material-icons">drag_handle</i></div>
							<input type="checkbox" v-model="skin.export" :style="{color: skin.export ? 'var(--color-accent)' : 'unset'}">
							<img :src="skin.thumbnail" width="48px" height="48px" />
							<input type="text" class="dark_bordered" v-model="skin.id" @input="changeMeta(skin, skin.uuid, 'id', $event)">
							<input type="text" class="dark_bordered" v-model="skin.name" @input="changeMeta(skin, skin.uuid, 'name', $event)">
							<input type="checkbox" v-model="skin.slim">
							<input type="checkbox" v-model="skin.free">
						</li>
					</ul>
				</div>
			`
      },
      onConfirm(formResult) {
        FormValues.id = formResult.id;
        FormValues.name = formResult.name;
        FormValues.uuid = formResult.uuid;
        FormValues.version = formResult.version;
        FormValues.type = formResult.type;
        FormValues.key_art = formResult.key_art;
        FormValues.partner_art = formResult.partner_art;
        FormValues.hd_key_art = formResult.hd_key_art;
        generatePack(formResult);
      }
    }).show();
  }
  async function generatePack(options) {
    let archive = new JSZip();
    let skin_folder;
    if (options.type == "mcpack") {
      skin_folder = archive;
    } else {
      skin_folder = archive.folder("Content/skin_pack");
    }
    let skin_config = {
      id: options.id,
      name: options.name,
      uuid: options.uuid,
      version: options.version,
      type: options.type,
      key_art: options.key_art,
      partner_art: options.partner_art,
      hd_key_art: options.hd_key_art,
      skins: {}
    };
    let geometries = {};
    let skins = [];
    let translations = [
      `skinpack.${options.id}=${options.name}`
    ];
    for (let skin of SkinData) {
      let uuid = skin.uuid;
      if (!skin.export) continue;
      let project = ModelProject.all.find((p) => uuid.substring(0, p.uuid.length) == p.uuid);
      if (!project) continue;
      let geometry_name = project.format.id == "minecraft_skin_geometry" && `geometry.${options.id}.${skin.id}`;
      let meta = {
        localization_name: skin.id,
        geometry: geometry_name || `geometry.humanoid.${skin.slim ? "customSlim" : "custom"}`,
        texture: `${skin.id}.png`,
        type: skin.free ? "free" : "paid"
      };
      skins.push(meta);
      translations.push(`skin.${options.id}.${skin.id}=${skin.name}`);
      let texture = skin.texture || project.selected_texture || project.textures[0];
      skin_folder.file(`${skin.id}.png`, texture.getBase64(), { base64: true });
      if (geometry_name) {
        project.select();
        if (Modes.animate) {
          Modes.options.edit.select();
        }
        let model = Codecs.bedrock_old.compile({ raw: true });
        let { bones } = model;
        delete model.visible_bounds_width;
        delete model.visible_bounds_height;
        delete model.visible_bounds_offset;
        delete model.bones;
        model.META_ModelVersion = "1.0.6";
        model.rigtype = skin.slim ? "slim" : "normal";
        if (project.skin_geo_flag_armsdown) model.animationArmsDown = true;
        if (project.skin_geo_flag_armsoutfront) model.animationArmsOutFront = true;
        if (project.skin_geo_flag_statueoflibertyarms) model.animationStatueOfLibertyArms = true;
        if (project.skin_geo_flag_singlearmanimation) model.animationSingleArmAnimation = true;
        if (project.skin_geo_flag_stationarylegs) model.animationStationaryLegs = true;
        if (project.skin_geo_flag_singleleganimation) model.animationSingleLegAnimation = true;
        if (project.skin_geo_flag_noheadbob) model.animationNoHeadBob = true;
        if (project.skin_geo_flag_dontshowarmor) model.animationDontShowArmor = true;
        if (project.skin_geo_flag_upsidedown) model.animationUpsideDown = true;
        if (project.skin_geo_flag_invertedcrouch) model.animationInvertedCrouch = true;
        model.bones = bones;
        bones.forEach((bone) => {
          if (BoneTypes[bone.name]) {
            bone.META_BoneType = BoneTypes[bone.name];
          }
        });
        geometries[geometry_name] = model;
      }
      skin_config.skins[skin.id] = {
        export: skin.export,
        slim: skin.slim,
        free: skin.free,
        name: skin.name,
        model_file: geometry_name ? Project.save_path : void 0,
        texture_file: texture.path || texture.source.replace(/\?.*$/, "")
      };
    }
    let version = options.version ? options.version.split(".").map((v) => parseInt(v)) : [1, 0, 0];
    while (version.length < 3) {
      version.push(0);
    }
    let manifest = {
      format_version: 1,
      header: {
        name: options.name || "pack.name",
        version,
        uuid: options.uuid || guid()
      },
      modules: [
        {
          version,
          type: "skin_pack",
          uuid: guid()
        }
      ]
    };
    let languages = ["en_US"];
    let skins_file = {
      serialize_name: options.id,
      localization_name: options.id,
      skins
    };
    if (Object.keys(geometries).length) skin_folder.file("geometry.json", compileJSON(geometries));
    skin_folder.file("skins.json", compileJSON(skins_file));
    skin_folder.file("manifest.json", compileJSON(manifest));
    skin_folder.file("texts/en_US.lang", translations.join("\n"));
    skin_folder.file("texts/languages.json", compileJSON(languages));
    if (options.type == "mcpack") {
      let blob = await archive.generateAsync({ type: "blob" });
      Blockbench.export({
        type: "MCPack",
        extensions: ["mcpack"],
        name: options.id,
        content: blob,
        savetype: "zip"
      });
    } else {
      console.log(options);
      async function writeImage(source, target) {
        if (source && isApp) {
          let fs = requireNativeModule("fs");
          let base64 = fs.readFileSync(source, "base64");
          archive.file(target, base64, { base64: true });
        }
      }
      await writeImage(options.key_art, `Store Art/${options.id}_Thumbnail_0.jpg`);
      await writeImage(options.partner_art, `Marketing Art/${options.id}_PartnerArt.jpg`);
      await writeImage(options.hd_key_art, `Marketing Art/${options.id}_MarketingKeyArt.jpg`);
      let blob = await archive.generateAsync({ type: "blob" });
      Blockbench.export({
        type: "ZIP Folder",
        extensions: ["zip"],
        name: options.id,
        content: blob,
        savetype: "zip"
      });
    }
    Blockbench.export({
      type: "Skin Pack Config",
      extensions: ["bbskinpack"],
      name: options.id,
      content: "",
      custom_writer(content, path) {
        let export_skin_config = JSON.parse(JSON.stringify(skin_config));
        if (skin_config.key_art) export_skin_config.key_art = PathModule.relative(PathModule.dirname(path), skin_config.key_art).replace(/[\\/]+/g, "/");
        if (skin_config.partner_art) export_skin_config.partner_art = PathModule.relative(PathModule.dirname(path), skin_config.partner_art).replace(/[\\/]+/g, "/");
        if (skin_config.hd_key_art) export_skin_config.hd_key_art = PathModule.relative(PathModule.dirname(path), skin_config.hd_key_art).replace(/[\\/]+/g, "/");
        for (let id in export_skin_config.skins) {
          let skin = export_skin_config.skins[id];
          if (isApp && skin.model_file) {
            skin.model_file = PathModule.relative(PathModule.dirname(path), skin.model_file).replace(/[\\/]+/g, "/");
          }
          if (isApp && skin.texture_file) {
            skin.texture_file = PathModule.relative(PathModule.dirname(path), skin.texture_file).replace(/[\\/]+/g, "/");
          }
        }
        Blockbench.writeFile(path, {
          content: compileJSON(export_skin_config),
          savetype: "text"
        });
      }
    });
  }
  if (!BarItems.export_minecraft_skin_pack) {
    let export_action = new Action("export_minecraft_skin_pack", {
      name: "Export Skin Pack",
      icon: "folder_shared",
      click() {
        selectSkinsForExport();
      }
    });
    MenuBar.addAction(export_action, "file.export");
    registerRemovable(export_action);
  }

  // src/skin_presets.js
  var PresetSteve = {
    display_name: "Player - Wide",
    pose: true,
    model: `{
		"name": "steve",
		"texturewidth": 64,
		"textureheight": 64,
		"eyes": [
			[9, 11],
			[13, 11]
		],
		"bones": [
			{
				"name": "Waist",
				"color": 0,
				"pivot": [0, 12, 0],
				"pose": [0, 0, 0]
			},
			{
				"name": "Head",
				"parent": "Waist",
				"color": 1,
				"pivot": [0, 24, 0],
				"pose": [-6, 5, 0],
				"cubes": [
					{"name": "Head", "origin": [-4, 24, -4], "size": [8, 8, 8], "uv": [0, 0]},
					{"name": "Hat Layer", "visibility": false, "origin": [-4, 24, -4], "size": [8, 8, 8], "uv": [32, 0], "inflate": 0.5, "layer": true}
				]
			},
			{
				"name": "Body",
				"parent": "Waist",
				"color": 3,
				"pivot": [0, 24, 0],
				"cubes": [
					{"name": "Body", "origin": [-4, 12, -2], "size": [8, 12, 4], "uv": [16, 16]},
					{"name": "Body Layer", "visibility": false, "origin": [-4, 12, -2], "size": [8, 12, 4], "uv": [16, 32], "inflate": 0.25, "layer": true}
				]
			},
			{
				"name": "Right Arm",
				"parent": "Waist",
				"color": 5,
				"pivot": [-5, 22, 0],
				"pose": [-10, 0, 0],
				"cubes": [
					{"name": "Right Arm", "origin": [-8, 12, -2], "size": [4, 12, 4], "uv": [40, 16]},
					{"name": "Right Arm Layer", "visibility": false, "origin": [-8, 12, -2], "size": [4, 12, 4], "uv": [40, 32], "inflate": 0.25, "layer": true}
				]
			},
			{
				"name": "Left Arm",
				"parent": "Waist",
				"color": 0,
				"pivot": [5, 22, 0],
				"pose": [12, 0, 0],
				"cubes": [
					{"name": "Left Arm", "origin": [4, 12, -2], "size": [4, 12, 4], "uv": [32, 48]},
					{"name": "Left Arm Layer", "visibility": false, "origin": [4, 12, -2], "size": [4, 12, 4], "uv": [48, 48], "inflate": 0.25, "layer": true}
				]
			},
			{
				"name": "Right Leg",
				"color": 6,
				"pivot": [-1.9, 12, 0],
				"pose": [11, 0, 2],
				"cubes": [
					{"name": "Right Leg", "origin": [-3.9, 0, -2], "size": [4, 12, 4], "uv": [0, 16]},
					{"name": "Right Leg Layer", "visibility": false, "origin": [-3.9, 0, -2], "size": [4, 12, 4], "uv": [0, 32], "inflate": 0.25, "layer": true}
				]
			},
			{
				"name": "Left Leg",
				"color": 7,
				"pivot": [1.9, 12, 0],
				"pose": [-10, 0, -2],
				"cubes": [
					{"name": "Left Leg", "origin": [-0.1, 0, -2], "size": [4, 12, 4], "uv": [16, 48]},
					{"name": "Left Leg Layer", "visibility": false, "origin": [-0.1, 0, -2], "size": [4, 12, 4], "uv": [0, 48], "inflate": 0.25, "layer": true}
				]
			}
		]
	}`
  };
  var PresetAlex = {
    display_name: "Player - Slim",
    pose: true,
    model: `{
		"name": "alex",
		"texturewidth": 64,
		"textureheight": 64,
		"eyes": [
			[9, 11],
			[13, 11]
		],
		"bones": [
			{
				"name": "Waist",
				"color": 0,
				"pivot": [0, 12, 0],
				"pose": [0, 0, 0]
			},
			{
				"name": "Head",
				"parent": "Waist",
				"color": 1,
				"pivot": [0, 24, 0],
				"pose": [-6, 5, 0],
				"cubes": [
					{"name": "Head", "origin": [-4, 24, -4], "size": [8, 8, 8], "uv": [0, 0]},
					{"name": "Hat Layer", "visibility": false, "origin": [-4, 24, -4], "size": [8, 8, 8], "uv": [32, 0], "inflate": 0.5, "layer": true}
				]
			},
			{
				"name": "Body",
				"parent": "Waist",
				"color": 3,
				"pivot": [0, 24, 0],
				"cubes": [
					{"name": "Body", "origin": [-4, 12, -2], "size": [8, 12, 4], "uv": [16, 16]},
					{"name": "Body Layer", "visibility": false, "origin": [-4, 12, -2], "size": [8, 12, 4], "uv": [16, 32], "inflate": 0.25, "layer": true}
				]
			},
			{
				"name": "Right Arm",
				"parent": "Waist",
				"color": 5,
				"pivot": [-5, 21.5, 0],
				"pose": [-10, 0, 0],
				"cubes": [
					{"name": "Right Arm", "origin": [-7, 11.5, -2], "size": [3, 12, 4], "uv": [40, 16]},
					{"name": "Right Arm Layer", "visibility": false, "origin": [-7, 11.5, -2], "size": [3, 12, 4], "uv": [40, 32], "inflate": 0.25, "layer": true}
				]
			},
			{
				"name": "Left Arm",
				"parent": "Waist",
				"color": 0,
				"pivot": [5, 21.5, 0],
				"pose": [12, 0, 0],
				"cubes": [
					{"name": "Left Arm", "origin": [4, 11.5, -2], "size": [3, 12, 4], "uv": [32, 48]},
					{"name": "Left Arm Layer", "visibility": false, "origin": [4, 11.5, -2], "size": [3, 12, 4], "uv": [48, 48], "inflate": 0.25, "layer": true}
				]
			},
			{
				"name": "Right Leg",
				"color": 6,
				"pivot": [-1.9, 12, 0],
				"pose": [11, 0, 2],
				"cubes": [
					{"name": "Right Leg", "origin": [-3.9, 0, -2], "size": [4, 12, 4], "uv": [0, 16]},
					{"name": "Right Leg Layer", "visibility": false, "origin": [-3.9, 0, -2], "size": [4, 12, 4], "uv": [0, 32], "inflate": 0.25, "layer": true}
				]
			},
			{
				"name": "Left Leg",
				"color": 7,
				"pivot": [1.9, 12, 0],
				"pose": [-10, 0, -2],
				"cubes": [
					{"name": "Left Leg", "origin": [-0.1, 0, -2], "size": [4, 12, 4], "uv": [16, 48]},
					{"name": "Left Leg Layer", "visibility": false, "origin": [-0.1, 0, -2], "size": [4, 12, 4], "uv": [0, 48], "inflate": 0.25, "layer": true}
				]
			}
		]
	}`
  };

  // src/load_skin_pack_config.js
  function importImageFileAsSkin(file, is_alex) {
    let parts = file.name.replace(/\.png$/i, "").split(/[-_.]/);
    let alex_hints = ["s", "a", "f", "slim", "alex", "female"];
    if (is_alex == void 0) {
      is_alex = alex_hints.includes(parts[0]) || alex_hints.includes(parts.last());
    }
    newProject(Formats.skin);
    let preset = is_alex ? PresetAlex : PresetSteve;
    let model = JSON.parse(preset.model || preset.model_bedrock);
    Codecs.skin_model.parse(model, 16, null, true, true);
    Project.name = parts.filter((part, i) => !alex_hints.includes(part) || i && i !== parts.length - 1 || part.toLowerCase() == "female").map((part) => part.substring(0, 1).toUpperCase() + part.substring(1)).join(" ");
    Project.geometry_name = file.name.replace(/\.png$/i, "");
    Texture.all[0].remove(true);
    new Texture({ name: file.name }).fromFile(file).add(false);
    Outliner.elements.forEach((element) => {
      if (element.visibility === false) element.visibility = true;
    });
    Canvas.updateVisibility();
  }
  function loadSkinPackConfig(file) {
    let content = autoParseJSON(file.content);
    let dirname = PathModule.dirname(file.path);
    FormValues.id = content.id;
    FormValues.name = content.name;
    FormValues.uuid = content.uuid;
    FormValues.version = content.version;
    FormValues.type = content.type;
    FormValues.key_art = content.key_art ? PathModule.join(dirname, content.key_art) : "";
    FormValues.partner_art = content.partner_art ? PathModule.join(dirname, content.partner_art) : "";
    FormValues.hd_key_art = content.hd_key_art ? PathModule.join(dirname, content.hd_key_art) : "";
    for (let id in content.skins) {
      let skin = content.skins[id];
      let skin_data = {
        export: skin.export,
        slim: skin.slim,
        free: skin.free
      };
      if (skin.model_file) {
        let model_file = PathModule.join(dirname, skin.model_file);
        let fs = requireNativeModule("fs", { scope: dirname });
        let model_file_content = autoParseJSON(fs.readFileSync(model_file, "utf-8"));
        Codecs.project.load(model_file_content, { path: model_file });
        if (skin.name) Project.skin_display_name = skin.name;
        if (!Project.name && Project.skin_display_name) Project.name = Project.skin_display_name;
        skin_data.uuid = Project.uuid;
        skin_data.thumbnail = Project.thumbnail || Project.textures[0].source;
        skin_data.name = Project.skin_display_name;
        skin_data.id = Project.geometry_name;
      } else if (skin.texture_file) {
        let texture_file = PathModule.join(dirname, skin.texture_file);
        Blockbench.read(texture_file, { readtype: "image" }, (files) => {
          importImageFileAsSkin(files[0], skin.slim);
          if (skin.name) Project.skin_display_name = skin.name;
          if (Project.skin_display_name) Project.name = Project.skin_display_name;
          skin_data.uuid = Project.uuid + "-" + Texture.all[0].uuid;
          skin_data.thumbnail = Project.thumbnail || Project.textures[0].source;
          skin_data.name = Project.skin_display_name;
          skin_data.id = Project.geometry_name;
        });
      }
      SkinData.push(skin_data);
    }
  }
  if (!BarItems.load_minecraft_skin_pack_config) {
    let export_action = new Action("load_minecraft_skin_pack_config", {
      name: "Load Skin Pack Config",
      icon: "recent_actors",
      click() {
        Blockbench.import({
          extensions: ["bbskinpack"],
          type: "Skin Pack Config"
        }, (files) => {
          loadSkinPackConfig(files[0]);
        });
      }
    });
    MenuBar.addAction(export_action, "file.5");
    registerRemovable(export_action);
    Blockbench.addDragHandler(
      "bbskinpack",
      { extensions: ["bbskinpack"] },
      function(files) {
        loadSkinPackConfig(files[0]);
      }
    );
    registerRemovable({
      delete() {
        Blockbench.removeDragHandler("bbskinpack");
      }
    });
  }

  // src/display_name.js
  var display_name_default = new Property(ModelProject, "string", "skin_display_name", {
    condition: { formats: ["skin", "minecraft_skin_geometry"] },
    label: "Display Name"
  });

  // package.json
  var package_default = {
    name: "skin-geometry-plugin",
    version: "0.3.2",
    description: "Blockbench plugin to create Minecraft 3D skin packs",
    repository: {
      type: "git",
      url: "https://github.com/JannisX11/skin-geometry-plugin"
    },
    private: true,
    main: "src/plugin.ts",
    type: "module",
    scripts: {
      build: "esbuild src/skin_geometry_creator.js src/skin_packager.js --bundle --loader:.png=dataurl --outdir=dist",
      dev: "esbuild src/skin_geometry_creator.js src/skin_packager.js --bundle --loader:.png=dataurl --outdir=dist --watch"
    },
    author: "Jannis",
    devDependencies: {
      "blockbench-types": "^5.1.0-beta.2-next.2"
    },
    dependencies: {
      esbuild: "^0.27.4"
    }
  };

  // src/skin_packager.js
  BBPlugin.register("skin_packager", {
    title: "Minecraft Skin Pack Packager",
    author: "JannisX11",
    icon: "icon-player",
    description: "Create Skin Packs for the Minecraft Marketplace",
    tags: ["Minecraft: Bedrock Edition", "Minecraft Marketplace"],
    about: `Generates skin packs for the Minecraft Marketplace.

All textures in all open tabs count as skins. You can load individual skins into Blockbench via **File** > **Import Minecraft Skins**.

You can also create new skins via **New** > **Minecraft Skin**, in the File menu or on the start screen.

Export a skin pack via **File** > **Export** > **Export Skin Pack**.`,
    version: package_default.version,
    min_version: "3.7.0",
    variant: "desktop",
    await_loading: true,
    onload() {
      let import_action = new Action("import_minecraft_skins", {
        icon: "folder",
        name: "Import Minecraft Skins",
        description: "Import a batch of Minecraft skins",
        click() {
          Blockbench.import({
            resource_id: "texture",
            extensions: ["png"],
            type: "Minecraft Skin",
            readtype: "image",
            multiple: true
          }, (files) => {
            files.forEach((file) => {
              importImageFileAsSkin(file);
            });
          });
        }
      });
      MenuBar.menus.file.addAction(import_action, 5);
      registerRemovable(import_action);
      registerRemovable(display_name_default);
    },
    onunload() {
      deleteRemovables();
    }
  });
})();
