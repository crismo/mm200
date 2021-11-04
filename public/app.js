//#region Imports
import { quickLoadJSON, quickLoadeTemplate } from "./modules/quickLoade.js";
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

const requierments = await quickLoadJSON(REQUIERMENTS_URLS);
//#endregion

//#region application html element handles

const container = document.getElementById("content");
const appNav = document.getElementById("appNav");

//#endregion

//#region app navigation

const aboutAppAction = createAppNavElement("Om prosjektet", true, (e) => {
	devLog("About app section triggerd");
	clearContent();
	setActive(aboutAppAction);
	container.innerHTML = abouteTemplate;

	document.getElementById("velgbt").onclick = (e) => {
		const valg = document.getElementById("valg");
		const name = document.getElementById("name").value;
		const epost = document.getElementById("epost").value;
		if (valg.selectedIndex && name && epost) {
			const info = {
				navn: name,
				epost: epost,
				valg: valg[valg.selectedIndex].value,
			};

			fetch("/valg", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(info),
			}).then((data) => {
				if (data.status === 200) {
					alert("ok");
				}
			});
		} else {
			alert("Du må gjøre et valg og skrive inn stuff");
		}

		//terminal.options[terminal.selectedIndex]
	};
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

function baseAction(activeAction, dataset) {
	clearContent();
	setActive(activeAction);
	container.innerHTML = dataset.description;
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

appAcctions.forEach((action) => appNav.appendChild(action));

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
