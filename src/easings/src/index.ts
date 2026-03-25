/// <reference types="blockbench-types" />
import packageJson from "../package.json" assert { type: "json" };
import { canBeEased, EASING_NAMES, easingify, getEasing, type Easing } from "./easings";

const ICONS = {
	on: "far.fa-dot-circle",
	off: "far.fa-circle",
};

class EasingsPlugin implements PluginOptions {
	readonly id = packageJson.name;
	readonly title = "Easings";
	readonly author = packageJson.author.name;
	readonly version = packageJson.version;
	readonly description = "Apply easing functions to Minecraft: Bedrock Edition animations.";
	readonly icon = "stacked_line_chart";
	readonly variant: "both" | "desktop" | "web" = "both";
	readonly tags = ["Minecraft: Bedrock Edition", "Animation"] satisfies [string, string];
	readonly website = packageJson.author.url;
	readonly min_version = "4.8.0";

	actions: Action[] = [];
	readonly formats = new Set(["bedrock", "bedrock_old"]);
	constructor() {
		this.onload = this.onload.bind(this);
		this.onunload = this.onunload.bind(this);
	}
	onload(): void {
		this.actionApplyEasing();
		this.actionApplyEasings();
	}
	onunload(): void {
		for (const action of this.actions) {
			action.delete();
		}
		this.actions = [];
	}
	protected getSelectedAnimation(): BBAnimation | undefined {
		// @ts-expect-error: Animation is not typed correctly in blockbench types, it should be Animation | null.
		if (Animator.open && Blockbench.Animation && Animation.selected !== null) {
			// @ts-expect-error: Animation is not typed correctly in blockbench types, it should be Animation | null.
			return Animation.selected;
		}
	}
	protected actionApplyEasing() {
		const changeEasing = new Action("easings.apply_easing", {
			icon: this.icon,
			name: "Apply Easing",
			description: "Apply the easing function of the selected animation.",
			condition: () => {
				if (!this.formats.has(Format.id)) {
					return false;
				}
				const animation = this.getSelectedAnimation();
				return Animator.open && animation && canBeEased(animation);
			},
			click(event) {
				if (typeof this.children === "function" && event?.target instanceof HTMLElement) {
					new Menu(this.children()).open(event.target);
				}
			},
			children: () => {
				const animation = this.getSelectedAnimation();
				if (!animation) {
					return [];
				}
				const items = ["None", ...EASING_NAMES] as (Easing | "None")[];
				const easing = getEasing(animation)?.easing ?? "None";
				return items.map((item) => {
					return {
						name: item,
						icon: item === easing ? ICONS.on : ICONS.off,
						click: () => {
							Undo.initEdit({ animations: [animation] });
							if (item === "None") {
								animation.anim_time_update = "";
							} else {
								easingify(animation, item);
							}
							Undo.finishEdit("Apply Easing");
						},
					};
				}) satisfies Pick<ActionOptions, "name" | "icon" | "click">[];
			},
		});
		this.actions.push(changeEasing);
	}
	protected actionApplyEasings() {
		const changeEasings = new Action("easings.apply_easings", {
			icon: this.icon,
			name: "Apply Easings",
			description: "Apply the easing functions of all animations in the current file.",
			condition: () =>
				this.formats.has(Format.id) && Animator.open && AnimationItem.all.some(canBeEased),
			click: () => this.easingsDialog.show(),
		});
		this.actions.push(changeEasings);
		MenuBar.addAction(changeEasings, "animation");
	}
	protected get easingsDialog() {
		const allAnimations = AnimationItem.all;
		const animations = allAnimations.reduce(
			(acc, animation) => {
				acc[animation.name.replaceAll(".", "_tkn_")] = animation;
				return acc;
			},
			{} as Record<string, BBAnimation>,
		);
		const easingList = ["None", ...EASING_NAMES];
		const easingEntries = Object.fromEntries(
			easingList.map((name, index) => [index, name] as const),
		);
		const entries = allAnimations.reduce(
			(acc, animation) => {
				if (!canBeEased(animation)) {
					return acc;
				}
				const easing = getEasing(animation);
				const id = animation.name.replaceAll(".", "_tkn_");
				const value = 1 + (easing?.index ?? -1);
				acc[id] = {
					type: "select",
					label: animation.name,
					options: easingEntries,
					value,
				};
				return acc;
			},
			{} as Record<string, FormElementOptions>,
		);
		const dialog = new Dialog({
			id: this.id,
			title: this.title,
			form: {
				...entries,
				buttonBar: {
					type: "buttons",
					buttons: [
						"Reset All",
					],
					click() {
						dialog.setFormValues(
							Object.keys(entries).reduce(
								(acc, key) => {
									acc[key] = 0;
									return acc;
								},
								{} as Record<string, number>,
							),
							true,
						);
					},
				},
			} satisfies Record<string, FormElementOptions>,
			onConfirm: (formData: Record<string, string>) => {
				Undo.initEdit({ animations: allAnimations });
				for (const key of Object.keys(formData)) {
					const animation = animations[key];
					if (!animation) {
						continue;
					}
					const index = +formData[key];
					let changed = false;
					if (!index) {
						if (getEasing(animation)) {
							animation.anim_time_update = "";
							changed = true;
						}
					} else {
						easingify(animation, easingList[index] as Easing);
						changed = true;
					}
					if (changed) {
						animation.saved = false;
					}
				}
				Undo.finishEdit("Apply Easing");
			},
		});
		return dialog;
	}
}

const plugin = new EasingsPlugin();
BBPlugin.register(plugin.id, plugin);

declare global {
	type BBAnimation = (typeof AnimationItem.all)[number];
}
