import type * as models from "./models/mod.ts";
import * as api from "./api.ts";
import { APIError } from "./errors.ts";

/**
 * Create an API client. Clients are a high level bridge to the API that can
 * query for data and return its representation as an object. Clients don't
 * perform actions on any data as all actions are methods on the returned
 * objects.
 *
 * `API` and `Client` can interoperate. The 'create*' methods on the client
 * take data returned from an `API` and upgrade it to an object with methods.
 */
export function createClient(
	init: api.Credentials | { api: models.API },
): models.Client {
	return new Client({
		api: "api" in init ? init.api : api.createAPI(init),
	});
}

// Everything this function does could be done better by a decorator.
/**
 * Return `value` if `error` is an `APIError`, otherwise throw `error`.
 *
 * JavaScript (or at least V8, not sure if this is in the spec) captures
 * the stack on error instantiation instead of when it's thrown, so re-throwing
 * it won't touch the trace.
 */
function suppressAPIError<T>(value: T, error: unknown): T {
	if (!(error instanceof APIError)) {
		throw error;
	}
	return value;
}

/**
 * An object that instantiates other objects. This is just the 'create'
 * methods of the Client model to remove any temptation to cheat and just
 * use the client to do some work. Each object should be self contained.
 */
type Creator = Pick<
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
type BasicObjectInit<T> = {
	api: models.API;
	client: Creator;
	data: T;
};

// All of the classes in this file are purely implementation details. The
// interfaces exported from ./models/mod.ts are the source of truth.

type ClientInit = {
	api: models.API;
};

class Client implements models.Client {
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
		if (!api.isValidID(id) || id === 0) {
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
		if (!api.isValidID(id)) {
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
		if (!api.isValidUDID(udid)) {
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
		if (!api.isValidID(id) || id === 0) {
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

// The data could be from either API.getDevice or API.getDevices
// and for some reason they both return different data?????? ffs
type DeviceData = models.APIData["getDevices"][number];

class Device implements models.Device {
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

type DeviceGroupData = models.APIData["getDeviceGroups"][number];

class DeviceGroup implements models.DeviceGroup {
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
}

type UserData = models.APIData["getUsers"][number];

class User implements models.User {
	#api: models.API;
	#client: Creator;
	#data: UserData;

	constructor(init: BasicObjectInit<UserData>) {
		this.#api = init.api;
		this.#client = init.client;
		this.#data = init.data;
	}

	toJSON() {
		return this.#data;
	}

	get type() {
		return "User" as const;
	}

	get id() {
		return this.#data.id;
	}

	get email() {
		return this.#data.email;
	}

	get username() {
		return this.#data.username;
	}

	get domain() {
		return this.#data.domain;
	}

	get name() {
		return this.#data.name;
	}

	get firstName() {
		return this.#data.firstName;
	}

	get lastName() {
		return this.#data.lastName;
	}

	get notes() {
		return this.#data.notes;
	}

	get isTrashed() {
		return this.#data.status === "Trash";
	}

	get isExcludedFromRestrictions() {
		return this.#data.exclude;
	}

	async update() {
		// This shouldn't be wrapped in try/catch because its failure is an error
		// the user should know about.
		this.#data = await this.#api.getUser(this.#data.id);
		return this;
	}

	async getDevices(): Promise<models.Device[]> {
		let devices;
		try {
			devices = await this.#api.getDevices({ ownerId: this.#data.id });
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}

		return devices.map((device) => this.#client.createDevice(device));
	}

	async getGroups(): Promise<models.UserGroup[]> {
		let userGroupData;
		try {
			userGroupData = await this.#api.getUserGroups();
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}

		const myGroups = userGroupData.filter((group) =>
			this.#data.groupIds.includes(group.id)
		);

		return myGroups.map((group) => this.#client.createUserGroup(group));
	}
}

type UserGroupData = models.APIData["getUserGroups"][number];

class UserGroup implements models.UserGroup {
	#api: models.API;
	#client: Creator;
	#data: UserGroupData;

	constructor(init: BasicObjectInit<UserGroupData>) {
		this.#api = init.api;
		this.#client = init.client;
		this.#data = init.data;
	}

	toJSON() {
		return this.#data;
	}

	get type() {
		return "UserGroup" as const;
	}

	get id() {
		return this.#data.id;
	}
	get name() {
		return this.#data.name;
	}
	get description() {
		return this.#data.description;
	}

	async update() {
		this.#data = await this.#api.getUserGroup(this.#data.id);
		return this;
	}

	async getUsers(): Promise<models.User[]> {
		let allUsers;
		try {
			allUsers = await this.#api.getUsers();
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}

		const myUsers = allUsers.filter((userData) =>
			userData.groupIds.includes(this.#data.id)
		);

		return myUsers.map((user) => this.#client.createUser(user));
	}
}
