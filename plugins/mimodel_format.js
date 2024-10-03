/// <reference path="../types/index.d.ts" />

(function() {

var codec;

Plugin.register('mimodel_format', {
	title: 'Mine-imator Model Exporter',
	icon: 'fas.fa-box-open',
	author: 'JannisX11',
	description: 'Export .mimodel files for Mine-imator and Modelbench',
	tags: ["Exporter"],
	version: '1.0.2',
	min_version: '3.7.0',
	variant: 'both',
	onload() {
		
		codec = new Codec('mimodel', {
			name: 'Export Mine-imator Mimodel',
			extension: 'mimodel',
			remember: false,
			compile(options = {}) {

				if (!Project.box_uv) {
					Blockbench.showMessageBox({
						title: 'Mine-imator Model Exporter',
						message: 'Models need to use the UV mode "Box UV", otherwise the exporter won\'t work correctly.'
					})
				}

				let entitymodel = {
					name: Project.geometry_name || Project.name || '',
					floor_box_uvs: true,
				}
				if (Texture.getDefault()) {
					entitymodel.texture = Texture.getDefault().name
				}
				entitymodel.texture_size = [Project.texture_width, Project.texture_height];
				entitymodel.parts = [];

				function convertSpace(array) {
					array[0] *= -1;
					array[2] *= -1;
					return array;
				}
				let base_part;

				function exportArray(array, target) {
					array.forEach(item => {
						if (item instanceof Group) {

							let part = {
								name: item.name,
								position: item.origin.slice()
							}
							if (item.parent instanceof Group) {
								part.position.V3_subtract(item.parent.origin);
							}
							convertSpace(part.position);
							if (item.rotation.find(v => v)) {
								part.rotation = convertSpace(item.rotation.slice());
							}

							if (!target.parts) target.parts = [];
							target.parts.push(part);

							exportArray(item.children, part);

						} else if (item instanceof Cube) {

							let shape = {
								type: 'block',
								from: convertSpace(item.from.slice().V3_subtract(item.origin)),
								to: convertSpace(item.to.slice().V3_subtract(item.origin)),
								inflate: item.inflate || undefined,
								uv: item.uv_offset.slice(),
							}

							let invert = false;
							for (let axis = 0; axis < 3; axis++) {
								if ((shape.from[axis] > shape.to[axis]) == (axis == 1)) {
									invert = !invert;
								}
								if (shape.from[axis] > shape.to[axis]) {
									let temp = shape.from[axis];
									shape.from[axis] = shape.to[axis];
									shape.to[axis] = temp;
								}
							}

							let size = item.size();
							shape.uv[0] += size[2];
							shape.uv[1] += size[2];
							if (item.mirror_uv) shape.texture_mirror = true;
							if (invert) shape.invert = true;

							shape.position = item.origin.slice();
							if (item.parent instanceof Group) {
								shape.position.V3_subtract(item.parent.origin);
							}
							convertSpace(shape.position);
							if (item.rotation.find(v => v)) {
								shape.rotation = convertSpace(item.rotation.slice());
							}

							if (target == entitymodel) {
								if (!base_part) {
									base_part = {
										name: 'model_part',
										position: [0, 0, 0],
										shapes: []
									}
									if (!entitymodel.parts) entitymodel.parts = [];
									entitymodel.parts.push(base_part);
								}
								base_part.shapes.push(shape);

							} else {
								if (!target.shapes) target.shapes = [];
								target.shapes.push(shape);
							}
						}
					})
				}
				exportArray(Outliner.root, entitymodel);
		
				this.dispatchEvent('compile', {entitymodel, options});
		
				if (options.raw) {
					return entitymodel
				} else {
					return autoStringify(entitymodel)
				}
			}
		})

		codec.export_action = new Action('export_mimodel', {
			name: 'Export Mine-imator Mimodel',
			icon: 'fas.fa-box-open',
			category: 'file',
			click: function () {
				codec.export()
			}
		})

		MenuBar.addAction(codec.export_action, 'file.export')

	},
	onunload() {
		codec.export_action.delete();
		codec.delete();
	}
});

})()
