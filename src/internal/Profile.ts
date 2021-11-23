import type * as models from "../models/mod.ts";
import type { BasicObjectInit /*, Creator*/ } from "./Client.ts";
import { assert } from "../deps/std_testing_asserts.ts";

const platforms = {
	iOS: Object.freeze({ iOS: true, macOS: false, tvOS: false } as const),
	macOS: Object.freeze({ iOS: false, macOS: true, tvOS: false } as const),
	tvOS: Object.freeze({ iOS: false, macOS: false, tvOS: true } as const),
	universal: Object.freeze({ iOS: true, macOS: true, tvOS: true } as const),
} as const;

export type ProfileData = models.APIData["getProfile"];

export class Profile implements models.Profile {
	#api: models.API;
	// #client: Creator;
	#data: ProfileData;

	constructor(init: BasicObjectInit<ProfileData>) {
		this.#api = init.api;
		// this.#client = init.client;
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
			id: this.id,
			locationId: this.locationId,
			name: this.name,
			description: this.description,
			identifier: this.identifier,
			isUniversal: this.isUniversal,
			platform: this.platform,
			isScheduled: this.isScheduled,
		}, { colors: !Deno.noColor });
		return `${this.type} ${props}`;
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

	get isUniversal() {
		return this.#data.platform === "universal";
	}

	get isScheduled() {
		// There's actually no value to indicate that the profile doesn't have a time
		// filter, but if it does have one, daysOfTheWeek must be an array with at
		// least one value. If it isn't an array or doesn't have any values, then
		// it definitely doesn't have a time filter.
		return this.#data.daysOfTheWeek.length !== 0;
	}

	getSchedule() {
		// See isScheduled above (this is inverted, return null if *not* scheduled)
		if (this.#data.daysOfTheWeek.length === 0) {
			return null;
		}

		// The startTime/endTime properties should both be strings if daysOfTheWeek
		// is an array with at least one element, but that can't be enforced by
		// the schema. The strings will be tested against this RegExp - if they're
		// null or in the wrong format, the assertions will fail.
		const hhmm = /^(\d?\d):(\d\d)$/;

		const installTimeMatch = this.#data.startTime?.match(hhmm);
		assert(installTimeMatch, `startTime was not HH:MM: ${this.#data.startTime}`);

		const removeTimeMatch = this.#data.endTime?.match(hhmm);
		assert(removeTimeMatch, `endTime was not HH:MM: ${this.#data.endTime}`);

		const days = new Set(this.#data.daysOfTheWeek);

		return {
			monday: days.has("1"),
			tuesday: days.has("2"),
			wednesday: days.has("3"),
			thursday: days.has("4"),
			friday: days.has("5"),
			saturday: this.#data.restrictedWeekendUse || days.has("6"),
			sunday: this.#data.restrictedWeekendUse || days.has("7"),
			// I think useHolidays is named incorrectly, it's always inverted...?
			holidays: !this.#data.useHolidays,
			installTime: {
				hour: parseInt(installTimeMatch[1]),
				minute: parseInt(installTimeMatch[2]),
			},
			removeTime: {
				hour: parseInt(removeTimeMatch[1]),
				minute: parseInt(removeTimeMatch[2]),
			},
		};
	}

	async update() {
		this.#data = await this.#api.getProfile(this.#data.id);
	}
}
