const { group } = require("console");
const { Pool, Client } = require("pg");

class DatabaseHandler {
	#credentials = null;

	constructor(connectionString) {
		if (!connectionString) {
			throw "Cant create database handler because connection string is missing";
		}
		this.#credentials = {
			connectionString,
			ssl: { rejectUnauthorized: false },
		};
	}

	async query(query, params) {
		const client = new Client(this.#credentials);
		let results = null;
		try {
			await client.connect();
			results = await client.query(query, params);
			results = results.rows;
		} catch (err) {
			results = err;
		} finally {
			client.end();
		}
		return results;
	}

	async batchQuery(query, params) {
		const respons = null;
		const pool = new Pool(this.#credentials);
		const client = await pool.connect();
		try {
			await client.query("BEGIN");
			console.log();
			params.forEach(async (paramSet) => {
				console.log(paramSet);
				const res = await client.query(query, paramSet);
			});
			await client.query("COMMIT");
		} catch (e) {
			await client.query("ROLLBACK");
			respons = e;
		} finally {
			client.release();
		}

		return respons;
	}

	async insertProjectChoice(navn, epost, valg) {
		const result = await this.query(
			'INSERT INTO "public"."valg"("navn", "epost", "valg") VALUES($1, $2, $3) RETURNING "id";',
			[navn, epost, valg]
		);
		return result instanceof Error ? result : result[0].id;
	}

	async insertGroups(groups) {
		const result = await this.batchQuery(
			'INSERT INTO "public"."groups"("id", "students", "password", "project") VALUES($1, $2, $3, $4) RETURNING *;',
			groups
		);
	}

	async getGroup(groupID) {
		const result = await this.query(
			"select * from groups where id=$1;",
			groupID
		);
		return result instanceof Error ? result : result[0];
	}
}
module.exports = DatabaseHandler;
