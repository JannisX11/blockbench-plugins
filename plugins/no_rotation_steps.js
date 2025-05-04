/// <reference path="../types/index.d.ts" />

const deletables = [];

Plugin.register('no_rotation_steps', {
	title: 'No Rotations Steps',
	icon: 'architecture',
	author: 'JannisX11',
	description: 'Disables limited rotation steps of 22.5 degrees in Java block/item models of the latest version. Introduces a project setting for format version.',
	version: '1.0.0',
	min_version: '4.0.0',
	variant: 'both',
	onload() {
		let property = new Property(ModelProject, 'string', 'java_block_version', {
			label: 'Format Version',
			default: '1.21.6',
			condition: {formats: ['java_block']},
			options: {
				'1.9.0': '1.9 - 1.21.5',
				'1.21.6': '1.21.6+',
			}
		});
		deletables.push(property);

		window.getRescalingFactor = (angle) => {
			angle = Math.abs(angle);
			if (angle > 45) angle = 90-angle;
			return 1 / Math.cos(Math.degToRad(angle));
		}

		let compile_event = Codecs.java_block.on('compile', ({model}) => {
			model.format_version = Project.java_block_version;
			// Move to beginning of the file
			for (let key in model) {
				if (key == 'format_version') continue;
				let value = model[key];
				delete model[key];
				model[key] = value;
			}
		});
		let parse_event = Codecs.java_block.on('parse', ({model}) => {
			if (typeof model.format_version == 'string') {
				Project.java_block_version = model.format_version;
			}
		});
		deletables.push(compile_event, parse_event);

		Codecs.java_block.rotation_snap = false;
		Object.defineProperty(Formats.java_block, 'rotation_snap', {
			get() {
				return Project.java_block_version == '1.9.0'
			}
		})

	},
	onunload() {
		for (let deletable of deletables) {
			deletable.delete();
		}
	}
});

