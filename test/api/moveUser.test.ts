import * as jamf from "../../src/full.ts";
import validatePutUsersidMigrate from "../../src/schemas/PUT_users_id_migrate.ts";
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
	"../example_data/PUT_users_id_migrate__200.json",
);
const jsonObject = JSON.parse(jsonString);
validatePutUsersidMigrate(jsonObject) ?? (() => {
	throw Error("Invalid data: ../example_data/PUT_users_id_migrate__200.json");
})();

const response = new Response(jsonString, {
	headers: new Headers({
		"Content-Type": "application/json",
		"Content-Length": jsonString.length.toString(),
	}),
});

Deno.test({
	name: "api.moveUser: remaps parameters to their correct names/values",
	async fn() {
		mockFetch.mock("PUT@/users/:id/migrate", async (req, { id }) => {
			const json = await req.json();
			assertEquals(id, "123");
			assertEquals(json, {
				locationId: 456,
			});
			return response;
		});
		await api.moveUser(123, 456);

		mockFetch.reset();
		mockFetch.mock("PUT@/users/:id/migrate", async (req, { id }) => {
			const json = await req.json();
			assertEquals(id, "123");
			assertEquals(json, {
				locationId: 456,
				onlyUser: true,
			});
			return response;
		});
		await api.moveUser(123, 456, { onlyUser: true });
		mockFetch.reset();
	},
});
