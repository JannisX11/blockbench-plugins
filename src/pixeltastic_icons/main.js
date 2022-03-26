import settings from './icons/settings.png'
import move_tool from './icons/move_tool.png'
import resize_tool from './icons/resize_tool.png'
import rotate_tool from './icons/rotate_tool.png'
import pivot_tool from './icons/pivot_tool.png'
import keyboard from './icons/keyboard.png'
import vertex_snap from './icons/vertex_snap.png'

// Add the icons here ^^ and here vv

const icons = {
	'settings': settings,
	'keyboard': keyboard,
	'icon-gizmo': move_tool,
	'open_with': resize_tool,
	'sync': rotate_tool,
	'gps_fixed': pivot_tool,
	'icon-vertexsnap': vertex_snap,
	'vertical_align_center': {
		'x': rotate_tool,
		'y': pivot_tool,
		'z': vertex_snap
	}
}
let style;

Plugin.register('pixeltastic_icons', {
	title: 'Pixeltastic Icon Pack',
	author: 'Marctron & JannisX11',
	icon: 'insert_emoticon',
	description: 'Pixeltastic Icon Pack',
	version: '0.0.1',
	variant: 'both',
	onload() {
		style = Blockbench.addCSS(`
			img.pixeltastic_icon {
				height: 24px;
				width: 24px;
				margin-top: 3px;
			}
			.contextMenu li img.pixeltastic_icon {
				height: 24px;
				width: 24px;
				margin-bottom: -7px;
				margin-left: -30px;
				margin-right: 4px;
				margin-top: -2px;
			}
		`);

		let originalGetIconNode = Blockbench.getIconNode;
		Blockbench.getIconNode = (icon, color) => {
			let match = icons[icon];
			if (typeof match == 'object') {
				match = match[color] || match.default;
			}
			if (typeof match == 'string') {
				let img = new Image();
				img.src = match;
				img.classList.add('pixeltastic_icon', 'icon');
				return img;
			}
			return originalGetIconNode(icon, color);
		}

		for (let id in BarItems) {
			let action = BarItems[id];
			if (action instanceof Action && icons[action.icon]) {
				action.setIcon(Blockbench.getIconNode(action.icon, action.color));
			}
		}

		let icon_nodes = document.querySelectorAll('i.icon');
		icon_nodes.forEach(node => {
			let key;
			if (node.classList.contains('fa_big')) {
				let match = node.className.match(/fa-[\w-]+/);
				if (match) key = match[0];
				if (node.classList.contains('fas')) key = 'fas.'+key;
				if (node.classList.contains('far')) key = 'far.'+key;
				if (node.classList.contains('fab')) key = 'fab.'+key;

			} else if (node.classList.contains('material-icons')) {
				key = node.textContent;
			}
			if (key && icons[key]) {
				let img = new Image();
				img.classList.add('pixeltastic_icon', 'icon');
				img.src = icons[key];
				let new_icon = Blockbench.getIconNode(img);
				node.replaceWith(new_icon);
			}
		})
	},
	onunload() {
	}
});
