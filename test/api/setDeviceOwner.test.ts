import * as jamf from "../../src/api.ts";
import validatePutDevicesUdidOwner from "../../src/schemas/PUT_devices_udid_owner.ts";
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
	"../example_data/PUT_devices_udid_owner__200.json",
);
const jsonObject = JSON.parse(jsonString);
validatePutDevicesUdidOwner(jsonObject) ?? (() => {
	throw Error("Invalid data: ../example_data/PUT_devices_udid_owner__200.json");
})();

const response = new Response(jsonString, {
	headers: new Headers({
		"Content-Type": "application/json",
		"Content-Length": jsonString.length.toString(),
	}),
});

Deno.test({
	name: "api.setDeviceOwner: remaps parameters to their correct names/values",
	async fn() {
		// In this case, there is no renaming, but this may change in the future
		mockFetch.mock("PUT@/devices/:udid/owner", async (req, { udid }) => {
			const json = await req.json();
			assertEquals(udid, "c0ffee");
			assertEquals(json, { user: 123 });
			return response;
		});
		await api.setDeviceOwner("c0ffee", 123);
		mockFetch.reset();
	},
});
