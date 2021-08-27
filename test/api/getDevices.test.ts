import * as jamf from "../../src/mod.ts";
import validateGetDevices from "../../src/schemas/GET_devices.ts";
import { assertEquals, assertThrowsAsync } from "../deps/asserts.ts";
import { relativeTextFileReader } from "../deps/read_relative_file.ts";
import * as mockFetch from "../deps/mock_fetch.ts";

const readRelativeTextFile = relativeTextFileReader(import.meta.url);

const api = jamf.createAPI({
	id: "1097109",
	token: "1097109710971",
	url: "https://localhost:8181/",
});

mockFetch.install(); // we don't need to uninstall, all fetches should be mocked

const jsonString = await readRelativeTextFile("../example_data/GET_devices__200.json");
const jsonObject = JSON.parse(jsonString);
validateGetDevices(jsonObject) ?? (() => {
	throw Error("Invalid data: ../example_data/GET_devices__200.json");
})();

const response = new Response(jsonString, {
	headers: new Headers({
		"Content-Type": "application/json",
		"Content-Length": jsonString.length.toString(),
	}),
});

Deno.test({
	name: "api/getDevices: accepts valid data",
	async fn() {
		mockFetch.mock("GET@/devices", () => response);
		// This will throw if it doesn't work
		const result = await api.getDevices();
		assertEquals(result.length, jsonObject.devices.length);
		mockFetch.reset();
	},
});

Deno.test({
	name: "api/getDevices: ?includeApps works around buggy API behaviour",
	async fn() {
		mockFetch.mock("GET@/devices", (req) => {
			const params = new URL(req.url).searchParams;
			assertEquals(params.get("includeApps"), "1");
			return response;
		});
		await api.getDevices({ includeApps: true });
		mockFetch.reset();

		mockFetch.mock("GET@/devices", (req) => {
			const params = new URL(req.url).searchParams;
			assertEquals(params.has("includeApps"), false);
			return response;
		});
		await api.getDevices({ includeApps: false });
		mockFetch.reset();
	},
});

Deno.test({
	name: "api/getDevices: remaps parameters to their correct names/values",
	async fn() {
		mockFetch.mock("GET@/devices", (req) => {
			const params = new URL(req.url).searchParams;
			assertEquals(params.get("groups"), "0,1");
			assertEquals(params.get("ownergroups"), "0,1");
			assertEquals(params.get("hasOwner"), "1");
			assertEquals(params.get("owner"), "0");
			assertEquals(params.get("name"), "SeparateRecords");
			assertEquals(params.get("managed"), "1");
			assertEquals(params.get("model"), "iPad42,0");
			assertEquals(params.get("location"), "0");
			assertEquals(params.get("supervised"), "1");
			assertEquals(params.get("inTrash"), "1");
			assertEquals(params.get("assettag"), "test");
			assertEquals(params.get("serialnumber"), "XX28980XX");
			assertEquals(params.get("enrollType"), "ac2");
			assertEquals(params.get("includeApps"), "1");
			assertEquals([...params.entries()].length, 14);
			return response;
		});
		await api.getDevices({
			assetTag: "test",
			enrollmentType: "ac2",
			groupIds: [0, 1],
			includeApps: true,
			isManaged: true,
			isOwned: true,
			isSupervised: true,
			isTrashed: true,
			locationId: 0,
			modelIdentifier: "iPad42,0",
			ownerGroupIds: [0, 1],
			ownerId: 0,
			ownerName: "SeparateRecords",
			serialNumber: "XX28980XX",
		});
		mockFetch.reset();
	},
});

Deno.test({
	name: "api/getDevices: throws when given unexpected data",
	async fn() {
		mockFetch.mock("GET@/devices", () => {
			return new Response(`{"code":200,"count":0,"devices":[{"UDID":7}]}`);
		});
		// I really don't care what error it is, so long as it doesn't validate
		await assertThrowsAsync(async () => {
			await api.getDevices();
		});
		mockFetch.reset();
	},
});
