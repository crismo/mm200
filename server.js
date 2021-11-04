const express = require("express");
const DatabaseHandler = require("./modules/db.js");

const db = new DatabaseHandler(process.env.DATABASE_URL || "sdfsdfds");
const server = express();
const PORT = process.env.PORT || 8080;

server.set("PORT", PORT);
server.use(express.static("public"));
server.use(express.json());

server.get("/", (req, res, next) => {
	res.status(200).send("Hello World").end();
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
			let respons = await db.insert(params.navn, params.epost, params.valg * 1);
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
