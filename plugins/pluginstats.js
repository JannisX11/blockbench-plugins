;(function () {
const STORE = "store";
const MAX_WEEKS = 26; // half year
const URL = 'https://blckbn.ch/api/stats/plugins?weeks=';
const KEY_STORAGE = 'ps-data';

/**
 * https://github.com/Malik12tree/LineGraph.js
 * @author Malik12tree
 */
const Graph = (function() {


const xmlns = "http://www.w3.org/2000/svg";

class SVGShapeContainer {
	constructor(width, height) {
		this.node = document.createElementNS(xmlns, "svg");
		this.groupNode = document.createElementNS(xmlns, "g");

		this.node.append(this.groupNode);

		this.setSize(width, height);
	}
	setPadding(paddingInPercent) {
		const g = this.groupNode;
		
		if (paddingInPercent != 1) {
			g.setAttributeNS(null, 'transform', `scale(${paddingInPercent})`);
			g.setAttributeNS(null, 'transform-origin', 'center');
			return this;
		}
		g.removeAttributeNS(null, 'transform');
		g.removeAttributeNS(null, 'transform-origin');
		return this;
	}
	setSize(width, height) {
		this.width = width;
		this.height = height;

		this.node.setAttributeNS(null, "viewBox", "0 0 " + width + " " + height);
		this.node.setAttributeNS(null, "width", width);
		this.node.setAttributeNS(null, "height", height);
	}
	add(...svgshapes) {
		svgshapes.forEach(shape => {
			this.groupNode.append(shape.node ?? shape);
		});

		return this;
	}
}
class SVGShape {
	constructor() {
		let scopedPath = '';
		Object.defineProperty(this, 'path',{
			enumerable: true,
			get() {
				return scopedPath;
			},
			set(value) {
				scopedPath = value;
				this.attr('d', value);
			}
		});

		this.absoulteForced = false;

		this.node = document.createElementNS(xmlns, "path");
	}
	forceAbsoulte(v) {
		this.absoulteForced = v;
		return this;
	}
	clear() { 
		this.path = '';
		return this;
	}
	attr(idNS, value) {
		this.node.setAttributeNS(null, idNS, value);
		return this;
	}
	stroke(color) {
		if (color == '0') color = 'transparent';
		return this.attr('stroke', color);
	}
	strokeWidth(value) {
		return this.attr('stroke-width', value);
	}
	fill(color) {
		if (color == '0') color = 'transparent';
		return this.attr('fill', color);
	}

	command(name, relative, ...params) {
		if (this.absoulteForced) relative = false;
		
		name = relative ? name : name.toUpperCase();

		if (this.path != '') this.path += ' ';

		if (0 in params) {
			this.path += name + ' ' + params.join(' ');
		} else {
			this.path += name;
		}
		return this;
	}
	close() {
		return this.command('z', false);
	}

	moveTo(x, y, relative = true) {
		return this.command('m', relative, x, y);
	}
	lineTo(x, y, relative = true) {
		return this.command('l', relative, x, y);
	}
	lineToHorizontal(x, relative = true) {
		return this.command('h', relative, x);
	}
	lineToVertical(y, relative = true) {
		return this.command('v', relative, y);
	}

	//
	cubicBezier(
		startX, startY,
		controlPoint1X, controlPoint1Y,
		controlPoint2X, controlPoint2Y,
		endX, endY,
		relative = true
	) {

		this.moveTo(startX, startY, relative);
		return this.command('c', relative, controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y, endX, endY);
	}
	smoothCubicBezier(
		startX, startY,
		controlPoint2X, controlPoint2Y,
		endX, endY,
		relative = true
	) {

		this.moveTo(startX, startY, relative);
		return this.command('s', relative, controlPoint2X, controlPoint2Y, endX, endY);
	}

	//
	quadraticBezier(
		startX, startY,
		controlPointX, controlPointY,
		endX, endY,
		relative = true
	) {

		this.moveTo(startX, startY, relative);
		return this.command('q', relative, controlPointX, controlPointY, endX, endY);
	}
	smoothQuadraticBezier(
		startX, startY,
		endX, endY,
		relative = true
	) {

		this.moveTo(startX, startY, relative);
		return this.command('t', relative, endX, endY);
	}

	//
	ellipticalArc(
		radiusX, radiusY,
		largeArcFlag, sweepFlag,
		x, y,
		relative = true
	) {
		return this.command('a', relative, radiusX, radiusY, largeArcFlag, sweepFlag, x, y);
	}

	circle(x,y, rx, ry, relative) {
        this.moveTo(x - rx, y, relative);
		this.ellipticalArc(rx, ry, 0, '1,1', rx*2, 0);
		this.ellipticalArc(rx, ry, 0, '1,1', -rx*2, 0);
		return this;
	}
}

const snap = (x, factor) => Math.round(x / factor) * factor;
const inverseLerp = (min, max, v) => (v - min) / (max - min);


return class Graph {
	/** @param {GraphData} data */
	constructor(data) {
		this.datapoints = data.datapoints;
		this.onValue = data.onValue;
		this.onCancel = data.onCancel;
		this.minmax = data.minmax ?? [];
		if (!data.minmax) this.computeMinMax();
		
		data.style = data.style ?? {};
		const style = this.style = data.style;

		style.strokeWidth = style.strokeWidth ?? 1;
		style.padding = style.padding ?? 1;
		style.lineSize = style.lineSize ?? 1;
		style.lineColor = style.lineColor ?? '#ff6996';
		style.strokeColor = style.strokeColor ?? '#ff6996';
		style.fillColor = style.fillColor ?? '#ff699622';
		
		this.node = document.createElement('div');
		this.node.classList.add('graph');
		this.node.style.width = 'fit-content';

		this.svgStroke = new SVGShape().fill(0);
		this.svgFill = new SVGShape().fill(0);
		this.svgOverlay = new SVGShape();
		this.svgStroke.node.classList.add('graphStroke');
		this.svgFill.node.classList.add('graphFill');
		this.svgOverlay.node.classList.add('graphLine');

		this.svgContainer = new SVGShapeContainer(0,0)
		.add(this.svgStroke, this.svgFill, this.svgOverlay)

		this.node.append(this.svgContainer.node);
		
		let _oldIndex = -1;
		
		this.node.addEventListener('mouseenter', e => {
			const data = this.updateContextualLine(e);
			_oldIndex = data.index;
			this?.onValue?.(data);
		});
		this.node.addEventListener('mousemove', e => {
			const data = this.updateContextualLine(e);
			const tempIndex = data.index;
			if (tempIndex == _oldIndex) return;

			_oldIndex = tempIndex;
			this?.onValue?.(data);
		} );
		this.node.addEventListener('mouseleave', () => {
			this.svgOverlay.clear();
			this?.onCancel?.();
		});
		
		this.setSize(data.width, data.height);
		this.extendStyle(style);
		this.update();
	}
	setSize(width, height) {
		width = width ?? 200;
		height = height ?? 200;

		this.width = width;
		this.height = height;

		this.svgContainer.setSize(width, height);

		this.node.style.width = width + 'px';
		this.node.style.height = height + 'px';
		this.updateSVGOrigin();
	}
	computeMinMax() {
		if (typeof this.minmax != 'object') this.minmax = [];
		
		this.minmax[0] = Math.min(...this.datapoints);
		this.minmax[1] = Math.max(...this.datapoints);
		return this;
	}
	updateSVGOrigin() {
		const offsetX = this.width * this.style.padding * 0.5;
		const offsetY = this.height * this.style.padding * 0.5;
		this.svgContainer.groupNode.setAttributeNS(null, 'transform-origin', `${offsetX}px ${offsetY}px`);
	}
	/** @param {GraphStyleData} data */
	extendStyle(data) {
		['strokeWidth','padding','lineSize','lineColor','strokeColor','fillColor']
		.forEach(key => {
			this.style[key] = data[key] ?? this.style[key];
		});
		this.svgContainer.setPadding(this.style.padding);
		this.updateSVGOrigin();

		this.svgStroke.stroke(this.style.strokeColor).strokeWidth(this.style.strokeWidth);
		this.svgFill.fill(this.style.fillColor);
		
		this.svgOverlay.fill(this.style.lineColor);
	}
	/** @param {MouseEvent} event */
	updateContextualLine(event) {
		const length = this.datapoints.length - 1;
		const factor = this.width / length;

		const smallOffset = 0.5 - this.style.padding/2;
		const sampledOffsetPercentage = (event.offsetX/this.width - smallOffset) / this.style.padding;
		const sampledOffset = Math.min(Math.max(sampledOffsetPercentage, 0), 1) * this.width;

		const x = Math.floor(snap(sampledOffset, factor));
		const i = Math.round(sampledOffset / this.width * length);
		const y = this.yOf(i);

		const size = this.style.lineSize / 2;
		const r = 4*size;
		
		const xLeft = x - size;
		const xRight = x + size;
		const yToFirst = y - r;

		const yFromSec = y + r;
		const yToSec = this.height;

		this.svgOverlay
		.clear()
		.forceAbsoulte(true)
		.moveTo(xLeft, 0).lineTo(xRight, 0).lineTo(xRight, yToFirst).lineTo(xLeft, yToFirst)
		.close()
		.moveTo(xLeft, yFromSec).lineTo(xRight, yFromSec).lineTo(xRight, yToSec).lineTo(xLeft, yToSec)
		.close()
		.forceAbsoulte(false)
		.circle(x, y, r, r, false);


		return {value: this.datapoints[i], offset: sampledOffsetPercentage, index: i}
	}
	yOf(i) {
		return this.height - inverseLerp(
			this.minmax[0],
			this.minmax[1],
			this.datapoints[i]
		) * this.height;
	}
	update() {
		this.svgStroke.clear();
		this.svgFill.clear();

		const length = this.datapoints.length - 1;

		for (let i = 0; i <= length; i++) {
			const x = i / length * this.width;
			const y = this.yOf(i);
			
			if (i == 0) {
				this.svgStroke.moveTo(x, y);
				this.svgFill.moveTo(x, y);
			} else {
				this.svgStroke.lineTo(x, y, false);
				this.svgFill.lineTo(x, y, false);
			}

		}
		if (1 in this.datapoints) {
			this.svgFill.lineTo(this.width, this.height, false).lineTo(0, this.height, false);
		}
		// 0 sized circle that keeps the the height of the container constant
		this.svgFill.circle(0,0, 0, 0, false);
	}
}
})();

const pluginMap = {};
Plugins.all.forEach(plugin => pluginMap[plugin.id] = plugin);

let downloadData = [];
async function initializeAllDownloadData() {
	const storageDataMaybe = sessionStorage.getItem(KEY_STORAGE);
	if (storageDataMaybe) {
		downloadData = JSON.parse(storageDataMaybe);
		return;
	}

	for (let i = 1; i <= MAX_WEEKS; i++) {		
		const weeksData = await new Promise(resolve => 
			$.getJSON(URL + i, weeksData => resolve(weeksData))
		);
		downloadData.push(weeksData);
	}
	sessionStorage.setItem(KEY_STORAGE, JSON.stringify(downloadData));
}
function dateSinceWeeks(numberOfWeeks, exclusive) {
	const date = new Date();
	const dayOfTheWeek = date.getDay();

	let offset = date.getDate() - numberOfWeeks * 7;
	offset -= dayOfTheWeek; // offset date to sunday of the week
	offset += 4;            // offset date to thursday of the week. apparently thursday is the start of the week
	if (exclusive) offset --;

	date.setDate(offset);

	return date.toLocaleDateString('en-GB');
}
const format = Intl.NumberFormat('en').format;

const get = selector => dialog.object.querySelector(selector);

function updateHTML(id) {
	const plugin = pluginMap[id];
	
	get('#ps-rank').innerText = Plugins.all.indexOf(plugin) + 1;
	const authorElement = get('#ps-author');
	const versionElement = get('#ps-version');
	const weeklyElement = get('#ps-weekly');
	const yearlyElement = get('#ps-yearly');
	const peakElement = get('#ps-peak');

	authorElement.innerText = plugin.author;
	versionElement.innerText = plugin.version;

	weeklyElement.innerText = format(downloadData[0][id]);
	yearlyElement.innerText = format(downloadData.at(-1)[id]);

	const downloadDataLength = downloadData.length;
	let maximumValue = 0;
	for (let i = 0; i < downloadDataLength; i++) {
		const index = downloadDataLength - i - 1;	
		const weekDownloads = downloadData[index]?.[id] ?? 0;
		const nextWeekDownloads = downloadData[index - 1]?.[id] ?? 0;

		graph.datapoints[i] = weekDownloads - nextWeekDownloads;
		maximumValue = Math.max(maximumValue, graph.datapoints[i]);
	}
	peakElement.innerText = format(maximumValue);

	graph.minmax[1] = maximumValue / 0.95;
	graph.update();
}

const dialogOptions = {}
const dialog = new Dialog({
	width: 600,
	id: 'plugin_stats',
	title: 'Plugin Statistics',
	part_order: ['form', 'lines'],
	buttons: ['dialog.ok'],
	resizable: false,

	form: {
		plugin: { label: 'Plugin', type: 'select', options: dialogOptions }
	},
	onFormChange(data) {
		updateHTML(data.plugin);
	},
	lines: [
`
<span class="subtle">Ranked #<span id="ps-rank"></span> this week</span>
<div class="ps-stats">
	<div class="ps-stat">
		<h3>Author</h3>
		<span id="ps-author">??</span>
	</div>
	<div class="ps-stat">
		<h3>Version</h3>
		<span id="ps-version">??</span>
	</div>
	<div class="ps-stat">
		<h3>Weekly Downloads</h3>
		<span id="ps-weekly">??</span>
	</div>
	<div class="ps-stat">
		<h3>Half-Yearly Downloads</h3>
		<span id="ps-yearly">??</span>
	</div>
	<div class="ps-stat">
		<h3>Peak</h3>
		<span id="ps-peak">??</span>
	</div>
</div>
<div id="ps-graph">
	<span class="ps-graph-info"></span>
	<span class="ps-label" y>Downloads</span>
	<span class="ps-label" x>Weeks</span>
	<span style="grid-area:holder"></span>
</div>
<style>
#plugin_stats .dialog_content {
	overflow-x: hidden;
}
.ps-stats {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}
.ps-stat {
	width: 47%;
	padding-block: 5px;
	border-bottom: 1px solid var(--color-border);
}
.ps-stat h3 {
	margin: 0;
	display: block;
	color: var(--color-subtle_text);
}
.ps-stat span {
	padding-left: 2px;
}
.ps-graph-info:empty::before {
	/* Keeps the size of the span (even when empty) */
	content: '0';
	color: transparent !important;
} 
.ps-graph-info {
	width: 100%;
	padding-bottom: 5px;
	text-align: left;
	font-family: monospace;
	font-size: 0.85em;
	color: var(--color-subtle_text);
}
#ps-graph {
	padding-top: 10px;
	display: grid;
    grid-template-areas: 
		"info info"
		"y graph"
		"holder x";
}

.ps-graph-info { grid-area: info }
.graph { grid-area: graph }
.ps-label {
	color: var(--color-subtle_text);
}
.ps-label[x] { grid-area: x }
.ps-label[y] {
	grid-area: y;
    writing-mode: vertical-lr;
    transform: rotate(180deg);
}

#ps-graph svg {
	display: block;
}

</style>`
	],
});
const graph = new Graph({
	datapoints: [0,0],
    width: 1,
    height: 1,
    minmax: [0, 17500],
    style: {
        strokeWidth: 2,
        lineSize: 2,
        padding: 0.95,
    },
    onValue({index, value}) {
		const downloadsSince = format(value);
		const downloads = downloadsSince <= 0 ? 'unreleased': downloadsSince;
		const numberOfWeeks = MAX_WEEKS - index - 1;
		const from = dateSinceWeeks(numberOfWeeks);
		const to = dateSinceWeeks(numberOfWeeks - 1, true);
		get('.ps-graph-info').innerText = `${from} to ${to} ≈ ${downloads}`;
	},
	onCancel() {
		get('.ps-graph-info').innerText = '';
	}
});
const spinningIcon = () => {
	const icon_node = Blockbench.getIconNode('donut_large');
	icon_node.classList.add('spinning');
	return icon_node;
}

let action;
let loadingAction;
let isPluginStateDead = false;

const meta = {
	"title": "Plugin Statistics",
	"icon": "trending_up",
	"author": "Malik12tree",
	"description": "View download statistics of your blockbench plugin",
	"version": "1.2.0",
	"variant": "both",
	"tags": ["Blockbench", "Plugins", "Development"]
}
BBPlugin.register('pluginstats', {
	...meta,
	onload() {
		loadingAction = new Action('plugin_stat_loading', {
			name: 'Fetching Plugin Statistics..',
			icon: spinningIcon(),
		});

		action = new Action('plugin_stat_action', {
			name: 'View ' + meta.title,
			icon: meta.icon,
			description: meta.description,
			click() {
				dialog.show();
				
				graph.extendStyle({
					lineColor: CustomTheme.data.colors.accent,
					strokeColor: CustomTheme.data.colors.accent,
					fillColor: CustomTheme.data.colors.accent + '22'
				});
				
				get('#ps-graph').append(graph.node);
				updateHTML(open_interface.getFormResult().plugin ?? Plugins.all[0].id);
				
				const rect = get('content.dialog_content').getBoundingClientRect();
				graph.setSize(rect.width - 30, 200);
				graph.update();
			}
		});
		
		MenuBar.addAction(loadingAction, 'tools');

		initializeAllDownloadData().then(() => {
			if (isPluginStateDead) return;

			// sort if not sorted
			if (!Object.values(Plugins.download_stats).length) {
				Plugins.download_stats = downloadData[1];
				Plugins.sort();
			}
			// 
			// setup options
			Plugins.all.forEach(plugin => {
				if (plugin.source != STORE) return;
				
				dialogOptions[plugin.id] = plugin.title;
			});
			//

			loadingAction.delete();
			MenuBar.addAction(action, 'tools');
		});
	},
	onunload() {
		isPluginStateDead = true;
		action.delete();
		loadingAction.delete();
	}
});

})();