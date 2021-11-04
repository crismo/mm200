export function createInstanceOfTemplate(templateId, optionalUniqueId) {
	let template = document.querySelector(`#${templateId}`).content;
	if (optionalUniqueId) {
		template.firstElementChild.id = optionalUniqueId;
	}
	return template.cloneNode(true);
}

export function renderRequiermentSetUsingTemplate(target, set, templates) {
	console.log(set);

	for (const requiermentSet of set.requierments) {
		let sectionContent = `${templates[0]}`;

		sectionContent = sectionContent.replaceAll(
			"{{#title}}",
			requiermentSet.title || ""
		);

		sectionContent = sectionContent.replaceAll(
			"{{#description}}",
			requiermentSet.description || ""
		);

		const items = requiermentSet.items.reduce((listing, itemDescription) => {
			let item = `${templates[1]}`;
			item = item.replaceAll(
				"{{#description}}",
				itemDescription.description || ""
			);
			return `${listing}\n${item}`;
		}, "");

		sectionContent = sectionContent.replaceAll("{{#items}}", items);

		const temp = document.createElement("div");
		temp.innerHTML = sectionContent;
		const section = temp.firstChild;
		target.appendChild(section);
	}
}

export function createAppNavElement(title, isActive, handler) {
	const item = document.createElement("li");
	const button = document.createElement("button");
	button.innerText = title;
	button.onclick = handler;
	if (isActive) {
		button.classList.add("active");
	}
	item.appendChild(button);
	return item;
}
