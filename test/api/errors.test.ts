import * as jamf from "../../src/mod.ts";
import * as errors from "../../src/errors.ts";
import ky from "../../src/deps/ky.ts";
import { assert, assertThrowsAsync } from "../deps/asserts.ts";
import { install as installMockFetch, mock, reset } from "../deps/mock_fetch.ts";

// This is (currently) the only file that knows anything about the
// implementation of the API class. It *has* to know because it needs
// to be able to test that the correct errors are thrown by the API's
// underlying HTTP... thing.

const api = jamf.createAPI({
	id: "1097109",
	token: "1097109710971",
	url: "https://localhost:8181/",
});

// deno-lint-ignore no-explicit-any
const http = (api as any).http as typeof ky;
assert(http);

installMockFetch();

Deno.test({
	name: "API/http: 405 status throws PermissionError",
	async fn() {
		mock("/405", () => {
			return new Response("Body shouldn't matter", {
				status: 405,
			});
		});
		await assertThrowsAsync(
			async () => await http.get("405"),
			errors.PermissionError,
			"Read",
		);
		await assertThrowsAsync(
			async () => await http.post("405"),
			errors.PermissionError,
			"Add",
		);
		await assertThrowsAsync(
			async () => await http.put("405"),
			errors.PermissionError,
			"Edit",
		);
		await assertThrowsAsync(
			async () => await http.delete("405"),
			errors.PermissionError,
			"Delete",
		);
		reset();
	},
});

Deno.test({
	name: "API/http: Non-OK status throws APIError",
	async fn() {
		mock("/404", () => {
			return new Response("Failed, resource not found", {
				status: 404,
			});
		});
		await assertThrowsAsync(
			async () => await http.get("404"),
			errors.APIError,
			"Failed, resource not found",
		);
		await assertThrowsAsync(
			async () => await http.post("404"),
			errors.APIError,
			"Failed, resource not found",
		);
		await assertThrowsAsync(
			async () => await http.put("404"),
			errors.APIError,
			"Failed, resource not found",
		);
		await assertThrowsAsync(
			async () => await http.delete("404"),
			errors.APIError,
			"Failed, resource not found",
		);
		reset();
	},
});
