// code based off the existing modded_entity.js module built into Blockbench for entity code but for Fabric Yarn mappings!
// https://github.com/JannisX11/blockbench/blob/master/js/io/formats/modded_entity.js
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
	Codecs.modded_entity.templates['Fabric 1.15+'] = { // ID used internally, will show "Fabric 1.15-1.16" in blockbench
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
		file:
			`// Made with Blockbench %(bb_version)
			// Exported for Minecraft version 1.17+ for Yarn
			// Paste this class into your mod and generate all required imports
			public class %(identifier) extends EntityModel<${entity}> {
				%(fields)
				public %(identifier)(ModelPart root) {
					%(model_parts)
				}
				public static TexturedModelData getTexturedModelData() {
					ModelData modelData = new ModelData();
					ModelPartData modelPartData = modelData.getRoot();
					%(content)
					return TexturedModelData.of(modelData, %(texture_width), %(texture_height));
				}
				@Override
				public void setAngles(${entity} entity, float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch) {
				}
				@Override
				public void render(MatrixStack matrices, VertexConsumer vertexConsumer, int light, int overlay, float red, float green, float blue, float alpha) {
					%(renderers)
				}
			}`,
		field: `private final ModelPart %(bone);`,
		model_part: `this.%(bone) = root.getChild("%(bone)");`,
		bone:
			`?(has_no_parent)ModelPartData %(bone) = modelPartData.addChild("%(bone)", ModelPartBuilder.create()
			?(has_parent)ModelPartData %(bone) = %(parent).addChild("%(bone)", ModelPartBuilder.create()
			%(remove_n)%(cubes)
			?(has_rotation)%(remove_n), ModelTransform.of(%(x), %(y), %(z), %(rx), %(ry), %(rz)));
			?(has_no_rotation)%(remove_n), ModelTransform.pivot(%(x), %(y), %(z)));`,
		renderer: `%(bone).render(matrices, vertexConsumer, light, overlay, red, green, blue, alpha);`,
		cube: `.uv(%(uv_x), %(uv_y)){?(has_mirror).mirrored()}.cuboid(%(x), %(y), %(z), %(dx), %(dy), %(dz), new Dilation(%(inflate))){?(has_mirror).mirrored(false)}`,
	}

}

Plugin.register('modded_entity_fabric', {
	title: 'Fabric Modded Entity',
	icon: 'icon-format_java',
	author: 'Eliot Lash, SebaSphere',
	description: 'Plugin for exporting Modded Entities using Fabric/Yarn Sourcemap',
    tags: ["Minecraft: Java Edition"],
	min_version: '3.6.6',
	version: '0.4.0',
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
		delete Codecs.modded_entity.templates['Fabric 1.15+']; // 1.15 to 1.16
		delete Codecs.modded_entity.templates['Fabric 1.17+']; // 1.17 to 1.19 at time of writing
		// remove button when plugin is unloaded
		button.delete();
		Codecs.project.events.compile.remove(compileCallback)
		Codecs.project.events.parse.remove(parseCallback)
	}
});

})()
