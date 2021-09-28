import * as jamf from "../../src/mod.ts";
import { assertValid } from "../../src/schemas/mod.ts";
import { relativeTextFileReader } from "../deps/read_relative_file.ts";

const readRelativeTextFile = relativeTextFileReader(import.meta.url);

const client = jamf.createClient({ id: "", token: "", url: "" });

Deno.test({
	name: "Client/createDevice: no apps",
	async fn() {
		const data = JSON.parse(
			await readRelativeTextFile("../example_data/GET_devices__200.json"),
		);
		assertValid("GET /devices", data);

		data.devices.map(
			(device) => client.createDevice(device),
		);
	},
});

Deno.test({
	name: "Client/createDevice: with apps",
	async fn() {
		const data = JSON.parse(
			await readRelativeTextFile("../example_data/GET_devices__200__apps.json"),
		);
		assertValid("GET /devices", data);

		data.devices.map(
			(device) => client.createDevice(device),
		);
	},
});

Deno.test({
	name: "Client/createUser: single user data",
	async fn() {
		const data = JSON.parse(
			await readRelativeTextFile("../example_data/GET_users_id__200.json"),
		);
		assertValid("GET /users/:id", data);
		client.createUser(data.user);
	},
});

Deno.test({
	name: "Client/createUser: multiple users",
	async fn() {
		const data = JSON.parse(
			await readRelativeTextFile("../example_data/GET_users__200.json"),
		);
		assertValid("GET /users", data);

		data.users.map(
			(user) => client.createUser(user),
		);
	},
});

Deno.test({
	name: "Client/createDeviceGroup: from multiple device groups",
	async fn() {
		const data = JSON.parse(
			await readRelativeTextFile("../example_data/GET_devices_groups__200.json"),
		);
		assertValid("GET /devices/groups", data);

		data.deviceGroups.map(
			(user) => client.createDeviceGroup(user),
		);
	},
});

Deno.test({
	name: "Client/createDeviceGroup: from single device group",
	async fn() {
		const data = JSON.parse(
			await readRelativeTextFile("../example_data/GET_devices_groups_id__200.json"),
		);
		assertValid("GET /devices/groups/:id", data);

		client.createDeviceGroup(data.deviceGroup);
	},
});

Deno.test({
	name: "Client/createUserGroup: from multiple user groups",
	async fn() {
		const data = JSON.parse(
			await readRelativeTextFile("../example_data/GET_users_groups__200.json"),
		);
		assertValid("GET /users/groups", data);

		data.groups.map(
			(user) => client.createUserGroup(user),
		);
	},
});

Deno.test({
	name: "Client/createUserGroup: from single user group",
	async fn() {
		const data = JSON.parse(
			await readRelativeTextFile("../example_data/GET_users_groups_id__200.json"),
		);
		assertValid("GET /users/groups/:id", data);

		client.createUserGroup(data.group);
	},
});

Deno.test({
	name: "Client/createApp: from multiple apps",
	async fn() {
		const data = JSON.parse(
			await readRelativeTextFile("../example_data/GET_apps__200.json"),
		);
		assertValid("GET /apps", data);

		data.apps.map((app) => client.createApp(app));
	},
});

Deno.test({
	name: "Client/createLocation: from multiple locations",
	async fn() {
		const data = JSON.parse(
			await readRelativeTextFile("../example_data/GET_locations__200.json"),
		);
		assertValid("GET /locations", data);

		data.locations.map((location) => client.createLocation(location));
	},
});
