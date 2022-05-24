(function() {

const FABRIC_OPTIONS_DEFAULT = {
	header: 'package com.example.mod;',
	entity: 'Entity',
	render: '',
	members: '',
};
Object.freeze(FABRIC_OPTIONS_DEFAULT);

fabricOptions = Object.assign({}, FABRIC_OPTIONS_DEFAULT);
let button;

const compileCallback = (e) => {
	if (Format.id !== "modded_entity") return;
	e.model.fabricOptions = fabricOptions;
	// console.log(`compileCallback model:`, e.model);
};

const parseCallback = (e) => {
	// console.log(`parseCallback:`, e);
	if (e.model && typeof e.model.fabricOptions === 'object') {
		Object.assign(fabricOptions, e.model.fabricOptions);
	} else {
		fabricOptions = Object.assign({}, FABRIC_OPTIONS_DEFAULT);
	}
	setTemplate();
};

function setTemplate() {
	const { header, entity, render, members } = fabricOptions;

	Codecs.modded_entity.templates['Fabric 1.14'] = {
		name: 'Fabric 1.14',
		flip_y: true,
		integer_size: true,
		file:
			 `// Made with Blockbench %(bb_version)
			// Exported for Minecraft version 1.14
			// Paste this class into your mod and generate all required imports

			${header}

			import net.minecraft.client.model.Box;
			import net.minecraft.client.model.ModelPart;
			import net.minecraft.client.render.entity.model.EntityModel;
			import net.minecraft.entity.Entity;


			public class %(identifier) extends EntityModel {
				%(fields)

				public %(identifier)() {
					textureWidth = %(texture_width);
					textureHeight = %(texture_height);

					%(content)
				}

				@Override
				public void render(Entity entity, float f, float f1, float f2, float f3, float f4, float f5) {
					${render}
					%(renderers)
				}

				public void setRotationAngle(ModelPart bone, float x, float y, float z) {
						bone.pitch = x;
						bone.yaw = y;
						bone.roll = z;
				}

				${members}
			}`,
		field: `private final ModelPart %(bone);`,
		bone:
			 `%(bone) = new ModelPart(this);
			%(bone).setPivot(%(x), %(y), %(z));
			?(has_parent)%(parent).addChild(%(bone));
			?(has_rotation)setRotationAngle(%(bone), %(rx), %(ry), %(rz));
			%(cubes)`,
		renderer: `%(bone).render(f5);`,
		cube: `%(bone).boxes.add(new Box(%(bone), %(uv_x), %(uv_y), %(x), %(y), %(z), %(dx), %(dy), %(dz), %(inflate), %(mirror)));`,
	};
	Codecs.modded_entity.templates['Fabric 1.15-1.16'] = {
		name: 'Fabric 1.15-1.16',
		flip_y: true,
		integer_size: false,
		file:
			 `// Made with Blockbench %(bb_version)
				// Exported for Minecraft version 1.15 - 1.16
				// Paste this class into your mod and generate all required imports

				${header}

				public class %(identifier) extends EntityModel<${entity}> {
						%(fields)
						public %(identifier)() {
								textureWidth = %(texture_width);
								textureHeight = %(texture_height);
								%(content)
						}
						@Override
						public void setAngles(${entity} entity, float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch){
								//previously the render function, render code was moved to a method below
						}
						@Override
						public void render(MatrixStack matrixStack, VertexConsumer	buffer, int packedLight, int packedOverlay, float red, float green, float blue, float alpha){
								${render}
								%(renderers)
						}
						public void setRotationAngle(ModelPart bone, float x, float y, float z) {
								bone.pitch = x;
								bone.yaw = y;
								bone.roll = z;
						}
						${members}
				}`,
		field: `private final ModelPart %(bone);`,
		bone:
			 `%(bone) = new ModelPart(this);
			%(bone).setPivot(%(x), %(y), %(z));
			?(has_parent)%(parent).addChild(%(bone));
			?(has_rotation)setRotationAngle(%(bone), %(rx), %(ry), %(rz));
			%(cubes)`,
		renderer: `%(bone).render(matrixStack, buffer, packedLight, packedOverlay);`,
		cube: `%(bone).setTextureOffset(%(uv_x), %(uv_y)).addCuboid(%(x), %(y), %(z), %(dx), %(dy), %(dz), %(inflate), %(mirror));`,
	};

	Codecs.modded_entity.templates['Fabric 1.17+'] = {
		name: 'Fabric 1.17+',
		flip_y: true,
		integer_size: false,
		file: generateJavaFile(header, entity),
	};
}

function generateJavaFile(header, entity) {

		// grabs groups and cubes that are child of root
		let rootGroups = Outliner.root.filter(node => node instanceof Group)
		let rootCubes = Outliner.root.filter(node => node instanceof Cube)

		// placeholder string that will get sent off later
		let modelCode = ""

		modelCode+= "// Made with Blockbench %(bb_version)\n"
		modelCode+= "// Exported for Minecraft version 1.17+\n"
		modelCode+= "// 1.17+ port by SebaSphere @ https://sebastianb.dev\n\n"

		modelCode+= header + "\n\n"

		modelCode+= "public class %(identifier) extends EntityModel<" + entity + ">{\n\n"

		modelCode+= "	private final ModelPart root;\n\n"
		if (rootCubes.length >= 1) {
			modelCode+= "	private final ModelPart bb_main;\n\n"
		}
		// adds all groups in existence to its own field
		Group.all.forEach(function (group, i) {
			modelCode+= "	private final ModelPart " + group.name + ";\n"
		})

		modelCode+= "\n"
		modelCode+= "	public %(identifier)(ModelPart root){\n"
		// makes each folder in root it's own assigned group
		rootGroups.forEach(function (rootGroup, index){
			modelCode+= "		this." + rootGroup.name + " = root.getChild(\"" + rootGroup.name + "\");\n";
			// not sure if I need this
			// modelCode+= "		this." + rootGroup.name +
			// 	".setPivot(\"" + rootGroup.origin.at(0) + ", " + rootGroup.origin.at(1) + ", " + rootGroup.origin.at(2) + "\");\n";
		})

		// handle all subgroups
		Group.all.forEach(function (eachGroup, i) {
			if (eachGroup.parent !== "root") {
				modelCode+= "		this." + eachGroup.name + " = this." + eachGroup.parent.name + ".getChild(\"" + eachGroup.name +"\");\n";

			}
		})

		// used to add all cubes in root to its own group
		if (rootCubes.length >= 1) {
			modelCode+= "		this.bb_main = this.root.getChild(\"bb_main\");\n"
		}
		modelCode+= "	}\n\n"

		// getTexturedModelData, bulk of model information
		modelCode+= "	public static TexturedModelData getTexturedModelData(){\n"
		modelCode+= "		ModelData data = new ModelData();\n"
		modelCode+= "		ModelPartData modelPartData = data.getRoot();\n\n"

		// adds model data for root cubes only
		rootGroups.forEach(function (rootGroup, index){
			modelCode+= "	ModelPartData " + rootGroup.name + " = root.addChild(\n"
			modelCode+= "		\"" + rootGroup.name + "\",\n"
			modelCode+= "		ModelPartBuilder.create()\n"
			// add UVs and stuff based on cubes
			let innerCubes = rootGroup.children.filter(node => node instanceof Cube)
			innerCubes.forEach(function (cube, i) {
				console.log(cube.parent)
			})
			modelCode+= "	);\n"

		})
		modelCode+= "	}\n"


		modelCode+= "}"

		console.log(modelCode)
		return modelCode
}

Plugin.register('modded_entity_fabric', {
	title: 'Fabric Modded Entity',
	icon: 'icon-format_java',
	author: 'Eliot Lash',
	description: 'Plugin for exporting Modded Entities using Fabric/Yarn Sourcemap',
    tags: ["Minecraft: Java Edition"],
	min_version: '3.6.6',
	version: '0.3.0',
	variant: 'both',
	onload() {
		Codecs.project.on('compile', compileCallback);
		Codecs.project.on('parse', parseCallback);
		setTemplate();
		// add a button to show the tips
		button = new Action('fabric_info', {
			name: 'Fabric Options',
			description: 'Stuff for Fabric support',
			icon: 'info',
			condition: () => Format.id === "modded_entity",
			click: function () {
				var dialog = new Dialog({
					id: 'project',
					title: 'Fabric Options',
					width: 540,
					lines: [
						'<p>These settings allow you to customize the exported java code if desired.<p>',
						`<p><b>Be sure to select your Fabric version</b> in project settings first. Fabric format is currently <b>${Project.modded_entity_version.includes("Fabric") ? 'Enabled' : '<span style="color:red;">Disabled</span>'}</b>.</p>`,
						'<p>For help animating your models, check out <a href="https://github.com/bernie-g/geckolib">GeckoLib</a> which has native Fabric support.</p>',
					],
					form: {
						entity: {label: 'Entity Type', value: fabricOptions.entity},
						header: {label: 'Code Header Injection', value: fabricOptions.header},
						render: {label: 'Render Code Injection', value: fabricOptions.render},
						members: {label: 'Code Extra Members Injection', value: fabricOptions.members},
					},
					onConfirm: function(formResult) {
						Object.assign(fabricOptions, formResult);
						setTemplate();
						dialog.hide()
					}
				})
				dialog.show()
			}
		});
		MenuBar.addAction(button, 'file.1');
	},
	onunload() {
		delete Codecs.modded_entity.templates['Fabric 1.14'];
		delete Codecs.modded_entity.templates['Fabric 1.15-1.16'];
		delete Codecs.modded_entity.templates['Fabric 1.17+'];
		// remove button when plugin is unloaded
		button.delete();
		Codecs.project.events.compile.remove(compileCallback)
		Codecs.project.events.parse.remove(parseCallback)
	}
});

})()
