import ky, { AfterResponseHook } from "../deps/ky.ts";
import type * as models from "../models/mod.ts";
import type { RouteData } from "../schemas/mod.bundle.js";
import * as base64 from "../deps/std_encoding_base64.ts";
import * as schemas from "../schemas/mod.bundle.js";
import { PermissionError } from "./PermissionError.ts";
import { APIError } from "./APIError.ts";
import { AuthError } from "./AuthError.ts";
import { assert } from "../deps/std_testing_asserts.ts";

/**
 * Convert an object to search params, skipping undefined and null entries.
 * If there are no entries remaining after filtering, `undefined` is returned.
 * Booleans are cast to their numeric representation.
 */
function toSearchParams(
	data: Record<string, unknown>,
): URLSearchParams | undefined {
	const entries = Object.entries(data)
		.filter(([_, val]) => val != null)
		.map(([key, val]) => [key, typeof val === "boolean" ? Number(val) : val] as const)
		.map(([key, val]) => [key, String(val)]);

	if (entries.length > 0) {
		return new URLSearchParams(entries);
	}
}

export function isValidUDID(udid: string): boolean {
	// It's not strictly correct, but it's close enough.
	// Apple seems to have a few different formats, but each only
	// consists of hexadecimal characters (and sometimes dashes).
	return /^[0-9a-f\-]+$/i.test(udid);
}

/** Checks if a string is a valid UDID, and throws if it isn't. */
function assertValidUDID(udid: string): void {
	assert(isValidUDID(udid), `Invalid UDID: ${udid}`);
}

export function isValidID(id: number): boolean {
	// isFinite also checks if it's NaN
	return Number.isFinite(id) && Number.isSafeInteger(id) && id >= 0;
}

/** Checks if a number is a valid ID, and throws if it isn't. */
function assertValidID(id: number): void {
	assert(isValidID(id), `Invalid ID: must be a positive integer.`);
}

// /** Error value used to signal that a method isn't implemented. */
// const NOT_IMPLEMENTED = new Error("Not yet implemeted.");

/** Throw a PermissionError if a response was 405 */
const handlePermissionError: AfterResponseHook = (request, _options, response) => {
	if (response.status === 405) {
		const method = request.method;
		const endpoint = new URL(request.url).pathname;
		throw new PermissionError({ method, endpoint });
	}
};

const handleAuthError: AfterResponseHook = (_request, _options, response) => {
	if (response.status === 401) {
		throw new AuthError();
	}
};

const handleNotOk: AfterResponseHook = async (request, _options, response) => {
	if (!response.ok) {
		throw await APIError.of({ request, response });
	}
};

type APIConstructorInit = {
	id: string;
	token: string;
	url: string;
};

export class API implements models.API {
	readonly http: typeof ky;

	constructor({ id, token, url }: APIConstructorInit) {
		const auth = base64.encode(`${id}:${token}`);

		this.http = ky.create({
			headers: {
				"Authorization": `Basic ${auth}`,
				"X-Server-Protocol-Version": "3",
				// Note that Content-Type and Accept aren't explicitly set - ky sets
				// these automatically based on the request method and whether .json()
				// was called on the promise.
			},
			prefixUrl: url,
			// This API returns different status codes depending on the operation,
			// which makes errors harder. 404 can mean the request was good but
			// the [thing] you were looking for wasn't found, OR it can mean that the
			// endpoint doesn't exist, OR it can mean the endpoint *does* exist but
			// you don't have the right X-Server-Whatever to use it. And you BET each
			// of those errors returns a slightly different JSON response, if it's
			// even JSON at all (sometimes it's just plain text). That's why the
			// error handling is ham-fisted and done in hooks.
			throwHttpErrors: false,
			retry: 0,
			hooks: {
				afterResponse: [
					handlePermissionError,
					handleAuthError,
					handleNotOk,
				],
			},
		});
	}

	get type() {
		return "API" as const;
	}

	async getUser(id: number): Promise<RouteData<"GET /users/:id">["user"]> {
		assertValidID(id);
		const data = await this.http.get(`users/${id}`).json();
		schemas.assertValid("GET /users/:id", data);
		return data.user;
	}

	async getUsers(): Promise<RouteData<"GET /users">["users"]> {
		const data = await this.http.get(`users`).json();
		schemas.assertValid("GET /users", data);
		return data.users;
	}

	async getUserGroup(
		id: number,
	): Promise<RouteData<"GET /users/groups/:id">["group"]> {
		assertValidID(id);
		const data = await this.http.get(`users/groups/${id}`).json();
		schemas.assertValid("GET /users/groups/:id", data);
		return data.group;
	}

	async getUserGroups(): Promise<RouteData<"GET /users/groups">["groups"]> {
		const data = await this.http.get(`users/groups`).json();
		schemas.assertValid("GET /users/groups", data);
		return data.groups;
	}

	async getDevice(
		udid: string,
		options: models.APIGetDeviceOptions = {},
	): Promise<RouteData<"GET /devices/:udid">["device"]> {
		assertValidUDID(udid);
		const data = await this.http.get(`devices/${udid}`, {
			searchParams: toSearchParams({
				// Unlike other booleans, this has to be the string "true" or "false".
				includeApps: options.includeApps ? "true" : undefined,
			}),
		}).json();
		schemas.assertValid("GET /devices/:udid", data);
		return data.device;
	}

	async getDevices(
		options: models.APIGetDevicesOptions = {},
	): Promise<RouteData<"GET /devices">["devices"]> {
		const data = await this.http.get(`devices`, {
			searchParams: toSearchParams({
				groups: options.groupIds?.join(","),
				ownergroups: options.ownerGroupIds?.join(","),
				hasOwner: options.isOwned,
				owner: options.ownerId,
				name: options.ownerName,
				// As far as I can tell this SHOULD NOT be trusted! On my Jamf School
				// instance, using '1' returns a few devices (all of which are managed)
				// and using ANY OTHER VALUE returns all the other devices. Wtf???
				managed: options.isManaged,
				model: options.modelIdentifier,
				location: options.locationId,
				supervised: options.isSupervised,
				// Trashed devices won't be included if this is omitted, so false
				// and undefined both result in the same behaviour.
				inTrash: options.isTrashed,
				// Docs misspell this as 'asserttag' lol
				assettag: options.assetTag,
				serialnumber: options.serialNumber,
				enrollType: options.enrollmentType,
				// API docs say this is a boolean, but so long as the key is present
				// it's treated the same as true.
				includeApps: options.includeApps || undefined,
			}),
		}).json();
		schemas.assertValid("GET /devices", data);
		return data.devices;
	}

	async getDeviceGroup(
		id: number,
	): Promise<RouteData<"GET /devices/groups/:id">["deviceGroup"]> {
		assertValidID(id);
		const data = await this.http.get(`devices/groups/${id}`).json();
		schemas.assertValid("GET /devices/groups/:id", data);
		return data.deviceGroup;
	}

	async getDeviceGroups(): Promise<
		RouteData<"GET /devices/groups">["deviceGroups"]
	> {
		const data = await this.http.get(`devices/groups`).json();
		schemas.assertValid("GET /devices/groups", data);
		return data.deviceGroups;
	}

	async restartDevice(
		udid: string,
		options?: models.APIRestartDeviceOptions,
	): Promise<RouteData<"POST /devices/:udid/restart">> {
		assertValidUDID(udid);
		const data = await this.http.post(`devices/${udid}/restart`, {
			json: options,
		}).json();
		schemas.assertValid("POST /devices/:udid/restart", data);
		return data;
	}

	// async updateDeviceDetails(
	// 	udid: string,
	// 	options: models.APIUpdateDeviceDetailsOptions,
	// ): Promise<RouteData<"POST /devices/:udid/details">> {
	// 	assertValidUDID(udid);
	// 	const data = await this.http.post(`devices/${udid}/update`, {
	// 		json: options,
	// 	}).json();
	// 	schemas.mustParse("POST /devices/:udid/details", data);
	// 	return data;
	// }

	// async refreshDeviceInventory(
	// 	udid: string,
	// 	options?: models.APIRefreshDeviceInventoryOptions,
	// ): Promise<RouteData<"POST /devices/:udid/refresh">> {
	// 	assertValidUDID(udid);
	// 	const data = await this.http.post(`devices/${udid}/refresh`, {
	// 		json: options,
	// 	}).json();
	// 	schemas.mustParse("POST /devices/:udid/refresh", data);
	// 	return data;
	// }

	async wipeDevice(
		udid: string,
		options: models.APIWipeDeviceOptions,
	): Promise<RouteData<"POST /devices/:udid/wipe">> {
		assertValidUDID(udid);
		const data = await this.http.post(`devices/${udid}/wipe`, {
			json: options,
		}).json();
		schemas.assertValid("POST /devices/:udid/wipe", data);
		return data;
	}

	// async restoreDevice(
	// 	udid: string,
	// ): Promise<RouteData<"POST /devices/:udid/restore">> {
	// 	assertValidUDID(udid);
	// 	const data = await this.http.post(`devices/${udid}/restore`).json();
	// 	schemas.mustParse("POST /devices/:udid/restore", data);
	// 	return data;
	// }

	// async unenrollDevice(
	// 	udid: string,
	// ): Promise<RouteData<"POST /devices/:udid/unenroll">> {
	// 	assertValidUDID(udid);
	// 	const data = await this.http.post(`devices/${udid}/unenroll`).json();
	// 	schemas.mustParse("POST /devices/:udid/unenroll", data);
	// 	return data;
	// }

	// async trashDevice(
	// 	udid: string,
	// ): Promise<RouteData<"DELETE /devices/:udid">> {
	// 	assertValidUDID(udid);
	// 	const data = await this.http.delete(`devices/${udid}`).json();
	// 	schemas.mustParse("DELETE /devices/:udid", data);
	// 	return data;
	// }

	async assignDeviceOwner(
		udid: string,
		userId: number,
	): Promise<RouteData<"PUT /devices/:udid/owner">> {
		assertValidUDID(udid);
		assertValidID(userId);
		const data = await this.http.put(`devices/${udid}/owner`, {
			json: { user: userId },
		}).json();
		schemas.assertValid("PUT /devices/:udid/owner", data);
		return data;
	}

	// async moveDevice(
	// 	udid: string,
	// 	init: models.APIMoveDeviceInit,
	// ): Promise<RouteData<"PUT /devices/:udid/migrate">> {
	// 	assertValidUDID(udid);
	// 	assertValidID(init.locationId);
	// 	throw NOT_IMPLEMENTED;
	// }

	// async moveDevices(
	// 	init: models.APIMoveDevicesInit,
	// ): Promise<RouteData<"PUT /devices/migrate">> {
	// 	assertValidID(init.locationId);
	// 	init.udids.forEach((udid) => assertValidUDID(udid));
	// 	throw NOT_IMPLEMENTED;
	// }

	// async clearDeviceActivationLock(
	// 	udid: string,
	// ): Promise<RouteData<"POST /devices/:udid/activationlock/clear">> {
	// 	assertValidUDID(udid);
	// 	throw NOT_IMPLEMENTED;
	// }

	// async updateDeviceCellularPlan(
	// 	udid: string,
	// 	init: models.APIUpdateDeviceCellularPlanInit,
	// ): Promise<RouteData<"POST /devices/:udid/cellularPlan">> {
	// 	assertValidUDID(udid);
	// 	throw NOT_IMPLEMENTED;
	// }

	// async bulkUserUpdate(
	// 	users: models.APIUserDataBulkUpdate[],
	// ): Promise<RouteData<"POST /users/bulk">> {
	// 	throw NOT_IMPLEMENTED;
	// }

	// async createUser(
	// 	data: models.APIUserData,
	// ): Promise<RouteData<"POST /users">> {
	// 	throw NOT_IMPLEMENTED;
	// }

	// async updateUser(
	// 	id: number,
	// 	data: Partial<models.APIUserData>,
	// ): Promise<RouteData<"PUT /users/:id">> {
	// 	assertValidID(id);
	// 	throw NOT_IMPLEMENTED;
	// }

	// async trashUser(
	// 	id: number,
	// ): Promise<RouteData<"DELETE /users/:id">> {
	// 	assertValidID(id);
	// 	throw NOT_IMPLEMENTED;
	// }

	// async setUserPassword(
	// 	id: number,
	// 	password: string,
	// ): Promise<RouteData<"PUT /users/:id/password">> {
	// 	assertValidID(id);
	// 	throw NOT_IMPLEMENTED;
	// }

	// 	async moveUser(
	// 		id: number,
	// 		init: models.APIMoveUserInit,
	// 	): Promise<RouteData<"PUT /users/:id/migrate">> {
	// 		assertValidID(id);
	// 		assertValidID(init.locationId);
	// 		throw NOT_IMPLEMENTED;
	// 	}

	async getApps(): Promise<RouteData<"GET /apps">["apps"]> {
		const data = await this.http.get(`apps`).json();
		schemas.assertValid("GET /apps", data);
		return data.apps;
	}

	async getApp(id: number): Promise<RouteData<"GET /apps/:id">> {
		assertValidID(id);
		const data = await this.http.get(`apps/${id}`).json();
		schemas.assertValid("GET /apps/:id", data);
		return data;
	}
}
