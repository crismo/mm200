//#region Imports
import {
	quickLoadJSON,
	quickLoadeTemplate,
	quickPost,
} from "./modules/quickLoade.js";
import {
	createInstanceOfTemplate,
	renderRequiermentSetUsingTemplate,
	createAppNavElement,
} from "./modules/templateTool.js";
import { devLog } from "./modules/log.js";
import {
	REQUIERMENTS_ID,
	REQUIERMENTS_URLS,
	REQUIERMENTS_SECTION_TEMPLATE_PATH,
	REQUIERMENTS_SECTION_ITEM_TEMPLATE_PATH,
	ABOUT_TEMPLATE_PATH,
	ABOUT_TEMPLATE_NO_SIGNUP_PATH,
	IS_SIGNUP_ACTIVE,
} from "./modules/settings.js";

//#endregion

//#region Load external assets
const requiermentsTemplate = await quickLoadeTemplate(
	REQUIERMENTS_SECTION_TEMPLATE_PATH
);

const requiermentItemTemplate = await quickLoadeTemplate(
	REQUIERMENTS_SECTION_ITEM_TEMPLATE_PATH
);

const abouteTemplate = await quickLoadeTemplate(ABOUT_TEMPLATE_PATH);
const abouteNoSignupTemplate = await quickLoadeTemplate(
	ABOUT_TEMPLATE_NO_SIGNUP_PATH
);

const requierments = await quickLoadJSON(REQUIERMENTS_URLS);
//#endregion

//#region application html element handles

const container = document.getElementById("content");
const appNav = document.getElementById("appNav");

//#endregion

//#region app navigation

const aboutAppAction = createAppNavElement("Om", true, (e) => {
	devLog("About app section triggerd");
	clearContent();
	setActive(aboutAppAction);
	container.innerHTML = IS_SIGNUP_ACTIVE
		? abouteTemplate
		: abouteNoSignupTemplate;

	if (IS_SIGNUP_ACTIVE) {
		document.getElementById("velgbt").onclick = (e) => {
			const bt = document.getElementById("velgbt");
			const valg = document.getElementById("valg");
			const name = document.getElementById("name").value;
			const epost = document.getElementById("epost").value;
			if (valg.selectedIndex && name && epost) {
				const info = {
					navn: name,
					epost: epost,
					valg: valg[valg.selectedIndex].value,
				};
				const res = quickPost("/valg", info);
				if (res.status === 200) {
					alert("ok, registrert");
					valg.disabled = true;
					name.disabled = true;
					epost.disabled = true;
					bt.disabled = true;
				}
			} else {
				alert("Du må gjøre et valg og skrive inn stuff");
			}
		};
	}
});

const todoAppAction = createAppNavElement("ToDo App", false, (e) => {
	devLog("Todo section triggerd");
	baseAction(todoAppAction, requierments[REQUIERMENTS_ID.TODO_REQ]);
});

const presentationAppAction = createAppNavElement(
	"Presentation App",
	false,
	(e) => {
		devLog("Presentation section triggerd");
		baseAction(
			presentationAppAction,
			requierments[REQUIERMENTS_ID.PRESENTATION_REQ]
		);
	}
);

const gameAppAction = createAppNavElement("Game App", false, (e) => {
	devLog("Game section triggerd");
	baseAction(gameAppAction, requierments[REQUIERMENTS_ID.GAME_REQ]);
});

const groupAppAction = createAppNavElement("Gruppe", false, (e) => {});

function baseAction(activeAction, dataset) {
	clearContent();
	setActive(activeAction);
	container.innerHTML = dataset.description;

	const downloadBT = document.createElement("button");
	downloadBT.textContent = "⬇️ download";
	downloadBT.onclick = (e) => {
		download(`${dataset.id}.text`, container.innerText);
	};

	container.appendChild(downloadBT);

	renderRequiermentSetUsingTemplate(
		container,
		requierments[REQUIERMENTS_ID.GENERIC_REQ],
		[requiermentsTemplate, requiermentItemTemplate]
	);
	renderRequiermentSetUsingTemplate(container, dataset, [
		requiermentsTemplate,
		requiermentItemTemplate,
	]);
}

const appAcctions = [
	aboutAppAction,
	todoAppAction,
	presentationAppAction,
	gameAppAction,
];

if (window.location.hash) {
	appAcctions.push(groupAppAction);
}

appAcctions.forEach((action) => appNav.appendChild(action));

if (window.location.hash) {
	groupAppAction.querySelector("button").click(this);
} else {
	// Hack to select the first nav item
	aboutAppAction.querySelector("button").click(this);
}

//#endregion

function setActive(activeAction) {
	appAcctions.forEach((action) => {
		if (action === activeAction) {
			action.firstChild.classList.add("active");
		} else {
			action.firstChild.classList.remove("active");
		}
	});
}

function clearContent() {
	container.innerHTML = "";
}

function download(filename, text) {
	var element = document.createElement("a");
	element.setAttribute(
		"href",
		"data:text/plain;charset=utf-8," + encodeURIComponent(text)
	);
	element.setAttribute("download", filename);

	element.style.display = "none";
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}
