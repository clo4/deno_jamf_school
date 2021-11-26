import * as jamf from "../../src/mod.ts";
import { assertValid } from "../../src/schemas/mod.ts";
import { relativeTextFileReader } from "../deps/read_relative_file.ts";
import { assertEquals } from "../deps/std_testing_asserts.ts";

const readRelativeTextFile = relativeTextFileReader(import.meta.url);

const client = jamf.createClient({ id: "", token: "", url: "" });

const data = JSON.parse(
	await readRelativeTextFile("../example_data/GET_apps__200.json"),
);
assertValid("GET /apps", data);

Deno.test({
	name: "App.toJSON() is the same as the data used to create it",
	fn() {
		const app = client.createApp(data.apps[0]);
		assertEquals(app.toJSON(), data.apps[0]);
	},
});

Deno.test({
	name: "App.toString() is the same as App.name",
	fn() {
		const app = client.createApp(data.apps[0]);
		assertEquals(app.toJSON(), data.apps[0]);
	},
});
