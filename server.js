const express = require("express");

const server = express();
const PORT = process.env.PORT || 8080;

server.set("PORT", PORT);
server.use(express.static("public"));
server.use(express.json());

server.get("/", (req, res, next) => {
	res.status(200).send("Hello World").end();
});

server.listen(server.get("PORT"), function () {
	console.log("server running", server.get("port"));
});
