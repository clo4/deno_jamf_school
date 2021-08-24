import * as schemasJIT from "../../src/schemas/mod.ts";
import { relativeTextFileReader } from "../deps/read_relative_file.ts";

const readRelativeTextFile = relativeTextFileReader(import.meta.url);

Deno.test("schemas/mustParse: GET /devices (200 OK)", async () => {
	const json = await readRelativeTextFile("../example_data/GET_devices__200.json");
	schemasJIT.mustParse("GET /devices", json);
	// schemasAOT.mustParse("GET /devices", json);
});

Deno.test("schemas/mustParse: GET /devices (200 OK, with apps)", async () => {
	const json = await readRelativeTextFile(
		"../example_data/GET_devices__200__apps.json",
	);
	schemasJIT.mustParse("GET /devices", json);
	// schemasAOT.mustParse("GET /devices", json);
});

Deno.test("schemas/mustParse: GET /devices/:udid (200 OK)", async () => {
	const json = await readRelativeTextFile("../example_data/GET_devices_udid__200.json");
	schemasJIT.mustParse("GET /devices/:udid", json);
	// schemasAOT.mustParse("GET /devices/:udid", json);
});

Deno.test("schemas/mustParse: GET /devices/groups (200 OK)", async () => {
	const json = await readRelativeTextFile(
		"../example_data/GET_devices_groups__200.json",
	);
	schemasJIT.mustParse("GET /devices/groups", json);
	// schemasAOT.mustParse("GET /devices/groups", json);
});

Deno.test("schemas/mustParse: GET /devices/groups/:id (200 OK)", async () => {
	const json = await readRelativeTextFile(
		"../example_data/GET_devices_groups_id__200.json",
	);
	schemasJIT.mustParse("GET /devices/groups/:id", json);
	// schemasAOT.mustParse("GET /devices/groups/:id", json);
});

Deno.test("schemas/mustParse: GET /users (200 OK)", async () => {
	const json = await readRelativeTextFile("../example_data/GET_users__200.json");
	schemasJIT.mustParse("GET /users", json);
	// schemasAOT.mustParse("GET /users", json);
});

Deno.test("schemas/mustParse: GET /users/:id (200 OK)", async () => {
	const json = await readRelativeTextFile("../example_data/GET_users_id__200.json");
	schemasJIT.mustParse("GET /users/:id", json);
	// schemasAOT.mustParse("GET /users/:id", json);
});

Deno.test("schemas/mustParse: GET /users/groups (200 OK)", async () => {
	const json = await readRelativeTextFile("../example_data/GET_users_groups__200.json");
	schemasJIT.mustParse("GET /users/groups", json);
	// schemasAOT.mustParse("GET /users/groups", json);
});

Deno.test("schemas/mustParse: GET /users/groups/:id (200 OK)", async () => {
	const json = await readRelativeTextFile(
		"../example_data/GET_users_groups_id__200.json",
	);
	schemasJIT.mustParse("GET /users/groups/:id", json);
	// schemasAOT.mustParse("GET /users/groups/:id", json);
});
