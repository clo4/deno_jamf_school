import type * as models from "../models/mod.ts";
import type { BasicObjectInit, Creator } from "./Client.ts";
import { suppressAPIError } from "./APIError.ts";

export type UserGroupData = models.APIData["getUserGroups"][number];

export class UserGroup implements models.UserGroup {
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
