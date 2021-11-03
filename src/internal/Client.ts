import type * as models from "../models/mod.ts";
import { isValidID, isValidUDID } from "./API.ts";
import { Device, DeviceData } from "./Device.ts";
import { DeviceGroup, DeviceGroupData } from "./DeviceGroup.ts";
import { User, UserData } from "./User.ts";
import { UserGroup, UserGroupData } from "./UserGroup.ts";
import { App, AppData } from "./App.ts";
import { Location, LocationData } from "./Location.ts";
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
	| "createApp"
	| "createLocation"
>;

/**
 * Init object with an API, Client, and some data (T). This should be enough to
 * instantiate most objects.
 */
export type BasicObjectInit<T> = {
	api: models.API;
	client: Creator;
	data: T;
};

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

	createApp(data: AppData): models.App {
		return new App({
			api: this.#api,
			client: this,
			data: data,
		});
	}

	createLocation(data: LocationData): models.Location {
		return new Location({
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

	async getUserByName(name: string) {
		let allUsers;
		try {
			allUsers = await this.#api.getUsers();
		} catch (e: unknown) {
			return suppressAPIError(null, e);
		}

		const users = allUsers.filter((group) => group.name === name);

		if (users.length === 0) {
			return null;
		}

		// More than one user with the same name is a failure case.
		if (users.length > 1) {
			throw new Error(`Multiple users exist with the same name (${name})`);
		}

		return this.createUser(users[0]);
	}

	async getUserByUsername(username: string) {
		let allUsers;
		try {
			allUsers = await this.#api.getUsers();
		} catch (e: unknown) {
			return suppressAPIError(null, e);
		}

		const users = allUsers.filter((group) => group.username === username);

		if (users.length === 0) {
			return null;
		}

		// More than one user with the same name is a failure case.
		// Mutliple users with the same username should be impossible.
		if (users.length > 1) {
			throw new Error(`Multiple users exist with the same username (${username})`);
		}

		return this.createUser(users[0]);
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

	async getDevicesInGroups(deviceGroups: { id: number }[]) {
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

	async getApps() {
		let apps;
		try {
			apps = await this.#api.getApps();
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}

		return apps.map((app) => this.createApp(app));
	}

	async getAppById(id: number) {
		// 0 is never a valid app ID
		if (id === 0 || !isValidID(id)) {
			return null;
		}

		let app;
		try {
			app = await this.#api.getApp(id);
		} catch (e: unknown) {
			return suppressAPIError(null, e);
		}

		return this.createApp(app);
	}

	async getAppByBundleId(bundleId: string) {
		let apps;
		try {
			apps = await this.#api.getApps();
		} catch (e: unknown) {
			return suppressAPIError(null, e);
		}

		const found = apps.filter((app) => app.bundleId === bundleId);

		if (found.length === 0) {
			return null;
		}

		if (found.length > 1) {
			throw new Error(`More than one app with the same bundle ID (${bundleId})`);
		}

		return this.createApp(found[0]);
	}

	async getAppByName(name: string) {
		let apps;
		try {
			apps = await this.#api.getApps();
		} catch (e: unknown) {
			return suppressAPIError(null, e);
		}

		const found = apps.filter((app) => app.name === name);

		if (found.length === 0) {
			return null;
		}

		if (found.length > 1) {
			throw new Error(`More than one app with the same name (${name})`);
		}

		return this.createApp(found[0]);
	}

	async getLocations() {
		let locations;
		try {
			locations = await this.#api.getLocations();
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}

		return locations.map((loc) => this.createLocation(loc));
	}

	async getLocationById(id: number) {
		if (!isValidID(id)) {
			return null;
		}

		let loc;
		try {
			loc = await this.#api.getLocation(id);
		} catch (e: unknown) {
			return suppressAPIError(null, e);
		}

		return this.createLocation(loc);
	}

	async getLocationByName(name: string) {
		let locations;
		try {
			locations = await this.#api.getLocations();
		} catch (e: unknown) {
			return suppressAPIError(null, e);
		}

		const found = locations.filter((loc) => loc.name === name);

		if (found.length === 0) {
			return null;
		}

		if (found.length > 1) {
			throw new Error(`More than one location with the same name (${name})`);
		}

		return this.createLocation(found[0]);
	}
}
