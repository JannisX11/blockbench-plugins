class Deletable {
	delete: () => void
}

/**
 * True if Blockbench runs as a native app
 */
const isApp: boolean

type EventName = 'remove_animation'
	| 'display_animation_fram'
	| 'before_closing'
	| 'create_session'
	| 'join_session'
	| 'quit_session'
	| 'send_session_data'
	| 'receive_session_data'
	| 'user_joins_session'
	| 'user_leaves_session'
	| 'process_chat_message'
	| 'update_settings'
	| 'update_project_settings'
	| 'save_project'
	| 'load_project'
	| 'new_project'
	| 'reset_project'
	| 'close_project'
	| 'add_cube'
	| 'add_group'
	| 'update_selection'
	| 'update_keyframe_selection'
	| 'select_all'
	| 'added_to_selection'
	| 'invert_selection'
	| 'canvas_select'
	| 'canvas_click'
	| 'change_texture_path'
	| 'add_texture'
	| 'finish_edit'
	| 'finished_edit'
	| 'undo'
	| 'redo'
	| 'select_mode'
	| 'unselect_mode'
namespace Blockbench {
	const platform: 'web' | 'win32' | 'darwin' | 'linux'
	const version: string
	/**
	 * Time when Blockbench was opened
	 */
	const openTime: Date
	function reload(): void
	/**
	 * checks if Blockbench is newer than the specified version
	 * 
	 * @param version
	 * semver string
	 */
	function isNewerThan(version: string): boolean
	/**
	 * checks if Blockbench is older than the specified version
	 * 
	 * @param version
	 * semver string
	 */
	function isOlderThan(version: string): boolean
	/**
	 * Resolves an icon string as a HTML element
	 * @param icon 
	 * Material Icons, Fontawesome or custom icon string
	 * @param color 
	 * CSS color
	 */
	function getIconNode(icon: IconString, color?: string): HTMLElement
	/**
	 * Shows a passing message in the middle of the screen
	 * 
	 * @param message 
	 * Message
	 * @param time 
	 * Time in miliseconds that the message stays up
	 */
	function showQuickMessage(message: string, time?: number): void

	function showStatusMessage(message: string, time?: number): void

	function setStatusBarText(text?: string): void
	/**
	 * Set the value of a progress bar
	 * 
	 * @param progress 
	 * Progress of the bar between 0 and 1
	 * @param time 
	 * Time over which the bar is animated, in miliseconds
	 * @param bar
	 * ID of the bar element. If omitted, the main status bar will be selected
	 */
	function setProgress(progress: number, time?: number, bar?: string): void

	function showMessageBox(options: object, callback: (buttonID: number) => void): void

	function textPrompt(title: string, value: string, callback: (value: string) => void): void
	/**
	 * Opens the specified link in the browser or in a new tab
	 * 
	 * @param link 
	 */
	function openLink(link: URL): void

	function notification(title: string, text: string, icon?: string): void

	function addCSS(css: string): Deletable

	function addFlag(flag: string): void
	function removeFlag(flag: string): void
	function hasFlag(flag: string): boolean

	function dispatchEvent(event_name: EventName, data: object): void

	function addListener(event_names: EventName, callback: (data: object) => void): Blockbench
	let on = this.addListener

	function removeEventListener(event_names: EventName): void
}


interface PluginData {
	title: string
	author: string
	description: string
	icon: string
	variant: 'desktop' | 'web' | 'both'
	about?: string
	min_version: string
	max_version: string
	onload: function
	onunload: function
	oninstall: function
	onuninstall: function
}
class Plugin {
	static register(id: string, data: PluginData): Plugin
	constructor (): void
}

type Condition = any

interface PanelOptions {
	id: string
	icon: string
	menu?: any
	growable?: boolean
	name: string
	selection_only?: boolean
	condition?: Condition
	onResize: () => void
	toolbars: object
	component: Vue.Component
	default_side: any
	insert_before: any
	insert_after: any
}
class Panel {
	constructor (options: PanelOptions)
}


interface PropertyOptions {
	default?: any
	condition?: any
	exposed?: boolean
	label?: string
	/**
	 * Options used for select types
	 */
	options?: object
	merge?: (instance: any, data: object) => void
	reset?: (instance: any) => void
	merge_validation?: (value: any) => boolean
}
/**
 * Creates a new property on the specified target class
 */
class Property {
    constructor(target_class: any, type: string, name: string, options?: PropertyOptions);
    class: any;
    name: string;
    type: string;
	default: any;
	
    isString: boolean;
    isMolang: boolean;
    isNumber: boolean;
    isBoolean: boolean;
    isArray: boolean;
    isVector: boolean;
	isVector2: boolean;
	
    merge_validation: undefined | ((value: any) => boolean);
    condition: any;
    exposed: boolean;
    label: any;
	merge: (instance: any, data: object) => void
	reset: (instance: any) => void
    delete(): void;
    getDefault(instance: any): any;
    copy(instance: any, target: any): void;
}




type ArrayVector3 = number[3]
type ArrayVector2 = number[2]

/**
 * @private
 */
class OutlinerElement {
	constructor (): void
	uuid: string
	export: boolean
	locked: boolean
	parent: Group | 'root'

}
/**
 * @private
 */
class NonGroup extends OutlinerElement {
	constructor (): void
	selected: boolean
	static fromSave: (data: object, keep_uuid?: boolean) => NonGroup
	static isParent: false
}
class Group extends OutlinerElement {
	constructor (): void
	name = Format.bone_rig ? 'bone' : 'group'
	children = []
	reset: boolean
	shade: boolean
	selected: boolean
	visibility: boolean
	autouv: 1 | 2 | 3
	isOpen: boolean
	ik_enabled: boolean
	ik_chain_length: number
}

interface CubeOptions {
	autouv: 1 | 2 | 3
	shade: boolean
	mirror_uv: boolean
	inflate: number
	autouv: number
	color: number
	visibility: boolean
	from: ArrayVector3
	to: ArrayVector3
	rotation: ArrayVector3
	origin: ArrayVector3
	/**
	 * UV position for box UV mode
	 */
	uv_offset: ArrayVector2
}
class Cube extends NonGroup implements CubeOptions {
	constructor (options: CubeOptions, uuid?: string): void
	static all: Cube[]
}


