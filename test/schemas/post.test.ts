// import * as schemasAOT from "../../src/schemas/mod.bundle.js";
import * as schemasJIT from "../../src/schemas/mod.ts";
import { relativeTextFileReader } from "../deps/read_relative_file.ts";

const readRelativeTextFile = relativeTextFileReader(import.meta.url);

// Deno.test("schemas/mustParse: POST /devices/:udid/activationlock/clear (200 OK)", async () => {
// 	const json = await readRelativeTextFile(
// 		"../example_data/POST_devices_udid_activationlock_clear__200.json",
// 	);
// 	schemasJIT.mustParse("POST /devices/:udid/activationlock/clear", json);
// 	// schemasAOT.mustParse("POST /devices/:udid/activationlock/clear", json);
// });

// Deno.test("schemas/mustParse: POST /devices/:udid/refresh (200 OK)", async () => {
// 	const json = await readRelativeTextFile(
// 		"../example_data/POST_devices_udid_refresh__200.json",
// 	);
// 	schemasJIT.mustParse("POST /devices/:udid/refresh", json);
// 	// schemasAOT.mustParse("POST /devices/:udid/refresh", json);
// });

// Deno.test("schemas/mustParse: POST /devices/:udid/restore (200 OK)", async () => {
// 	const json = await readRelativeTextFile(
// 		"../example_data/POST_devices_udid_restore__200.json",
// 	);
// 	schemasJIT.mustParse("POST /devices/:udid/restore", json);
// 	// schemasAOT.mustParse("POST /devices/:udid/restore", json);
// });

Deno.test("schemas/mustParse: POST /devices/:udid/wipe (200 OK)", async () => {
	const json = await readRelativeTextFile(
		"../example_data/POST_devices_udid_wipe__200.json",
	);
	schemasJIT.mustParse("POST /devices/:udid/wipe", json);
	// schemasAOT.mustParse("POST /devices/:udid/wipe", json);
});

// Deno.test("schemas/mustParse: POST /devices/:udid/restart (200 OK)", async () => {
// 	const json = await readRelativeTextFile(
// 		"../example_data/POST_devices_udid_restart__200.json",
// 	);
// 	schemasJIT.mustParse("POST /devices/:udid/restart", json);
// 	// schemasAOT.mustParse("POST /devices/:udid/wipe", json);
// });
