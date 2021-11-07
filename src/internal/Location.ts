import { chunk } from "../deps/std_collections_chunk.ts";
import type * as models from "../models/mod.ts";
import type { BasicObjectInit, Creator } from "./Client.ts";
import { suppressAPIError } from "./APIError.ts";

export type LocationData = models.APIData["getLocation"];

export class Location implements models.Location {
	#api: models.API;
	#client: Creator;
	#data: LocationData;

	constructor(init: BasicObjectInit<LocationData>) {
		this.#api = init.api;
		this.#client = init.client;
		this.#data = init.data;
	}

	toJSON() {
		return this.#data;
	}

	toString() {
		return this.#data.name;
	}

	[Symbol.for("Deno.customInspect")]() {
		const props = Deno.inspect({
			name: this.name,
			id: this.id,
		}, { colors: !Deno.noColor });
		const className = this.constructor.name;
		return `${className} ${props}`;
	}

	get type() {
		return "Location" as const;
	}

	get name() {
		return this.#data.name;
	}

	get id() {
		return this.#data.id;
	}

	get streetName() {
		return this.#data.street;
	}

	get streetNumber() {
		return this.#data.streetNumber;
	}

	get isDistrict() {
		return this.#data.isDistrict;
	}

	get postalCode() {
		return this.#data.postalCode;
	}

	get asmIdentifier() {
		return this.#data.asmIdentifier;
	}

	get schoolNumber() {
		return this.#data.schoolNumber;
	}

	get city() {
		return this.#data.city;
	}

	async update() {
		this.#data = await this.#api.getLocation(this.#data.id);
		return this;
	}

	async getDevices() {
		let devices;
		try {
			devices = await this.#api.getDevices({
				locationId: this.#data.id,
			});
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}

		return devices.map((device) => this.#client.createDevice(device));
	}

	async getDeviceGroups(): Promise<models.DeviceGroup[]> {
		let deviceGroups;
		try {
			deviceGroups = await this.#api.getDeviceGroups();
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}

		const myDeviceGroups = deviceGroups.filter((group) =>
			group.locationId === this.#data.id
		);

		return myDeviceGroups.map((group) => this.#client.createDeviceGroup(group));
	}

	async getUsers(): Promise<models.User[]> {
		let users;
		try {
			users = await this.#api.getUsers();
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}

		const myUsers = users.filter((user) => user.locationId === this.#data.id);

		return myUsers.map((user) => this.#client.createUser(user));
	}

	async getUserGroups(): Promise<models.UserGroup[]> {
		let userGroups;
		try {
			userGroups = await this.#api.getUserGroups();
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}

		const myGroups = userGroups.filter((group) => this.#data.id === group.locationId);

		return myGroups.map((group) => this.#client.createUserGroup(group));
	}

	async getApps(): Promise<models.App[]> {
		let apps;
		try {
			apps = await this.#api.getApps();
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}

		const myApps = apps.filter((app) => app.locationId === this.#data.id);

		return myApps.map((app) => this.#client.createApp(app));
	}

	async moveDevices(devices: { udid: string; locationId?: number }[]) {
		// This signature in the model doesn't specify locationId, but if the object
		// *does* have it, we can optimize this further by filtering out the devices
		// that wouldn't be moved
		const udids = devices
			.filter((device) => device.locationId !== this.id)
			.map((device) => device.udid);

		// It's possible that after the filter there wouldn't be any devices left, so
		// it's cheaper to skip the network entirely and return now.
		if (udids.length === 0) {
			return this;
		}

		// Endpoint doesn't accept more than 20 devices per request, so chunking the
		// array into groups of 20 and requesting in parallel is an easy workaround.
		const unique = [...new Set(udids)];
		const chunks = chunk(unique, 20);
		const promises = chunks.map((arr) => this.#api.moveDevices(arr, this.id));
		await Promise.allSettled(promises);

		return this;
	}

	async moveUsers(users: { id: number; locationId?: number }[]) {
		const ids = users
			.filter((user) => user.locationId !== this.id)
			.map((user) => user.id);

		if (ids.length === 0) {
			return this;
		}

		const unique = [...new Set(ids)];
		const promises = unique.map((id) => this.#api.moveUser(id, this.id));
		await Promise.allSettled(promises);

		return this;
	}
}
