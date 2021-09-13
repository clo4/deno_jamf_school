import type * as models from "../models/mod.ts";
import type { BasicObjectInit, Creator } from "./Client.ts";

export type AppData = models.APIData["getApps"][number];

export class App implements models.App {
	#api: models.API;
	#client: Creator;
	#data: AppData;

	constructor(init: BasicObjectInit<AppData>) {
		this.#api = init.api;
		this.#client = init.client;
		this.#data = init.data;
	}

	toJSON() {
		return this.#data;
	}

	get type() {
		return "App" as const;
	}

	get id() {
		return this.#data.id;
	}

	get appId() {
		return this.#data.adamId ?? null;
	}

	get bundleId() {
		return this.#data.bundleId;
	}

	get icon() {
		return this.#data.icon;
	}

	get isBook() {
		return this.#data.isBook;
	}

	get isTrashed() {
		return this.#data.isDeleted ?? false;
	}

	get name() {
		return this.#data.name;
	}

	get price() {
		return this.#data.price ?? 0;
	}

	get version() {
		return this.#data.version;
	}
}
