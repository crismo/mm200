const express = require("express");
const DatabaseHandler = require("./modules/db.js");
const docx = require("docx@6.0.0");
const db = new DatabaseHandler(
	process.env.DATABASE_URL ||
		"postgres://mykrbeuhvowewg:837780ce6885475b65c4d9229dd52297c06d46400da877a6a1560969b9dcea19@ec2-54-154-101-45.eu-west-1.compute.amazonaws.com:5432/d57vaff3g5ja37"
);
const server = express();
const PORT = process.env.PORT || 8080;

server.set("PORT", PORT);
server.use(express.static("public"));
server.use(express.json());

server.get("/", (req, res, next) => {
	res.status(200).send("Hello World").end();
});

server.get("/group/:id", async (req, res, next) => {
	const groupID = req.params.id;
	console.log("Find group " + groupID);
	if (groupID) {
		try {
			const group = await db.getGroup(groupID);
			console.log(group);
			if (group) {
				const { id, students, project } = group;
				res.status(200).send(JSON.stringify({ id, project, students }));
			} else {
				res.status(404);
			}
		} catch (error) {
			console.error(error);
			res.status(500);
		}
	} else {
		res.status(400);
	}
	next();
});

server.post("/reportDraft", (req, res, next) => {
	const input = req.body;

	const doc = new Document({
		sections: [
			{
				properties: {},
				children: [
					new Paragraph({
						children: [
							new TextRun("Hello World"),
							new TextRun({
								text: "Foo Bar",
								bold: true,
							}),
							new TextRun({
								text: "\tGithub is the best",
								bold: true,
							}),
						],
					}),
				],
			},
		],
	});

	const b64string = await Packer.toBase64String(doc);

	res.setHeader("Content-Disposition", "attachment; filename=draft.docx");
	res.send(Buffer.from(b64string, "base64"));
});

server.post("/valg", async (req, res, next) => {
	const params = req.body;
	console.log(params);
	if (
		!isNullOrEmpty(params.navn) &&
		!isNullOrEmpty(params.epost) &&
		!isNullOrEmpty(params.valg)
	) {
		try {
			let respons = await db.insertProjectChoice(
				params.navn,
				params.epost,
				params.valg * 1
			);
			console.log(respons);
			res.status(200).end();
		} catch (error) {
			console.error(error);
			res.status(500).end();
		}
	} else {
		res.statusMessage = "Mangler paramentere husk navn, epost og valg";
		res.status(400).end();
	}

	next();
});

function isNullOrEmpty(str) {
	if (str && str.length > 0) {
		return false;
	}
	return true;
}

server.listen(server.get("PORT"), function () {
	console.log("server running", server.get("PORT"));
});
