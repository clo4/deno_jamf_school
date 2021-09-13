import type * as models from "../models/mod.ts";
import { isValidID, isValidUDID } from "./API.ts";
import { Device, DeviceData } from "./Device.ts";
import { DeviceGroup, DeviceGroupData } from "./DeviceGroup.ts";
import { User, UserData } from "./User.ts";
import { UserGroup, UserGroupData } from "./UserGroup.ts";
import { suppressAPIError } from "./APIError.ts";

/**
 * An object that instantiates other objects. This is just the 'create'
 * methods of the Client model to remove any temptation to cheat and just
 * use the client to do some work. Each object should be self contained.
 */
export type Creator = Pick<
	Client,
	| "createDevice"
	| "createDeviceGroup"
	| "createUser"
	| "createUserGroup"
>;

/**
 * Init object containing an API, Client, and some data.
 *
 * This should be enough to instantiate most objects.
 */
export type BasicObjectInit<T> = {
	api: models.API;
	client: Creator;
	data: T;
};

// All of the classes in this file are purely implementation details. The
// interfaces exported from ./models/mod.ts are the source of truth.

export type ClientInit = {
	api: models.API;
};

export class Client implements models.Client {
	#api: models.API;

	constructor({ api }: ClientInit) {
		this.#api = api;
	}

	get type() {
		return "Client" as const;
	}

	createDevice(data: DeviceData): models.Device {
		return new Device({
			api: this.#api,
			client: this,
			data: data,
		});
	}

	createDeviceGroup(data: DeviceGroupData): models.DeviceGroup {
		return new DeviceGroup({
			api: this.#api,
			client: this,
			data: data,
		});
	}

	createUser(data: UserData): models.User {
		return new User({
			api: this.#api,
			client: this,
			data: data,
		});
	}

	createUserGroup(data: UserGroupData): models.UserGroup {
		return new UserGroup({
			api: this.#api,
			client: this,
			data: data,
		});
	}

	async getUsers() {
		let users;
		try {
			users = await this.#api.getUsers();
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}

		return users.map((user) => this.createUser(user));
	}

	async getUserById(id: number) {
		// 0 is a valid ID but never has a user associated with it
		if (!isValidID(id) || id === 0) {
			return null;
		}

		let userData;
		try {
			userData = await this.#api.getUser(id);
		} catch (e: unknown) {
			return suppressAPIError(null, e);
		}

		return this.createUser(userData);
	}

	async getUserGroups() {
		let userGroups;
		try {
			userGroups = await this.#api.getUserGroups();
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}
		return userGroups.map((group) => this.createUserGroup(group));
	}

	async getUserGroupById(id: number) {
		if (!isValidID(id)) {
			return null;
		}
		let group;
		try {
			group = await this.#api.getUserGroup(id);
		} catch (e: unknown) {
			return suppressAPIError(null, e);
		}
		return this.createUserGroup(group);
	}

	async getUserGroupByName(name: string) {
		let allGroups;
		try {
			allGroups = await this.#api.getUserGroups();
		} catch (e: unknown) {
			return suppressAPIError(null, e);
		}

		const groups = allGroups.filter((group) => group.name === name);

		if (groups.length === 0) {
			return null;
		}

		// More than one group with the same name is a failure case.
		if (groups.length > 1) {
			throw new Error(`Multiple groups exist with the same name (${name})`);
		}

		return this.createUserGroup(groups[0]);
	}

	async getDevices() {
		let devices;
		try {
			devices = await this.#api.getDevices();
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}

		return devices.map((device) => this.createDevice(device));
	}

	async getDevicesInGroups(deviceGroups: DeviceGroup[]) {
		const groupIds = deviceGroups.map((group) => group.id);

		let devices;
		try {
			devices = await this.#api.getDevices({ groupIds });
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}

		return devices.map((device) => this.createDevice(device));
	}

	async getDeviceById(udid: string) {
		if (!isValidUDID(udid)) {
			return null;
		}

		let devices;

		// Since `GET /devices` and `GET /devices/:udid` return *slightly*
		// different data, it's easier to just do two queries than smush it
		// into the correct shape. I don't love this, but I can't think of
		// a better way (open to suggestions or PRs!)
		try {
			const { serialNumber } = await this.#api.getDevice(udid);
			devices = await this.#api.getDevices({ serialNumber });
		} catch (e: unknown) {
			return suppressAPIError(null, e);
		}

		if (devices.length !== 1) {
			return null;
		}

		return this.createDevice(devices[0]);
	}

	async getDeviceBySerialNumber(serialNumber: string) {
		// Apple's serial numbers will soon be randomized, no point in
		// doing any validation. Just try it and see if it works.

		let devices;
		try {
			devices = await this.#api.getDevices({ serialNumber });
		} catch (e: unknown) {
			return suppressAPIError(null, e);
		}

		// No devices with the serial number is an empty array, not an error.
		if (devices.length !== 1) {
			return null;
		}

		return this.createDevice(devices[0]);
	}

	async getDeviceGroups(): Promise<models.DeviceGroup[]> {
		let groups;
		try {
			groups = await this.#api.getDeviceGroups();
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}

		return groups.map((group) => this.createDeviceGroup(group));
	}

	async getDeviceGroupById(id: number) {
		if (!isValidID(id) || id === 0) {
			return null;
		}

		let group;
		try {
			group = await this.#api.getDeviceGroup(id);
		} catch (e: unknown) {
			return suppressAPIError(null, e);
		}

		return this.createDeviceGroup(group);
	}

	async getDeviceGroupByName(name: string) {
		let allGroups;
		try {
			allGroups = await this.#api.getDeviceGroups();
		} catch (e: unknown) {
			return suppressAPIError(null, e);
		}

		const groups = allGroups.filter((group) => group.name === name);

		if (groups.length === 0) {
			return null;
		}

		// TODO: check if this is actually possible?
		if (groups.length > 1) {
			throw Error(`More than one device group with the same name (${name})`);
		}

		return this.createDeviceGroup(groups[0]);
	}
}
