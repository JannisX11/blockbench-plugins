import packageJson from "../package.json" assert { type: "json" };
import { variable } from "./util";

const EASING = {
	inSine: "1 - Math.cos((_t * 90)",
	outSine: "Math.sin((_t * 90))",
	inOutSine: "0.5 * (1 - Math.cos(90 * _t))",
	inQuad: "_t * _t",
	outQuad: "1 - (1 - _t) * (1 - _t)",
	inOutQuad: "_t < 0.5 ? 2 * _t * _t : 1 - Math.pow(-2 * _t + 2, 2) / 2",
	inCubic: "_t * _t * _t",
	outCubic: "1 - Math.pow(1 - _t, 3)",
	inOutCubic: "_t < 0.5 ? 4 * _t * _t * _t : 1 - Math.pow(-2 * _t + 2, 3) / 2",
	inQuart: "_t * _t * _t * _t",
	outQuart: "1 - Math.pow(1 - _t, 4)",
	inOutQuart: "_t < 0.5 ? 8 * _t * _t * _t * _t : 1 - Math.pow(-2 * _t + 2, 4) / 2",
	inQuint: "_t * _t * _t * _t * _t",
	outQuint: "1 - Math.pow(1 - _t, 5)",
	inOutQuint: "_t < 0.5 ? 16 * _t * _t * _t * _t * _t : 1 - Math.pow(-2 * _t + 2, 5) / 2",
	inExpo: "_t === 0 ? 0 : Math.pow(2, 10 * _t - 10)",
	outExpo: "_t === 1 ? 1 : 1 - Math.pow(2, -10 * _t)",
	inOutExpo:
		"_t === 0 ? 0 : _t === 1 ? 1 : _t < 0.5 ? Math.pow(2, 20 * _t - 10) / 2 : (2 - Math.pow(2, -20 * _t + 10)) / 2",
	inCirc: "1 - Math.sqrt(1 - Math.pow(_t, 2))",
	outCirc: "Math.sqrt(1 - Math.pow(_t - 1, 2))",
	inOutCirc:
		"_t < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * _t, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * _t + 2, 2)) + 1) / 2",
	inBounce: "1 - outBounce(1 - _t)",
	outBounce:
		"_t < 1 / 2.75 ? 7.5625 * Math.pow(_t, 2) : (_t < 2 / 2.75 ? 7.5625 * Math.pow(_t - 1.5 / 2.75, 2) + 0.75 : (_t < 2.5 / 2.75 ? 7.5625 * Math.pow(_t - 2.25 / 2.75, 2) + 0.9375 : 7.5625 * Math.pow(_t - 2.625 / 2.75, 2) + 0.984375))",
	inOutBounce: "_t < 0.5 ? (1 - outBounce(1 - 2 * _t)) / 2 : (1 + outBounce(2 * _t - 1)) / 2",
} as const;
export const EASING_NAMES = Object.keys(EASING) as Easing[];

function ease(options: EasingifyOptions) {
	const { easing, duration, animationName, loop = false } = options;
	const vt = variable(animationName);
	const vo = variable(animationName + "_orig");
	let f = EASING[easing].replace(/_t/g, vt).replace(/\s+/g, "");
	while (f.includes("outBounce")) {
		f = f.replace(/outBounce\(([^)]+)\)/g, (_, t) => {
			return `(${EASING.outBounce.replace(/_t/g, t).replace(/\s+/g, "")})`;
		});
	}
	let modifier = "";
	if (loop) {
		modifier = `${vo}>=${duration}?{${vo}=${vo}-${duration};};`;
	}
	return `q.anim_time==0?{${vo}=0;};${vo}=(${vo}??0)+q.delta_time;${vt}=${vo}/${duration};${modifier};return(${f})*${duration};`;
}

const EASING_HEADER = `'${packageJson.name}=${packageJson.version}';`;
export function easingify(animation: BBAnimation, easing: Easing) {
	const animationName = animation.name;
	const easeIndex = EASING_NAMES.indexOf(easing);
	const str =
		EASING_HEADER +
		`'i=${easeIndex}';` +
		ease({ animationName, duration: animation.length, easing, loop: animation.loop === "loop" });
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
	loop?: boolean;
};
