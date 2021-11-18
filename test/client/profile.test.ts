import * as jamf from "../../src/mod.ts";
import { assertValid } from "../../src/schemas/mod.ts";
import { relativeTextFileReader } from "../deps/read_relative_file.ts";
import { assertEquals } from "../deps/std_testing_asserts.ts";

const readRelativeTextFile = relativeTextFileReader(import.meta.url);

const client = jamf.createClient({ id: "", token: "", url: "" });

const data = JSON.parse(
	await readRelativeTextFile("../example_data/GET_profiles__200.json"),
);
assertValid("GET /profiles", data);

Deno.test({
	name: "Profile.toJSON() is the same as the data used to create it",
	fn() {
		const profile = client.createProfile(data.profiles[0]);
		assertEquals(profile.toJSON(), data.profiles[0]);
	},
});

Deno.test({
	name: "Profile.toString() is the same as Profile.name",
	fn() {
		const profile = client.createProfile(data.profiles[0]);
		assertEquals(profile.toJSON(), data.profiles[0]);
	},
});

Deno.test({
	name: "Calling Profile.getSchedule() doesn't fail (with any of the test data)",
	fn() {
		const profiles = data.profiles.map((profile) => client.createProfile(profile));
		for (const profile of profiles) {
			profile.getSchedule();
		}
	},
});
