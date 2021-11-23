import { devLog } from "./log.js";

export async function quickLoadJSON(keysAndUrls) {
	const data = {};
	const targets = Object.entries(keysAndUrls);
	devLog("Loading", ...targets);
	for (const target of targets) {
		const key = target[0];
		const url = target[1];
		devLog("Currently loading data from ", url);
		try {
			const res = await fetch(url).then((data) => data.json());
			data[key] = res;
		} catch (error) {
			data[key] = null;
			console.error(error);
		}
	}
	return data;
}

export async function quickLoadeTemplate(target) {
	devLog("Currently loading template from", target);
	let template = null;
	try {
		template = await fetch(target).then((data) => data.text());
	} catch (err) {
		console.error(err);
	}
	return template;
}

export async function quickPost(target, body) {
	const res = await fetch(target, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	return res;
}

export async function quickLoade(target) {
	let res = {};
	try {
		res = await fetch(target).then((data) => data.json());
	} catch (err) {
		console.error(err);
	}

	return res;
}

export default quickLoadJSON;
