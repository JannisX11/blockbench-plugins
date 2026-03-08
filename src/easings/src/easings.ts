import packageJson from "../package.json" assert { type: "json" };
import { variable } from "./util";

const EASING = {
	inSine: "math.ease_in_sine(_t)",
	outSine: "math.ease_out_sine(_t)",
	inOutSine: "math.ease_in_out_sine(_t)",
	inQuad: "math.ease_in_quad(_t)",
	outQuad: "math.ease_out_quad(_t)",
	inOutQuad: "math.ease_in_out_quad(_t)",
	inCubic: "math.ease_in_cubic(_t)",
	outCubic: "math.ease_out_cubic(_t)",
	inOutCubic: "math.ease_in_out_cubic(_t)",
	inQuart: "math.ease_in_quart(_t)",
	outQuart: "math.ease_out_quart(_t)",
	inOutQuart: "math.ease_in_out_quart(_t)",
	inQuint: "math.ease_in_quint(_t)",
	outQuint: "math.ease_out_quint(_t)",
	inOutQuint: "math.ease_in_out_quint(_t)",
	inExpo: "math.ease_in_expo(_t)",
	outExpo: "math.ease_out_expo(_t)",
	inOutExpo: "math.ease_in_out_expo(_t)",
	inCirc: "math.ease_in_circ(_t)",
	outCirc: "math.ease_out_circ(_t)",
	inOutCirc: "math.ease_in_out_circ(_t)",
	inBounce: "math.ease_in_bounce(_t)",
	outBounce: "math.ease_out_bounce(_t)",
	inOutBounce: "math.ease_in_out_bounce(_t)",
} as const;
export const EASING_NAMES = Object.keys(EASING) as Easing[];

function ease(options: EasingifyOptions) {
	const { easing, duration, animationName, loop = false } = options;
	const vt = variable(animationName);
	const vo = variable(animationName + "_orig");
	const f = EASING[easing].replace(/_t/g, `0,${duration},${vt}`).replace(/\s+/g, "");
	let o: string;
	if (loop === "loop") {
		o = `${vo}=(${vo}??0)+q.delta_time;${vo}>${duration}?{${vo}=${vo}-${duration};};`;
	} else {
		o = `(${vo}??0)>${duration}?{return${duration + 0.1};}:{${vo}=(${vo}??0)+q.delta_time;};`;
	}
	return `q.anim_time==0?{${vo}=0;};${o}${vt}=${vo}/${duration};return${f};`;
}

const EASING_HEADER = `'${packageJson.name}=${packageJson.version}';`;
export function easingify(animation: BBAnimation, easing: Easing) {
	const animationName = animation.name;
	const easeIndex = EASING_NAMES.indexOf(easing);
	const str =
		EASING_HEADER +
		`'i=${easeIndex}';` +
		ease({ animationName, duration: animation.length, easing, loop: animation.loop });
	animation.anim_time_update = str;
}

export function getEasing(animation: BBAnimation) {
	const molang = animation.anim_time_update;
	if (!molang.startsWith(EASING_HEADER)) {
		return;
	}
	const sliced = molang.slice(EASING_HEADER.length);
	const captured = sliced.match(/'i=(\d+)'/)?.[1];
	if (!captured) {
		return;
	}
	const index = +captured;
	const name = EASING_NAMES[index];
	if (name) {
		return {
			easing: name,
			index,
		};
	}
}

export function canBeEased(animation: BBAnimation) {
	const molang = animation.anim_time_update;
	return molang.startsWith(EASING_HEADER) || (!molang && animation.length > 0);
}

export type Easing = keyof typeof EASING;
type EasingifyOptions = {
	easing: Easing;
	duration: number;
	animationName: string;
	loop: "once" | "hold" | "loop";
};
