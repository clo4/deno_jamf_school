import type * as models from "../models/mod.ts";
import type { BasicObjectInit, Creator } from "./Client.ts";
import { suppressAPIError } from "./APIError.ts";

export type UserData = models.APIData["getUsers"][number];

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
