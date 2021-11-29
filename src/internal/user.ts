import type * as models from "../models/mod.ts";
import type { BasicObjectInit, Creator } from "./client.ts";
import { suppressAPIError } from "./api_error.ts";
import { customInspect } from "./custom_inspect.ts";

export type UserData = models.APIData["getUser"];

export class User implements models.User {
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

	toString() {
		return this.#data.name;
	}

	[Symbol.for("Deno.customInspect")]() {
		return customInspect(this);
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

	get locationId() {
		return this.#data.locationId;
	}

	async update() {
		// This shouldn't be wrapped in try/catch because its failure is an error
		// the user should know about.
		this.#data = await this.#api.getUser(this.#data.id);
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

		const groupIds = new Set(this.#data.groupIds);
		const myGroups = userGroupData.filter((group) => groupIds.has(group.id));

		return myGroups.map((group) => this.#client.createUserGroup(group));
	}

	async getClasses(): Promise<models.UserGroup[]> {
		let userGroupData;
		try {
			userGroupData = await this.#api.getUserGroups();
		} catch (e: unknown) {
			return suppressAPIError([], e);
		}

		const groupIds = new Set(this.#data.teacherGroups);
		const myClasses = userGroupData.filter((group) => groupIds.has(group.id));

		return myClasses.map((group) => this.#client.createUserGroup(group));
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

	async setUsername(username: string) {
		if (this.#data.username !== username) {
			await this.#api.updateUser(this.#data.id, { username });
		}
	}

	async setDomain(domain: string) {
		if (this.#data.domain !== domain) {
			await this.#api.updateUser(this.#data.id, { domain });
		}
	}

	async setFirstName(name: string) {
		if (this.#data.firstName !== name) {
			await this.#api.updateUser(this.#data.id, { firstName: name });
		}
	}

	async setLastName(name: string) {
		if (this.#data.lastName !== name) {
			await this.#api.updateUser(this.#data.id, { lastName: name });
		}
	}

	async setPassword(password: string) {
		await this.#api.updateUser(this.#data.id, { password });
	}

	async setEmail(email: string) {
		if (this.#data.email !== email) {
			await this.#api.updateUser(this.#data.id, { email });
		}
	}

	async setGroups(groups: { id: number }[]) {
		await this.#api.updateUser(this.#data.id, {
			memberOf: groups.map((group) => group.id),
		});
	}

	async setClasses(groups: { id: number }[]) {
		await this.#api.updateUser(this.#data.id, {
			teacher: groups.map((group) => group.id),
		});
	}

	async setChildren(users: { id: number }[]) {
		await this.#api.updateUser(this.#data.id, {
			children: users.map((user) => user.id),
		});
	}

	async setLocation(location: { id: number }) {
		if (this.#data.locationId !== location.id) {
			await this.#api.moveUser(this.#data.id, location.id);
		}
	}

	async restartDevices() {
		const devices = await this.#api.getDevices({ ownerId: this.#data.id });
		const promises = devices.map((device) => this.#api.restartDevice(device.UDID));
		await Promise.allSettled(promises);
	}
}
