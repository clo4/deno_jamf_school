import { assertValid } from "./util.ts";

Deno.test("schemas/assertValid: PUT /devices/:udid/owner (200 OK)", async () => {
	const json = await import(
		"../example_data/PUT_devices_udid_owner__200.json",
		{ assert: { type: "json" } }
	);
	assertValid("PUT /devices/:udid/owner", JSON.parse(json));
});

Deno.test("schemas/assertValid: PUT /devices/groups/:id (200 OK)", async () => {
	const json = await import(
		"../example_data/PUT_devices_groups_id__200.json",
		{ assert: { type: "json" } }
	);
	assertValid("PUT /devices/groups/:id", JSON.parse(json));
});

Deno.test("schemas/assertValid: PUT /devices/migrate (200 OK)", async () => {
	const json = await import(
		"../example_data/PUT_devices_migrate__200.json",
		{ assert: { type: "json" } }
	);
	assertValid("PUT /devices/migrate", JSON.parse(json));
});

Deno.test("schemas/assertValid: PUT /devices/:udid/migrate (200 OK)", async () => {
	const json = await import(
		"../example_data/PUT_devices_udid_migrate__200.json",
		{ assert: { type: "json" } }
	);
	assertValid("PUT /devices/:udid/migrate", JSON.parse(json));
});

Deno.test("schemas/assertValid: PUT /users/:id/migrate (200 OK)", async () => {
	const json = await import(
		"../example_data/PUT_users_id_migrate__200.json",
		{ assert: { type: "json" } }
	);
	assertValid("PUT /users/:id/migrate", JSON.parse(json));
});

Deno.test("schemas/assertValid: PUT /users/:id (200 OK)", async () => {
	const json = await import(
		"../example_data/PUT_users_id__200.json",
		{ assert: { type: "json" } }
	);
	assertValid("PUT /users/:id", JSON.parse(json));
});

Deno.test("schemas/assertValid: PUT /users/groups/:id (200 OK)", async () => {
	const json = await import(
		"../example_data/PUT_users_groups_id__200.json",
		{ assert: { type: "json" } }
	);
	assertValid("PUT /users/groups/:id", JSON.parse(json));
});
