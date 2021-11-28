import type * as models from "../models/mod.ts";
import type { BasicObjectInit, Creator } from "./Client.ts";
import { suppressAPIError } from "./APIError.ts";
import { customInspect } from "./customInspect.ts";

export type DeviceGroupData = models.APIData["getDeviceGroups"][number];

export class DeviceGroup implements models.DeviceGroup {
	#api: models.API;
	#client: Creator;
	#data: DeviceGroupData;

	constructor(init: BasicObjectInit<DeviceGroupData>) {
		this.#api = init.api;
		this.#client = init.client;
		this.#data = init.data;
	}

	toString() {
		return this.#data.name;
	}

	toJSON() {
		return this.#data;
	}

	[Symbol.for("Deno.customInspect")]() {
		return customInspect(this);
	}

	get type() {
		return "DeviceGroup" as const;
	}

	get id() {
		return this.#data.id;
	}

	get name() {
		return this.#data.name;
	}

	get information() {
		return this.#data.information;
	}

	get description() {
		return this.#data.description;
	}

	get isSmart() {
		return this.#data.isSmartGroup;
	}

	get imageUrl() {
		return this.#data.imageUrl;
	}

	get locationId() {
		return this.#data.locationId;
	}

	get count() {
		return this.#data.members;
	}

	get isShared() {
		return this.#data.shared;
	}

	get isClass() {
		return this.#data.type === "class";
	}

	async update() {
		this.#data = await this.#api.getDeviceGroup(this.#data.id);
	}

	async getDevices(): Promise<models.Device[]> {
		let devices;
		try {
			devices = await this.#api.getDevices({ groupIds: [this.#data.id] });
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}

		return devices.map((device) => this.#client.createDevice(device));
	}

	async getLocation() {
		let locationData;
		try {
			locationData = await this.#api.getLocation(this.#data.locationId);
		} catch (e: unknown) {
			return suppressAPIError(null, e);
		}
		return this.#client.createLocation(locationData);
	}

	async setName(name: string) {
		if (this.#data.name !== name) {
			await this.#api.updateDeviceGroup(this.#data.id, { name });
		}
	}

	async setDescription(text: string) {
		if (this.#data.description !== text) {
			await this.#api.updateDeviceGroup(this.#data.id, { description: text });
		}
	}

	async restartDevices() {
		const devices = await this.#api.getDevices({ groupIds: [this.#data.id] });
		const promises = devices.map((device) => this.#api.restartDevice(device.UDID));
		await Promise.allSettled(promises);
	}
}
