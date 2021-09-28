import { assertValid } from "./util.ts";
import { relativeTextFileReader } from "../deps/read_relative_file.ts";

const readRelativeTextFile = relativeTextFileReader(import.meta.url);

Deno.test("schemas/assertValid: GET /devices (200 OK)", async () => {
	const json = await readRelativeTextFile("../example_data/GET_devices__200.json");
	assertValid("GET /devices", JSON.parse(json));
});

Deno.test("schemas/assertValid: GET /devices (200 OK, with apps)", async () => {
	const json = await readRelativeTextFile(
		"../example_data/GET_devices__200__apps.json",
	);
	assertValid("GET /devices", JSON.parse(json));
});

Deno.test("schemas/assertValid: GET /devices/:udid (200 OK)", async () => {
	const json = await readRelativeTextFile("../example_data/GET_devices_udid__200.json");
	assertValid("GET /devices/:udid", JSON.parse(json));
});

Deno.test("schemas/assertValid: GET /devices/:udid (200 OK, many)", async () => {
	const text = await readRelativeTextFile(
		"../example_data/many__GET_devices_udid__200.json",
	);
	for (const json of JSON.parse(text)) {
		assertValid("GET /devices/:udid", json);
	}
});

Deno.test("schemas/assertValid: GET /devices/:udid?includeApps=true (200 OK, many)", async () => {
	const text = await readRelativeTextFile(
		"../example_data/many__GET_devices_udid__200__apps.json",
	);
	for (const json of JSON.parse(text)) {
		assertValid("GET /devices/:udid", json);
	}
});

Deno.test("schemas/assertValid: GET /devices/:udid (200 OK, no owner)", async () => {
	const json = await readRelativeTextFile(
		"../example_data/GET_devices_udid__200__no_owner.json",
	);
	assertValid("GET /devices/:udid", JSON.parse(json));
});

Deno.test("schemas/assertValid: GET /devices/groups (200 OK)", async () => {
	const json = await readRelativeTextFile(
		"../example_data/GET_devices_groups__200.json",
	);
	assertValid("GET /devices/groups", JSON.parse(json));
});

Deno.test("schemas/assertValid: GET /devices/groups/:id (200 OK)", async () => {
	const json = await readRelativeTextFile(
		"../example_data/GET_devices_groups_id__200.json",
	);
	assertValid("GET /devices/groups/:id", JSON.parse(json));
});

Deno.test("schemas/assertValid: GET /users (200 OK)", async () => {
	const json = await readRelativeTextFile("../example_data/GET_users__200.json");
	assertValid("GET /users", JSON.parse(json));
});

Deno.test("schemas/assertValid: GET /users/:id (200 OK)", async () => {
	const json = await readRelativeTextFile("../example_data/GET_users_id__200.json");
	assertValid("GET /users/:id", JSON.parse(json));
});

Deno.test("schemas/assertValid: GET /users/groups (200 OK)", async () => {
	const json = await readRelativeTextFile("../example_data/GET_users_groups__200.json");
	assertValid("GET /users/groups", JSON.parse(json));
});

Deno.test("schemas/assertValid: GET /users/groups/:id (200 OK)", async () => {
	const json = await readRelativeTextFile(
		"../example_data/GET_users_groups_id__200.json",
	);
	assertValid("GET /users/groups/:id", JSON.parse(json));
});

Deno.test("schemas/assertValid: GET /apps (200 OK)", async () => {
	const json = await readRelativeTextFile(
		"../example_data/GET_apps__200.json",
	);
	assertValid("GET /apps", JSON.parse(json));
});

Deno.test("schemas/assertValid: GET /apps/:id (200 OK, many)", async () => {
	const text = await readRelativeTextFile(
		"../example_data/many__GET_apps_id__200.json",
	);
	for (const json of JSON.parse(text)) {
		assertValid("GET /apps/:id", json);
	}
});
