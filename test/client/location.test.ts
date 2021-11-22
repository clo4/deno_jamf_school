import * as jamf from "../../src/full.ts";
import { assertValid } from "../../src/schemas/mod.ts";
import { relativeTextFileReader } from "../deps/read_relative_file.ts";
import { assertEquals } from "../deps/std_testing_asserts.ts";

const readRelativeTextFile = relativeTextFileReader(import.meta.url);

const client = jamf.createClient({ id: "", token: "", url: "" });

const data = JSON.parse(
	await readRelativeTextFile("../example_data/GET_locations__200.json"),
);
assertValid("GET /locations", data);

Deno.test({
	name: "Location.toJSON() is the same as the data used to create it",
	fn() {
		const loc = client.createLocation(data.locations[0]);
		assertEquals(loc.toJSON(), data.locations[0]);
	},
});

Deno.test({
	name: "Location.toString() is the same as Location.name",
	fn() {
		const loc = client.createLocation(data.locations[0]);
		assertEquals(loc.toString(), loc.name);
	},
});
