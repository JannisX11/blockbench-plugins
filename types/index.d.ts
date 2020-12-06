interface DialogFormElement {
	label: string
	type: 'text' | 'number' | 'checkbox' | 'select' | 'radio' | 'textarea' | 'vector' | 'color' | 'file' | 'folder' | 'save' | 'info' 
	nocolon?: boolean
	readonly?: boolean
	value?: any
	placeholder?: string
	text?: string
	colorpicker?: any
	min?: number
	max?: number
	step?: number
	height?: number
	options?: object
}
interface DialogOptions {
	title: string
	id: string
	/**
	 * Array of HTML object strings for each line of content in the dialog.
	 */
	lines: string[]
	/**
	 *  If false, the confirm button of the dialog is disabled
	 */
	confirmEnabled?: boolean
	/**
	 *  If false, the cancel button of the dialog is disabled
	 */
	cancelEnabled?: boolean
	/**
	 *  Function to execute when the user confirms the dialog
	 */
	onConfirm?: (formResult: object) => void
	/**
	 *  Function to execute when the user cancels the dialog
	 */
	onCancel?: () => void
	/**
	 * Creates a form in the dialog
	 */
	form?: {
		[formElement: string]: '_' | DialogFormElement
	}
	/**
	 * Vue component. Requires Blockbench 3.8 or newer
	 */
	component: Vue.Component
}

class Dialog {
	constructor (options: DialogOptions)
	show: () => Dialog
	hide: () => Dialog
	/**
	 * Triggers the confirm event of the dialog.
	 */
	confirm: () => void
	/**
	 * Triggers the cancel event of the dialog.
	 */
	cancel: () => void

}

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


