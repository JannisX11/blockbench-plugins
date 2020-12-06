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


