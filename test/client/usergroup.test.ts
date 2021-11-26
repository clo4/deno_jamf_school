import * as jamf from "../../src/mod.ts";
import { assertValid } from "../../src/schemas/mod.ts";
import { relativeTextFileReader } from "../deps/read_relative_file.ts";
import { assert, assertEquals } from "../deps/std_testing_asserts.ts";

const readRelativeTextFile = relativeTextFileReader(import.meta.url);

const client = jamf.createClient({ id: "", token: "", url: "" });

const data = JSON.parse(
	await readRelativeTextFile("../example_data/GET_users_groups__200.json"),
);
assertValid("GET /users/groups", data);

Deno.test({
	name: "UserGroup.toJSON() is the same as the data used to create it",
	fn() {
		const group = client.createUserGroup(data.groups[0]);
		assertEquals(group.toJSON(), data.groups[0]);
	},
});

Deno.test({
	name: "UserGroup.toString() is the same as UserGroup.name",
	fn() {
		const group = client.createUserGroup(data.groups[0]);
		assertEquals(group.toJSON(), data.groups[0]);
	},
});

Deno.test({
	name: "UserGroup.isParentGroup and isTeacherGroup are always true/false/null",
	fn() {
		const groups = data.groups.map((group) => client.createUserGroup(group));
		const tfn = new Set([true, false, null]);
		for (const group of groups) {
			assert(tfn.has(group.isParentGroup));
			assert(tfn.has(group.isTeacherGroup));
		}
	},
});
