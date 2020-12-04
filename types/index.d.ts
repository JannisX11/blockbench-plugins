interface DialogFormElement {
	label: string
	type: string
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
	options: object
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
		[formElement: string]: string | DialogFormElement
	}
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
