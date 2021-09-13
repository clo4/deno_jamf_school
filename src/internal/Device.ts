import type * as models from "../models/mod.ts";
import type { BasicObjectInit, Creator } from "./Client.ts";
import { suppressAPIError } from "./APIError.ts";

// The data could be from either API.getDevice or API.getDevices
// and for some reason they both return different data?????? ffs
export type DeviceData = models.APIData["getDevices"][number];

export class Device implements models.Device {
	#api: models.API;
	#client: Creator;
	#data: DeviceData;

	constructor(init: BasicObjectInit<DeviceData>) {
		this.#api = init.api;
		this.#client = init.client;
		this.#data = init.data;
	}

	toString() {
		return `${this.#data.model.name} of ${this.#data.owner.name}`;
	}

	toJSON() {
		return this.#data;
	}

	get type() {
		return "Device" as const;
	}

	get udid() {
		return this.#data.UDID;
	}

	get serialNumber() {
		return this.#data.serialNumber;
	}

	get name() {
		return this.#data.name;
	}

	get isManaged() {
		return this.#data.isManaged;
	}

	get isSupervised() {
		return this.#data.isSupervised;
	}

	get deviceClass() {
		return this.#data.class;
	}

	get assetTag() {
		return this.#data.assetTag;
	}

	get os() {
		return `${this.osPrefix} ${this.osVersion}`;
	}

	get osPrefix() {
		return this.#data.os.prefix;
	}

	get osVersion() {
		return this.#data.os.version;
	}

	get modelName() {
		return this.#data.model.name;
	}

	get modelIdentifier() {
		return this.#data.model.identifier;
	}

	get modelType() {
		return this.#data.model.type;
	}

	get batteryPercentage() {
		return this.#data.batteryLevel;
	}

	get batteryCapacity() {
		return this.#data.totalCapacity;
	}

	// This isn't required by the model yet, exists for testing in a REPL
	get availableCapacity() {
		return this.#data.availableCapacity;
	}

	async update() {
		const devices = await this.#api.getDevices({
			serialNumber: this.#data.serialNumber,
		});

		if (devices.length !== 1) {
			throw new Error(`Expected 1 devices, got ${devices.length}`);
		}

		this.#data = devices[0];

		return this;
	}

	async getOwner() {
		if (this.#data.owner.id === 0) {
			return null;
		}

		let userData;
		try {
			userData = await this.#api.getUser(this.#data.owner.id);
		} catch (e: unknown) {
			return suppressAPIError(null, e);
		}

		return this.#client.createUser(userData);
	}

	async setOwner(user: { id: number }) {
		if (user.id !== this.#data.owner.id) {
			await this.#api.assignDeviceOwner(this.udid, user.id);
		}
		return this;
	}

	async getGroups(): Promise<models.DeviceGroup[]> {
		let allGroups;
		try {
			allGroups = await this.#api.getDeviceGroups();
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}

		const myGroups = allGroups.filter(
			(groupData) => this.#data.groups.includes(groupData.name),
		);

		return myGroups.map((group) => this.#client.createDeviceGroup(group));
	}

	async restart() {
		await this.#api.restartDevice(this.#data.UDID);
		return this;
	}

	async wipe() {
		await this.#api.wipeDevice(this.#data.UDID);
		return this;
	}
}
