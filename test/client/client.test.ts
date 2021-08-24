import * as jamf from "../../src/mod.ts";
import { mustParse } from "../../src/schemas/mod.ts";
import { relativeTextFileReader } from "../deps/read_relative_file.ts";

const readRelativeTextFile = relativeTextFileReader(import.meta.url);

const client = jamf.createClient({ id: "", token: "", url: "" });

Deno.test({
	name: "Client/createDevice: no apps",
	async fn() {
		const data = mustParse(
			"GET /devices",
			await readRelativeTextFile("../example_data/GET_devices__200.json"),
		);

		data.devices.map(
			(device) => client.createDevice(device),
		);
	},
});

Deno.test({
	name: "Client/createDevice: with apps",
	async fn() {
		const data = mustParse(
			"GET /devices",
			await readRelativeTextFile("../example_data/GET_devices__200__apps.json"),
		);

		data.devices.map(
			(device) => client.createDevice(device),
		);
	},
});

Deno.test({
	name: "Client/createUser: single user data",
	async fn() {
		const data = mustParse(
			"GET /users/:id",
			await readRelativeTextFile("../example_data/GET_users_id__200.json"),
		);
		client.createUser(data.user);
	},
});

Deno.test({
	name: "Client/createUser: multiple users",
	async fn() {
		const data = mustParse(
			"GET /users",
			await readRelativeTextFile("../example_data/GET_users__200.json"),
		);

		data.users.map(
			(user) => client.createUser(user),
		);
	},
});

Deno.test({
	name: "Client/createDeviceGroup: from multiple device groups",
	async fn() {
		const data = mustParse(
			"GET /devices/groups",
			await readRelativeTextFile("../example_data/GET_devices_groups__200.json"),
		);

		data.deviceGroups.map(
			(user) => client.createDeviceGroup(user),
		);
	},
});

Deno.test({
	name: "Client/createDeviceGroup: from single device group",
	async fn() {
		const data = mustParse(
			"GET /devices/groups/:id",
			await readRelativeTextFile("../example_data/GET_devices_groups_id__200.json"),
		);

		client.createDeviceGroup(data.deviceGroup);
	},
});

Deno.test({
	name: "Client/createUserGroup: from multiple user groups",
	async fn() {
		const data = mustParse(
			"GET /users/groups",
			await readRelativeTextFile("../example_data/GET_users_groups__200.json"),
		);

		data.groups.map(
			(user) => client.createUserGroup(user),
		);
	},
});

Deno.test({
	name: "Client/createUserGroup: from single user group",
	async fn() {
		const data = mustParse(
			"GET /users/groups/:id",
			await readRelativeTextFile("../example_data/GET_users_groups_id__200.json"),
		);

		client.createUserGroup(data.group);
	},
});
