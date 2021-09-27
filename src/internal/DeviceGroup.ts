import type * as models from "../models/mod.ts";
import type { BasicObjectInit, Creator } from "./Client.ts";
import { suppressAPIError } from "./APIError.ts";
import { intersect } from "../deps/fast_array_intersect.ts";

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
		return `${this.#data.name} (${this.#data.members})`;
	}

	toJSON() {
		return this.#data;
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

	get isSmartGroup() {
		return this.#data.isSmartGroup;
	}

	get imageUrl() {
		return this.#data.imageUrl;
	}

	// get isShared() {
	// 	return this.data.shared;
	// }
	// get isClass() {
	// 	return this.data.type === "class";
	// }

	async update() {
		this.#data = await this.#api.getDeviceGroup(this.#data.id);
		return this;
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

	async getCommonApps() {
		let devices, apps;
		try {
			[apps, devices] = await Promise.all([
				this.#api.getApps(),
				this.#api.getDevices({
					groupIds: [this.#data.id],
					includeApps: true,
				}),
			]);
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}

		const appIdentifiers = devices.map((device) => {
			return device.apps!.map((app) => app.identifier);
		});

		const commonIdentifiers = new Set(intersect(appIdentifiers));

		const filteredApps = apps.filter((app) => commonIdentifiers.has(app.bundleId));
		return filteredApps.map((app) => this.#client.createApp(app));
	}
}
