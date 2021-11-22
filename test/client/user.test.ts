import * as jamf from "../../src/full.ts";
import { assertValid } from "../../src/schemas/mod.ts";
import { relativeTextFileReader } from "../deps/read_relative_file.ts";
import { assertEquals } from "../deps/std_testing_asserts.ts";

const readRelativeTextFile = relativeTextFileReader(import.meta.url);

const client = jamf.createClient({ id: "", token: "", url: "" });

const data = JSON.parse(
	await readRelativeTextFile("../example_data/GET_users__200.json"),
);
assertValid("GET /users", data);

Deno.test({
	name: "User.toJSON() is the same as the data used to create it",
	fn() {
		const user = client.createUser(data.users[0]);
		assertEquals(user.toJSON(), data.users[0]);
	},
});

Deno.test({
	name: "User.toString() is the same as User.name",
	fn() {
		const user = client.createUser(data.users[0]);
		assertEquals(user.toString(), user.name);
	},
});
