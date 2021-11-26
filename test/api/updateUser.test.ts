import * as jamf from "../../src/api.ts";
import validatePutUsersId from "../../src/schemas/PUT_users_id.ts";
import { assertEquals } from "../deps/std_testing_asserts.ts";
import { relativeTextFileReader } from "../deps/read_relative_file.ts";
import * as mockFetch from "../deps/mock_fetch.ts";

const readRelativeTextFile = relativeTextFileReader(import.meta.url);

// There's nothing special about these numbers
const api = jamf.createAPI({
	id: "1097109",
	token: "1097109710971",
	url: "https://localhost:8181/",
});

mockFetch.install(); // we don't need to uninstall, all fetches should be mocked

const jsonString = await readRelativeTextFile(
	"../example_data/PUT_users_id__200.json",
);
const jsonObject = JSON.parse(jsonString);
validatePutUsersId(jsonObject) ?? (() => {
	throw Error("Invalid data: ../example_data/PUT_users_id__200.json");
})();

const response = new Response(jsonString, {
	headers: new Headers({
		"Content-Type": "application/json",
		"Content-Length": jsonString.length.toString(),
	}),
});

Deno.test({
	name: "api.updateUser: remaps parameters to their correct names/values",
	async fn() {
		// In this case, there is no renaming, but this may change in the future
		mockFetch.mock("PUT@/users/:id", async (req, { id }) => {
			const json = await req.json();
			assertEquals(id, "123");
			assertEquals(json, {
				username: "test",
				password: "test",
				storePassword: true,
				domain: "ad",
				email: "user@example.com",
				firstName: "test",
				lastName: "test",
				memberOf: [1, 2, "test"],
				teacher: [0, 1],
				children: [0, 1],
				notes: "test",
				exclude: true,
			});
			return response;
		});
		await api.updateUser(123, {
			username: "test",
			password: "test",
			storePassword: true,
			domain: "ad",
			email: "user@example.com",
			firstName: "test",
			lastName: "test",
			memberOf: [1, 2, "test"],
			teacher: [0, 1],
			children: [0, 1],
			notes: "test",
			exclude: true,
		});
		mockFetch.reset();
	},
});
