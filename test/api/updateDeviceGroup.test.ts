import * as jamf from "../../src/mod.ts";
import validatePutDevicesGroupsId from "../../src/schemas/PUT_devices_groups_id.ts";
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
	"../example_data/PUT_devices_groups_id__200.json",
);
const jsonObject = JSON.parse(jsonString);
validatePutDevicesGroupsId(jsonObject) ?? (() => {
	throw Error("Invalid data: ../example_data/PUT_devices_groups_id__200.json");
})();

const response = new Response(jsonString, {
	headers: new Headers({
		"Content-Type": "application/json",
		"Content-Length": jsonString.length.toString(),
	}),
});

Deno.test({
	name: "api.updateDeviceGroup: remaps parameters to their correct names/values",
	async fn() {
		// In this case, there is no renaming, but this may change in the future
		mockFetch.mock("PUT@/devices/groups/:id", async (req, { id }) => {
			const json = await req.json();
			assertEquals(id, "123");
			assertEquals(json, {
				name: "name",
				description: "desc",
			});
			return response;
		});
		await api.updateDeviceGroup(123, {
			name: "name",
			description: "desc",
		});

		// `shared` should be present now
		mockFetch.mock("PUT@/devices/groups/:id", async (req, { id }) => {
			const json = await req.json();
			assertEquals(id, "123");
			assertEquals(json, {
				name: "name",
				description: "desc",
				shared: true,
			});
			return response;
		});
		await api.updateDeviceGroup(123, {
			name: "name",
			description: "desc",
			shared: true,
		});
		mockFetch.reset();
	},
});
