import type * as models from "../models/mod.ts";
import type { BasicObjectInit, Creator } from "./Client.ts";
import { suppressAPIError } from "./APIError.ts";

function convertStatusToACL(status: boolean | null): "allow" | "deny" | "inherit" {
	switch (status) {
		case true:
			return "allow";
		case false:
			return "deny";
		case null:
			return "inherit";
		default:
			throw new Error("unreachable");
	}
}

function convertACLToStatus(acl: "allow" | "deny" | "inherit"): boolean | null {
	switch (acl) {
		case "allow":
			return true;
		case "deny":
			return false;
		case "inherit":
			return null;
		default:
			throw new Error("unreachable");
	}
}

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

	toString() {
		return this.#data.name;
	}

	[Symbol.for("Deno.customInspect")]() {
		const props = Deno.inspect({
			name: this.name,
			id: this.id,
		}, { colors: !Deno.noColor });
		return `${this.type} ${props}`;
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

	get isParentGroup() {
		return convertACLToStatus(this.#data.acl.parent);
	}

	get isTeacherGroup() {
		return convertACLToStatus(this.#data.acl.teacher);
	}

	get locationId() {
		return this.#data.locationId;
	}

	async update() {
		this.#data = await this.#api.getUserGroup(this.#data.id);
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

	async setName(name: string) {
		await this.#api.updateUserGroup(this.id, { name });
	}

	async setDescription(text: string) {
		await this.#api.updateUserGroup(this.id, { description: text });
	}

	async setParentGroup(status: boolean | null) {
		await this.#api.updateUserGroup(this.id, {
			acl: {
				parent: convertStatusToACL(status),
			},
		});
	}

	async setTeacherGroup(status: boolean | null) {
		await this.#api.updateUserGroup(this.id, {
			acl: {
				teacher: convertStatusToACL(status),
			},
		});
	}
}
