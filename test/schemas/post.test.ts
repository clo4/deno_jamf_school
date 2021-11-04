import { assertValid } from "./util.ts";
import { relativeTextFileReader } from "../deps/read_relative_file.ts";

const readRelativeTextFile = relativeTextFileReader(import.meta.url);

// Deno.test("schemas/assertValid: POST /devices/:udid/activationlock/clear (200 OK)", async () => {
// 	const json = await readRelativeTextFile(
// 		"../example_data/POST_devices_udid_activationlock_clear__200.json",
// 	);
// 	assertValid("POST /devices/:udid/activationlock/clear", JSON.parse(json));
// });

// Deno.test("schemas/assertValid: POST /devices/:udid/refresh (200 OK)", async () => {
// 	const json = await readRelativeTextFile(
// 		"../example_data/POST_devices_udid_refresh__200.json",
// 	);
// 	assertValid("POST /devices/:udid/refresh", JSON.parse(json));
// });

// Deno.test("schemas/assertValid: POST /devices/:udid/restore (200 OK)", async () => {
// 	const json = await readRelativeTextFile(
// 		"../example_data/POST_devices_udid_restore__200.json",
// 	);
// 	assertValid("POST /devices/:udid/restore", JSON.parse(json));
// });

Deno.test("schemas/assertValid: POST /devices/:udid/wipe (200 OK)", async () => {
	const json = await readRelativeTextFile(
		"../example_data/POST_devices_udid_wipe__200.json",
	);
	assertValid("POST /devices/:udid/wipe", JSON.parse(json));
});

Deno.test("schemas/assertValid: POST /devices/:udid/details (200 OK)", async () => {
	const json = await readRelativeTextFile(
		"../example_data/POST_devices_udid_details__200.json",
	);
	assertValid("POST /devices/:udid/details", JSON.parse(json));
});
// Deno.test("schemas/assertValid: POST /devices/:udid/restart (200 OK)", async () => {
// 	const json = await readRelativeTextFile(
// 		"../example_data/POST_devices_udid_restart__200.json",
// 	);
// 	assertValid("POST /devices/:udid/wipe", JSON.parse(json));
// });
