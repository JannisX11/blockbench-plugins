import bamoSettings, { BAMO_SETTINGS_DEFAULT } from "./Settings";

export function loadCodec(){
    Codecs.project.on('compile', onProjectCompile);
    Codecs.project.on('parse', onProjectParse);
    Blockbench.on('close_project', onCloseProject);
}

export function unloadCodec(){
    Codecs.project.events.compile.remove(onProjectCompile)
    Codecs.project.events.parse.remove(onProjectParse)
    format.delete();
}

function onProjectCompile(e){
    if (format.id !== "bamo_model") return;
    e.model.bamoSettings = bamoSettings[Project.uuid];
}

function onProjectParse(e){
	if (format.id !== "bamo_model") return;

    if (e.model && typeof e.model.bamoSettings === 'object'){
        let placeholder = Object.assign({}, BAMO_SETTINGS_DEFAULT);
        bamoSettings[Project.uuid] = Object.assign(placeholder, e.model.bamoSettings);
    }else{
        bamoSettings[Project.uuid] = Object.assign({}, BAMO_SETTINGS_DEFAULT);
        bamoSettings[Project.uuid].displayName = Project.name
    }
    console.log(bamoSettings[Project.uuid]);
}

function onCloseProject(){
	if (format.id !== "bamo_model") return;
    delete bamoSettings[Project.uuid]
}

var codec = Codecs.java_block;

var format = new ModelFormat({
    id: "bamo_model",
    name: "BAMO model",
    category: "minecraft",
    description: "A format for storing models to be exported for the BAMO mod",
    icon: "view_in_ar",
    target: 'Minecraft: Java Edition',
	format_page: {
		content: [
			{type: 'h3', text: tl('mode.start.format.informations')},
			{text: `* ${tl('format.java_block.info.rotation')}
					* ${tl('format.java_block.info.size')}
					* ${tl('format.java_block.info.animation')}`.replace(/\t+/g, '')
			}
		]
	},
	render_sides() {
		if (Modes.display && ['thirdperson_righthand', 'thirdperson_lefthand', 'head'].includes(display_slot)) {
			return 'double';
		} else {
			return 'front';
		}
	},
    model_identifier: false,
	parent_model_id: true,
	vertex_color_ambient_occlusion: true,
	rotate_cubes: true,
	rotation_limit: true,
	optional_box_uv: true,
	uv_rotation: true,
	java_face_properties: true,
	animated_textures: true,
	select_texture_for_particles: true,
	display_mode: true,
	texture_folder: true,
    cube_size_limiter: {
		coordinate_limits: [-16, 32],
		test(cube, values = 0) {
			let from = values.from || cube.from;
			let to = values.to || cube.to;
			let inflate = values.inflate == undefined ? cube.inflate : values.inflate;

			return undefined !== from.find((v, i) => {
				return (
					to[i] + inflate > 32 ||
					to[i] + inflate < -16 ||
					from[i] - inflate > 32 ||
					from[i] - inflate < -16
				)
			})
		},
		move(cube, values = 0) {
			let from = values.from || cube.from;
			let to = values.to || cube.to;
			let inflate = values.inflate == undefined ? cube.inflate : values.inflate;
			
			[0, 1, 2].forEach((ax) => {
				var overlap = to[ax] + inflate - 32
				if (overlap > 0) {
					//If positive site overlaps
					from[ax] -= overlap
					to[ax] -= overlap

					if (16 + from[ax] - inflate < 0) {
						from[ax] = -16 + inflate
					}
				} else {
					overlap = from[ax] - inflate + 16
					if (overlap < 0) {
						from[ax] -= overlap
						to[ax] -= overlap

						if (to[ax] + inflate > 32) {
							to[ax] = 32 - inflate
						}
					}
				}
			})
		},
		clamp(cube, values = 0) {
			let from = values.from || cube.from;
			let to = values.to || cube.to;
			let inflate = values.inflate == undefined ? cube.inflate : values.inflate;
			
			[0, 1, 2].forEach((ax) => {
				from[ax] = Math.clamp(from[ax] - inflate, -16, 32) + inflate;
				to[ax] = Math.clamp(to[ax] + inflate, -16, 32) - inflate;
			})
		}
	},
    codec: codec
});

export default codec