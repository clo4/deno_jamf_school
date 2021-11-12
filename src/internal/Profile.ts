import type * as models from "../models/mod.ts";
import type { BasicObjectInit, Creator } from "./Client.ts";
import { suppressAPIError } from "./APIError.ts";
import { assert } from "../deps/std_testing_asserts.ts";

const platforms = {
	iOS: { iOS: true, macOS: false },
	macOS: { iOS: false, macOS: true },
	universal: { iOS: true, macOS: true },
} as const;

export type ProfileData = models.APIData["getProfile"];

export class Profile implements models.Profile {
	#api: models.API;
	#client: Creator;
	#data: ProfileData;

	constructor(init: BasicObjectInit<ProfileData>) {
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
		const className = this.constructor.name;
		return `${className} ${props}`;
	}

	get type() {
		return "Profile" as const;
	}

	get name() {
		return this.#data.name;
	}

	get id() {
		return this.#data.id;
	}

	get locationId() {
		return this.#data.locationId;
	}

	get identifier() {
		return this.#data.identifier;
	}

	get description() {
		return this.#data.description;
	}

	get platform() {
		return platforms[this.#data.platform];
	}

	timeConstraints() {
		if (this.#data.daysOfTheWeek === null) {
			return null;
		}
		assert(this.#data.startTime, "expected this.#data.startTime to be non-null");
		assert(this.#data.endTime, "expected this.#data.endTime to be non-null");
		const days = new Set(this.#data.daysOfTheWeek);
		return {
			monday: days.has("1"),
			tuesday: days.has("2"),
			wednesday: days.has("3"),
			thursday: days.has("4"),
			friday: days.has("5"),
			saturday: this.#data.restrictedWeekendUse || days.has("6"),
			sunday: this.#data.restrictedWeekendUse || days.has("7"),
			holidays: this.#data.useHolidays,
			start: this.#data.startTime,
			end: this.#data.endTime,
		};
	}

	async update() {
		this.#data = await this.#api.getProfile(this.#data.id);
	}
}
