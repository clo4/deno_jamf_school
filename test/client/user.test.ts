import * as jamf from "../../src/mod.ts";
import { assertValid } from "../../src/schemas/mod.ts";
import { relativeTextFileReader } from "../deps/read_relative_file.ts";
import { assertEquals } from "../deps/std_testing_asserts.ts";

const readRelativeTextFile = relativeTextFileReader(import.meta.url);

const client = jamf.createClient({ id: "", token: "", url: "" });

Deno.test({
	name: "User.toJSON() is the same as the data used to create it",
	async fn() {
		const data = JSON.parse(
			await readRelativeTextFile("../example_data/GET_users__200.json"),
		);
		assertValid("GET /users", data);

		const device = client.createUser(data.users[0]);
		assertEquals(device.toJSON(), data.users[0]);
	},
});
