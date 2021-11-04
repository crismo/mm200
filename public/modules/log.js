import { IS_DEV } from "./settings.js";

export function devLog(msg, ...extra) {
	if (IS_DEV) {
		log(msg, ...extra);
	}
}

export function log(msg, ...extra) {
	console.log(msg, ...extra);
}
