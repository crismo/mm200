const pg = require("pg");

class DatabaseHandler {
	#credentials = null;

	constructor(connectionString) {
		if (!connectionString) {
			throw "Cant create database handler because connection string is missing";
		}
		this.#credentials = {
			connectionString,
			ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
		};
	}

	async insert(navn, epost, valg) {
		const client = new pg.Client(this.#credentials);
		let results = null;
		try {
			await client.connect();
			results = await client.query(
				'INSERT INTO "public"."valg"("navn", "epost", "valg") VALUES($1, $2, $3) RETURNING "id", "navn", "epost", "valg";',
				[navn, epost, valg]
			);
			results = results.rows[0].id;
			client.end();
		} catch (err) {
			client.end();
			results = err;
		}
		return results;
	}
}
module.exports = DatabaseHandler;
