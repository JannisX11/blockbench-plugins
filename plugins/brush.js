;(function () {
// 
//

const { PI } = Math;
const TWO_PI = PI * 2;
const QUARTER_NINETY_DEGREES = PI / 8;

/* Widgets */
const style = Blockbench.addCSS(
`#panel_mtbrush_settings .toolbar > .content {
	padding: 10px;
}
.bvoption {
	width: 100%;
	position: relative;
	cursor: pointer;
	transition: 100ms;
	display: flex;
	border-bottom: 3px solid transparent;
}
.bvoption img {
	width: 100%;
	image-rendering: pixelated;
	object-fit: contain;
	aspect-ratio: 1 / 1;
}
.bvoption:hover {
	filter: brightness(110%);
}
.bvoption.selected {
	filter: brightness(120%);
	border-bottom: 3px solid var(--color-accent);
	/*background: var(--color-ui);
	outline: 5px solid var(--color-ui);*/
}
.brushviewer {
	width: 100%;
	padding-bottom: 10px;
}
.bvoptions {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(30px, 1fr));
	
	background: var(--color-back);
	border: 1px solid var(--color-bright_ui);
	border-radius: 5px;
	
	margin-top: 5px;
	padding: 10px;
	gap: 10px;
	
	width: 90%;
	margin-left: 5%;
	z-index: 9;
}
/*  */
.checklist {
	width: 100%;
	gap: 10px;
}
.checklist > div {
	display: flex;
	gap: 10px;
	padding-inline: 15px;
	align-items: center;
}
.checklist > div > label {
	line-height: 30px;
}
.checklist > div > input:not(:checked) ~ i {
	display: none;
}
.checklist > div > i {
	font-size: 20px;
	margin-left: auto;
	transition: 100ms color; 
}
.checklist > div > i:hover {
	text-decoration: underline;
	color: var(--color-subtle_text)
}

/*  */
.mt-tool-settings {
	width: 95%;
	display: grid;
	gap: 1px 15px;
	grid-template-columns: max-content auto min-content;
}
.mt-tool-settings i:hover {
	color: var(--color-light);
    transition: color 750ms linear;
}
.mt-tool-settings i {
	margin-left: auto;
    padding-top: 8px;
    font-size: 13px;
    height: 28px;
    color: var(--color-subtle_text);
    display: block;
    width: 16px;
    text-align: center;
}

.bvoption::before {
	content: attr(flag);
	font-family: 'Material Icons';
	position: absolute;
	top: -5px;
	right: -5px;
	color: var(--color-accent);
	text-shadow: -1px 1px 0 black;
}
.mt-dynamics summary {
	color: var(--color-subtle_text);
	transition: color 100ms ease;
}
.mt-dynamics summary:hover, .mt-dynamics[open] summary { color: inherit }
.mt-dynamics summary::before {
	content: 'chevron_right';
	font-family: 'Material Icons';
	padding-inline: 3px;
}
.mt-dynamics[open] summary::before {
	content: 'expand_more';
}
</style>`)

function idToTitle(string) {
	let str = '';

	const stringLength = string.length
	for (let i = 0; i < stringLength; i++) {
		const c = i == 0 ? string[i].toUpperCase(): string[i];
	
		if (c.match(/[_\-\ ]/)) {			
			i++;
			str += ' ' + (string[i] ?? '').toUpperCase();
			
			continue;
		} else if (c.match(/\d/) && string[i - 1]?.match?.(/\D/)) {
			str += ' #';
		}

		str += c;
	}
	return str;
}
/* Types */
const drawOpts = {
	// texture coordinates
	x: 0,
	y: 0,
	// texture coordinates
	px: 0,
	py: 0,
	/** @type {MouseEvent} */
	event: null,
	// local
	localX: 0,
	localY: 0,
	// local. relative to the 'origin'
	gridX: 0,
	gridY: 0,
	// local. between [0-1]
	uvX: 0,
	uvY: 0,
}
/* API */
class BrushViewerOption {
	constructor(data) {
		this.id = data.id;
		this.src = data.src;
		this.condition = data.condition;
		this.node = Interface.createElement('div', {class: 'bvoption'});
		this.node.title = idToTitle(this.id);
		this.image = new Image();
		this.image.src = this.src;
		this.image.draggable = false;

		this.node.append(this.image);
	}
	select() {
		this.node.classList.add('selected');
	}
	unselect() {
		this.node.classList.remove('selected');
	}
}
const BrushViewer = {
	/** @type {BrushViewerOption[]} */
	children: null,
	node: Interface.createElement('div', {class: 'brushviewer'}),
	optionsnode: Interface.createElement('div', {class: 'bvoptions'}),
	value: null,
	init() {
		this.children = Object.keys(Brushes).map(id => Brushes[id].brushview);
		this.node.append(
			Interface.createElement('p', {class: 'panel_toolbar_label'}, 'Tool Shape'), 
			this.optionsnode
		);
		this.val(this.children[0]);
		this.build();
	},
	val(item) {
		const selected = this.children.find(e => e.id === this.value);
		if (!item) return selected;

		selected?.unselect();
		item.select()
		this.value = item.id;
	},
	build() {
		this.optionsnode.innerText = '';
		
		this.children.forEach(child => {
			child.node.onclick = () => {
				this.val(child);
			}
			this.optionsnode.append(child.node);
		})
	},
	add(item) {
		this.children.push(item);
		this.build();
		this.val(this.children[0]);
	},
	remove(key) {
		this.children.remove(this.children.find(e => e.id == key));
		this.build();
		this.val(this.children[0]);
	}
}

const MTMath = {
	rotatePoint(point, theta) {
		const x = point[0] * Math.cos(theta) - point[1] * Math.sin(theta);
		const y = point[0] * Math.sin(theta) + point[1] * Math.cos(theta);

		return [x, y];
	},
	rotatePointAroundTarget(point, target, theta) {
		let newPoint = point.map((a, i) => a - target[i]);
		newPoint = MTMath.rotatePoint(newPoint, theta);

		return newPoint.map((a, i) => a + target[i]);
	}
}

const dummyCanvas = document.createElement('canvas');
const dummyCtx = dummyCanvas.getContext('2d');

/** @type {{[id: string]: Brush}}*/
const Brushes = {}
class Brush {
	constructor(data) {
		Brushes[data.id] = this;
		this.icon = data.icon;
		this.id = data.id;
		this.custom = data.custom;

		this.brushview = new BrushViewerOption({
			id: this.id,
			src: this.icon
		})
		this.brushview.node.title += ' - ' + this.constructor.name.replace('Brush', ' Based');
		this.brushview.node.setAttribute('flag', this.constructor.flag)
	}
	/**
	 * @param {typeof drawOpts} data 
	 * @returns {Number}
	 */
	get(data) {
		return 1;
	}
}
class MathBrush extends Brush {
	static flag = "functions";
	constructor(data) {
		super(data);
		this.func = data.func;
	}
	/**
	 * @param {typeof drawOpts} data 
	 * @returns {Number}
	 */
	get(data) {
		return this.func(data);
	}
}
class ImageBrush extends Brush {
	static flag = "image";
	constructor(data) {
		super(data);
		this.image = new Image();

		/** @type {Uint8ClampedArray} */
		this.data = null;

		this.image.onload = () => {
			dummyCanvas.width = this.width;
			dummyCanvas.height = this.height;
			dummyCtx.drawImage(this.image, 0, 0, this.width, this.height);
			
			this.data = dummyCtx.getImageData(0,0, this.width, this.height).data;
			if (!data.save) return;

			this.custom = true;
			const base64 = dummyCanvas.toDataURL();
			addBrush(this.id, base64);
			BrushViewer.add(this.brushview)
		}
		this.image.src = this.icon;
	}
	get width() {
		return Math.clamp(this.image.width, 0, 50);
	}
	get height() {
		return Math.clamp(this.image.height, 0, 50);
	}
	/**
	 * @param {typeof drawOpts} data 
	 * @returns {Number}
	 */
	get({uvX, uvY}) {
		if (uvX < 0 || uvX > 1 || uvY < 0 || uvY > 1) return 0;

		const x = Math.floor(uvX * this.width);
		const y = Math.floor(uvY * this.height);
		const i = (x + y * this.width) * 4;

		const r = this.data[i + 0];
		const g = this.data[i + 1];
		const b = this.data[i + 2];
		const a = this.data[i + 3];
		const luminance = (0.2126*r + 0.7152*g + 0.0722*b) / 255;

		return luminance * (a / 255);
	}
}
/** @type {{[id: string]: Dynamic}}*/
const Dynamics = {}
class Dynamic {
	/**
	 * @param {String} id 
	 * @param {{
	 * onBefore: (data: typeof drawOpts) => void,
	 * onAfter: (result_color: {a: number}, data: typeof drawOpts) => void,
	 * settings: Object,
	 * description: string,
	 * }} data 
	 */
	constructor(id, data) {
		Dynamics[id] = this;
		this.id = id;

		this.settings = data.settings;
		this.description = data.description;
		this.onBefore = data.onBefore;
		this.onAfter = data.onAfter;
	}
	get(settingKey) {
		return this.settings[settingKey][0];
	}
}

// const radify = r => (r + TWO_PI) % TWO_PI;
const diff = (a,b) => Math.abs(a - b);
;(function() {
	
	let rotation = 0;
	let lastEvent, lastPos;
	new Dynamic('follow_rotation', {
		description: 'Rotates The Brush following the cursor',
		onBefore(data) {
			if (lastEvent != data.event && lastPos) {
				const direction = [data.x, data.y].V2_subtract(lastPos);
				const facArcPart = Math.atan2(direction[0], direction[1]) + PI;
				const oppArcPart = TWO_PI - facArcPart;
				const closest = diff(facArcPart, rotation) < diff(oppArcPart, rotation) ? facArcPart: oppArcPart;

				rotation = closest;
			}
			lastEvent = data.event;
			lastPos = [data.x, data.y];
	
			const p = [data.px, data.py];
			const t = [data.x, data.y];
			const newp = MTMath.rotatePointAroundTarget(p, t, rotation);
			data.px = Math.floor(newp[0]);
			data.py = Math.floor(newp[1]);
		}
	})
	
})();

;(function() {

	let lastrotation = 0;
	let lastEvent;
	new Dynamic('randomized_rotation', {
		description: 'Rotates The Brush randomly',
		onBefore(data) {
			if (lastEvent != data.event) {
				lastrotation = floorTo(Math.random() * PI * 2, QUARTER_NINETY_DEGREES);
			}
			lastEvent = data.event;
	
			const p = [data.px, data.py];
			const t = [data.x, data.y];
			const newp = MTMath.rotatePointAroundTarget(p, t, lastrotation);
			data.px = Math.floor(newp[0]);
			data.py = Math.floor(newp[1]);
		}
	})
	
})();
new Dynamic('velocity_opacity', {
	description: 'Transparentizes Color based on movement velocity',
	settings: {
		minimum_opacity: [30, 0, 100],
		maximum_opacity: [100, 1, 100],
	},
	onAfter(result, {event}) {
		result.a *= eventVelocity(event, 30, this.get('minimum_opacity')/100, this.get('maximum_opacity')/100);
	}
})

new Dynamic('velocity_tapering', {
	description: 'Tapers The Stroke based on movement velocity',
	settings: {
		minimum_tapering: [10, 0, 100],
		maximum_tapering: [100, 1, 100],
	},
	onAfter(result, {event, uvX, uvY}) {
		const factor = (0.9 - (eventVelocity(event, 25, this.get('minimum_tapering')/100, this.get('maximum_tapering')/100) - .1)) + .1;

		const radialFactor = Math.sqrt(radialGrad(uvX, uvY)) / Math.SQRT2;

		result.a = radialFactor < factor ? result.a: 0;
	}
})

let lastStrokeStartEvent;

;(function() {
	let lastEvent, lastStrokeEvent;
	
	let indexOfSharpening = 1;
	
	new Dynamic('sharpen_start', {
		description: 'Sharpens The Stroke at its tail',
		settings: {
			sharpen_length: [25, 10, 100],
		},
		onAfter(result, {event, uvX, uvY}) {
			if (lastEvent != event) {
				if (lastStrokeEvent != lastStrokeStartEvent) 
					indexOfSharpening = 1;
				else if (indexOfSharpening < this.get('sharpen_length'))
					indexOfSharpening ++;
			}
			
			const factor = indexOfSharpening / this.get('sharpen_length');
			const radialFactor = Math.sqrt(radialGrad(uvX, uvY)) / Math.SQRT2;
			
			result.a = radialFactor < factor ? result.a: 0;
	
			lastStrokeEvent = lastStrokeStartEvent;
			lastEvent = event;
		}
	})
})();
;(function() {
	let lastEvent, lastStrokeEvent;
	
	let indexOfFading = 1;
	
	new Dynamic('fade_start', {
		description: 'fades The Stroke at its tail',
		settings: {
			fading_length: [25, 10, 250],
		},
		onAfter(result, {event, uvX, uvY}) {
			if (lastEvent != event) {
				if (lastStrokeEvent != lastStrokeStartEvent) 
					indexOfFading = 1;
				else if (indexOfFading < this.get('fading_length'))
					indexOfFading ++;
			}
			
			result.a *=  indexOfFading / this.get('fading_length');
	
			lastStrokeEvent = lastStrokeStartEvent;
			lastEvent = event;
		}
	})
})();

/* https://easings.net/#easeInOutSine */
function easeInOutSine(x) {
	return -0.5*Math.cos(PI * x) + 0.5;
}
const eventVelocity = (e, scalar = 30, min = 0, max = 0.9) => {
	const velocity = Math.sqrt(e.movementX**2 + e.movementY**2);
	return easeInOutSine(Math.clamp(velocity / scalar, min, max));
}
const radialGrad = (x , y) => {
	Reusable.vec1.set(x, y, 0);
	Reusable.vec2.set(0.5, 0.5, 0);
	return Reusable.vec1.distanceToSquared(Reusable.vec2);
}
function floorTo(x, factor) {
	return Math.floor(x / factor) * factor;
}

new MathBrush({
	id: 'circle',
	icon: "data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='50' fill='white' /%3E%3C/svg%3E",
	func: ({uvX, uvY}) => Math.sqrt(radialGrad(uvX, uvY)) >= .5 ? 0: 1  
})
new MathBrush({
	id: 'circle_outline',
	icon: "data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='46' fill='transparent' stroke-width='4px' stroke='white' /%3E%3C/svg%3E",
	func({uvX, uvY}) {
		const v = Math.sqrt(radialGrad(uvX, uvY));
		return v >= .3 && v < .5 ? 1 : 0;
	}
})
new MathBrush({
	id: 'square',
	icon: "data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='white' /%3E%3C/svg%3E",
	func: ({uvX, uvY}) => uvX >= 0 && uvX <= 1 && uvY >= 0 && uvY <= 1 ? 1: 0
})
new MathBrush({
	id: 'line',
	icon: "data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m 0 50 l 100 0' stroke-width='4px' stroke='white' /%3E%3C/svg%3E",
	func: ({localY}) => localY == 0 || Math.abs(localY) == 0.5
})
new MathBrush({
	id: 'line2',
	icon: "data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m 50 0 l 0 100' stroke-width='4px' stroke='white' /%3E%3C/svg%3E",
	func: ({localX}) => localX == 0 || Math.abs(localX) == 0.5
})
new MathBrush({
	id: 'line3',
	icon: "data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m 0 0 l 100 100' stroke-width='4px' stroke='white' /%3E%3C/svg%3E",
	func: ({localX, localY}) => localX == localY
})
new MathBrush({
	id: 'line4',
	icon: "data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m 0 100 l 100 -100' stroke-width='4px' stroke='white' /%3E%3C/svg%3E",
	func: ({localX, localY}) => -localX == localY
})
new ImageBrush({
	id: 'benchblock', // my favorite 😘
	icon: 'assets/logo_cutout.svg'
})

new ImageBrush({
	id: 'choak',
	icon: 'data:image/png;base64,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'
})
new ImageBrush({
	id: 'bristles',
	icon: 'data:image/png;base64,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'
})
new ImageBrush({
	id: 'marker',
	icon: 'data:image/png;base64,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'
})

const save = JSON.parse(localStorage.getItem('brp_settings') ?? '{}');
const savedata = save;
function saveItem(name, value) {
	if (name) {
		savedata[name] = value;
	}
	localStorage.setItem('brp_settings', JSON.stringify(savedata));
}

const requestStorage = ({success = null, fail = null}) => {
	const request = indexedDB.open("brush_plus_settings", 2);
	request.onerror = fail;
	request.onblocked = fail;
	request.onupgradeneeded = () => {
		const brushDB = request.result;
		if (!brushDB.objectStoreNames.contains('data')) {
			brushDB.createObjectStore('data', {keyPath: 'id'});
		}
	}

	request.onsuccess = () => {
		if (!success) return;
		const brushDB = request.result;

		const transaction = brushDB.transaction("data", "readwrite");
		const data = transaction.objectStore("data");
		success(data);
	}
}
// Load Brushes
requestStorage({
	fail: console.warn,
	async success(data) {			
		if (savedata.brushes) {
			// migration from localStorage to indexedDB
			for (const brushId in savedata.brushes) {
				let brushData = savedata.brushes[brushId];
				if (isApp && !brushData.startsWith('data:image/')) {
					brushData = `data:image/${pathToExtension(brushData)};base64,` + fs.readFileSync(brushData, {encoding: 'base64'});
				}
				await addBrush(brushId, brushData);
			}


			delete savedata.brushes;
			saveItem();
		}

		const allBrushes = data.getAll();
		allBrushes.onsuccess = () => 
			allBrushes.result.forEach(datapoint => BrushViewer.add( new ImageBrush({...datapoint, custom: true}).brushview ));
		
		allBrushes.onerror = () => 
			Blockbench.showMessageBox('Failed to load saved brushes!');
	}
});
const addBrush = (id, icon) => new Promise((resolve, reject) => 
	requestStorage({
		fail: reject,
		success(data) {
			const addRequest = data.add({id, icon});
			addRequest.onsuccess = resolve;
			addRequest.onerror = reject;
		}
}));
const deleteBrush = (id) => new Promise((resolve, reject) => 
	requestStorage({
		fail: reject,
		success(data) {
			const addRequest = data.delete(id);
			addRequest.onsuccess = resolve;
			addRequest.onerror = reject;
		}
}));

const DynamicsCheckList = {
	structure: Object.entries(Dynamics),
	checked: [],
	node: Interface.createElement('div', { class: 'checklist' }),

	build() {
		this.structure.forEach(([key, dynamic]) => {
			const id = bbuid(6);
			const inode = Interface.createElement('div');
			const checkbox = Interface.createElement('input', {id, type:'checkbox'});
			
			inode.append(
				checkbox, 
				Interface.createElement('label', {for: id, title: dynamic.description}, idToTitle(key))
			);
			if (dynamic.settings) {
				const editButton = Blockbench.getIconNode('edit');
				const form = {}
				for (const settingKey in dynamic.settings) {
					const setting = dynamic.settings[settingKey];
					
					form[settingKey] = {label: idToTitle(settingKey), type: Blockbench.isNewerThan('4.5.0-beta.1') ? 'range': 'number', value: setting[0]};
					
					if (1 in setting)
						form[settingKey].min = setting[1];
					if (2 in setting)
						form[settingKey].max = setting[2];
				}

				const editDialog = new Dialog({
					title: 'Edit Dynamic Settings',
					form,
					onConfirm(formData) {
						for (const settingKey in formData) {
							const newSettingValue = formData[settingKey];
							
							dynamic.settings[settingKey][0] = newSettingValue;
						}
					}
				})
				
				editButton.addEventListener('click', () => editDialog.show())

				inode.append(editButton);
			}

			inode.addEventListener('input', () => {
				if (checkbox.checked) {
					this.checked.safePush(key);
				} else {
					this.checked.remove(key);
				}
			})

			this.node.append(inode);
		})
	}
}
DynamicsCheckList.build();
BrushViewer.init()

/**
 * @param {String} message
 * @throws {Error}
 */
const showErrorInDialog = message => {
	Blockbench.showQuickMessage(message, 2000);
	throw new Error(message)
}
let brushp;
BBPlugin.register('brush', {
	title: "Brush Plus",
	icon: "fa-brush",
	author: "Malik12tree",
	description: "Create/Use custom brushes with dynamic behavior!",
	version: "1.0.0",
	min_version: "4.4.0",
	variant: "both",
	tags: ["Paint", "Customization", "Interface"],
	onload() {
		Panels?.mtbrush_settings?.delete();
		
		/* Utils */
		const settingsMap = {
			size: BarItems.slider_brush_size,
			opacity: BarItems.slider_brush_opacity,
			softness: BarItems.slider_brush_softness,
			aspect: (save.aspect ?? 100) / 100,
			spacing: (save.spacing ?? 0) / 10,
			preservePixels: save.preservePixels ?? false,
			get brush() {
				return Brushes[BrushViewer.value];
			}
		}
		/**
		 * @param {keyof settingsMap} name 
		 */
		function setting(name) {
			return settingsMap[name]?.value ?? settingsMap[name] ?? 0;
		}
		/*  */
		
		const customBrushDialog = new Dialog({
			title: 'Custom Brush',
			form: {
				name: {
					type: 'text',
					label: 'Name',
					value: 'New Brush',
				},
				file: {
					type: 'file',
					extensions: ['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'tif', 'gif'],
					label: "Texture",
					readtype: "image",
				},
			},
			lines: ['<span class="subtle" >Blockbench\'s maximum brush size is 50 meaning images with dimensions greater than 50x50 would lose detail.<br>Black/Transparent -> White/Opaque represents base opacity of the brush.</span>'],
			form_first: true,
			onConfirm({file, name})  {
				if (!name || name in Brushes) {
					showErrorInDialog('Please provide a unique name!');
				}
				else if (!file) {
					showErrorInDialog('Please provide an image file!');
				}

				BrushViewer.add(
					new ImageBrush({
						id: name,
						icon: file,
						save: true
					}).brushview
				);
			}
		})
		new Panel ({
			id: 'mtbrush_settings',
			name: 'Brush Settings',
			icon: 'fa-brush',
			condition: { modes: ['paint'], /* method: () => Toolbars.tools.selected && Toolbars.tools.selected.id == 'brushplus' */ },
			default_position: {
				slot: 'right_bar',
				float_position: [0, 0],
				float_size: [300, 400],
				height: 400,
			},
			component: {
				methods: {
					setAspect(event) {
						const x = event.target.value;
						this.aspect = x;
						settingsMap.aspect = x / 100;
						saveItem('aspect', x);
					},
					setSpacing(event) {
						const x = event.target.value;
						this.spacing = x;
						settingsMap.spacing = 0.1 * x;
						saveItem('spacing', x);
					},
					setPreservePixels(event) {
						const x = event.target.checked;
						this.preservePixels = x;
						settingsMap.preservePixels = x;
						saveItem('preservePixels', x);
					},
					showPreservePixelsInfo() {
						Blockbench.showMessageBox({
							title: 'Preserve Pixels ?',
							message: 'When enabled, overlapping pixels of opacity in the same stroke remain intact; resulting in a flat stroke color.<br/>Blockbench\'s default brush uses this behavior.',
						});
					},
					addCustomBrush() {
						customBrushDialog.show();
					},
					removeCustomBrush() {
						const selected = BrushViewer.value;
						if (!Brushes[selected].custom) return;

						deleteBrush(selected)
						.then(() => {
							BrushViewer.remove(selected);
							BrushViewer.remove(selected);
							delete Brushes[selected];
							Blockbench.showQuickMessage(`Succesfully removed '${selected}'!`, 2000)
						})
						.catch(() => Blockbench.showQuickMessage('Failed to remove brush!', 2000));
					}
				},
				data() {
					return {
						aspect: save.aspect ?? 100,
						spacing: save.spacing ?? 0,
						preservePixels: save.preservePixels ?? false,
					}
				},
				template: `
				<div style="overflow-y:auto;">
					<div class="toolbar">
						<div @click="addCustomBrush" class="tool add_custom_brush"><div class="tooltip">Add Custom Brush<label class="keybinding_label"></label></div><i class="fa_big icon fa fa-plus-circle"></i></div>
						<div @click="removeCustomBrush" class="tool remove_custom_brush"><div class="tooltip" style="margin-left: 0px;">Remove Custom Brush<label class="keybinding_label"></label></div><i class="fa_big icon fa fa-circle-minus"></i></div>
					</div>
					<div class='mt-tool-settings' id='mt-brushshape-target'>
						<p class="panel_toolbar_label">Aspect</p>
						<input type='range'  @input="setAspect" min="0" max="100" :value="aspect" />
						<input type='number' @input="setAspect" min="0" max="100" :value="aspect" class="dark_bordered"/>
						<p class="panel_toolbar_label">Spacing</p>
						<input type='range'  @input="setSpacing" min="0" max="100" :value="spacing" />
						<input type='number' @input="setSpacing" min="0" max="100" :value="spacing" class="dark_bordered"/>
						<p class="panel_toolbar_label"><label for="_preserve_pixels">Preserve Pixels</label></p>
						<input type='checkbox' id="_preserve_pixels" @input="setPreservePixels" :checked="preservePixels" />
						<i class="fa fa-question" @click="showPreservePixelsInfo"></i>
					</div>
					<hr>
					<details class="mt-dynamics"><summary>Dynamics</summary></details>
				</div>
				`
			}
		});
		$(BrushViewer.node).insertBefore(document.getElementById('mt-brushshape-target'));
		
		Panels.mtbrush_settings.node.querySelector('details').append(DynamicsCheckList.node);

		/* Intalized on load for better performness */
		const drawOptions = {
			x: 0, y: 0, px: 0, py: 0, event: null, // Changable in dynamics
			// Calculated once on `Brush.get` if the paramater was destructed.
			get localX() { return this.px - this.x },
			get localY() { return this.py - this.y },
			get gridX()  { return this.localX + this.radius },
			get gridY()  { return this.localY + this.radius },
			get uvX()    { return this.gridX / this.size },
			get uvY()    { return this.gridY / this.size },
			size: 0,
			radius: 0,
		}
		const pointBefore = {x: 0, y: 0, z: 0}
		brushp?.delete?.();

		const resultHolder = {a: 0}
		brushp = new Tool('brushplus', {
			name: 'Brush Plus',
			icon: 'fa-brush',
			category: 'tools',
			toolbar: 'brush',
			alt_tool: 'color_picker',
			cursor: 'crosshair',
			selectFace: true,
			transformerMode: 'hidden',
			paintTool: true,
			allowed_view_modes: ['textured'],
			keybind: new Keybind({key: 'b', shift: true}),
			modes: ['paint'],
			onCanvasClick(data) { Painter.startPaintToolCanvas(data, data.event); },
			onSelect() {
				BarItems.brush_shape.set('square');
				UVEditor.vue.brush_type = 'square';

				Painter.updateNslideValues();
			},
			brush: {
				blend_modes: false,
				shapes: false,
				size: true,
				softness: true,
				opacity: true,
				offset_even_radius: true,
				floor_coordinates: true, //() => BarItems.slider_brush_softness.get() == 0,

				onStrokeStart(data) {
					lastStrokeStartEvent = data.event;
					pointBefore.x = mouse_pos.x;
					pointBefore.y = mouse_pos.y;
				},
				changePixel(px, py, pxcolor, local_opacity, {color, texture, opacity, x, y, event}) {
					/* Aspect */
					const height = setting('size') * setting('aspect');
					const alocalY = Math.abs(py - y);
					if (alocalY * 2 > height) return pxcolor;

					/* Spacing */
					const { vec1 } = Reusable;
					vec1.set(event.offsetX, event.offsetY, 0);

					const spacing = setting('spacing') * setting('size') ;
					
					const dstToBefore = vec1.distanceToSquared(pointBefore);
					if (dstToBefore != 0 && dstToBefore < spacing*spacing) return pxcolor;
					
					pointBefore.x = event.offsetX;
					pointBefore.y = event.offsetY;

					/*  */
					const size = setting('size');
					const radius = size / 2;
					if (size % 2 == 0) {
						x -= 0.5;
						y -= 0.5;
					}

					drawOptions.x = x;
					drawOptions.y = y;
					drawOptions.px = px;
					drawOptions.py = py;
					drawOptions.event = event;
					drawOptions.size = size;
					drawOptions.radius = radius;

					DynamicsCheckList.checked.forEach(dynamic => Dynamics[dynamic]?.onBefore?.(drawOptions)); /* Apply Before Dynamics */

					const brushfactor = setting('brush').get(drawOptions);
					let a = opacity * local_opacity * brushfactor;
					
					resultHolder.a = a;
					DynamicsCheckList.checked.forEach(dynamic => Dynamics[dynamic]?.onAfter?.(resultHolder, drawOptions)); /* Apply After Dynamics */
					a = resultHolder.a;

					if (setting('preservePixels')) {
						let before = Painter.getAlphaMatrix(texture, px, py);
						Painter.setAlphaMatrix(texture, px, py, a);
						if (a > before) {
							a = (a - before) / (1 - before);
						} else if (before) {
							a = 0;
						}
					}

					if (!isFinite(a)) a = 0;

					const result_color = Painter.combineColors(pxcolor, color, a);

					if (Painter.lock_alpha) result_color.a = pxcolor.a;
					return result_color;
				}
			}
		});
		Toolbars.tools.add(brushp);
	},
	onunload(){
		Panels?.mtbrush_settings?.delete();

		brushp?.delete?.();
		Toolbars.tools.children.forEach(tool => {
			if (tool.id === 'brushplus') tool.delete();
		})
		
		style.delete();
	},
	onuninstall() {
		localStorage.removeItem('brp_settings');
		indexedDB.deleteDatabase('brush_plus_settings');
	}
});

})();
