import { assert } from "../deps/std_testing_asserts.ts";
import type * as models from "../models/mod.ts";
import type { BasicObjectInit, Creator } from "./Client.ts";
import { suppressAPIError } from "./APIError.ts";

const enrollment = {
	"ac2": { type: "ac2", pending: false } as const,
	"dep": { type: "dep", pending: false } as const,
	"ac2Pending": { type: "ac2", pending: true } as const,
	"depPending": { type: "dep", pending: true } as const,
	"manual": { type: "manual", pending: false } as const,
} as const;

// /devices and /devices/:udid both return subtly different data, but /devices
// is the more sane of the two routes.
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
		return this.#data.name;
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

	get enrollment() {
		return enrollment[this.#data.enrollType];
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
		assert(
			user.id !== 0,
			"Using ID 0 would remove the owner. If this is intentional, use `Device.removeOwner()`",
		);
		if (user.id !== this.#data.owner.id) {
			await this.#api.assignDeviceOwner(this.udid, user.id);
		}
		return this;
	}

	async removeOwner() {
		if (this.#data.owner.id !== 0) {
			await this.#api.assignDeviceOwner(this.udid, 0);
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

	async getApps() {
		let apps, myAppData;
		try {
			[apps, myAppData] = await Promise.all([
				this.#api.getApps(),
				this.#api.getDevice(this.udid, { includeApps: true }),
			]);
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}
		// It's possible that this could be omitted, which is an error condition.
		// That shouldn't fail silently, since that's (in this particular case) a
		// validation failure.
		if (!("apps" in myAppData)) {
			throw new Error("Missing 'apps' property in returned apps");
		}
		const myAppIdentifiers = new Set(myAppData.apps!.map((app) => app.identifier));
		const myApps = apps.filter((app) => myAppIdentifiers.has(app.bundleId));
		return myApps.map((app) => this.#client.createApp(app));
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
}
