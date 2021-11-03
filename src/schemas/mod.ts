import type { ErrorObject, ValidateFunction as Validator } from "./_ajv_jtd.ts";

/**
 * The schemas module provides data validation for every supported Jamf School
 * API route.
 *
 * AJV is used to generate the validators from JTD schemas, located in
 * descriptively named files. The validators are compiled ahead of time and
 * bundled into a single file to reduce the startup time. Tests ensure that
 * the bundle behaves identically to the unbundled module.
 *
 * ```
 * // Use the bundle instead of mod.ts entrypoint for faster startup.
 * import * as routes from "https://deno.land/x/jamf_school/schemas/mod.bundle.js"
 *
 * const data = { "message": "DeviceWipeScheduled", "device": "[redacted]" };
 *
 * // Throws if the data is not a valid response for the route.
 * routes.assertValid("POST /devices/:udid/wipe", data);
 * ```
 *
 * @module
 */

// GET
import validateGetApps from "./GET_apps.ts";
import validateGetAppsId from "./GET_apps_id.ts";
import validateGetDevices from "./GET_devices.ts";
import validateGetDevicesGroups from "./GET_devices_groups.ts";
import validateGetDevicesGroupsId from "./GET_devices_groups_id.ts";
import validateGetDevicesUdid from "./GET_devices_udid.ts";
import validateGetLocations from "./GET_locations.ts";
import validateGetLocationsId from "./GET_locations_id.ts";
import validateGetUsers from "./GET_users.ts";
import validateGetUsersGroups from "./GET_users_groups.ts";
import validateGetUsersGroupsId from "./GET_users_groups_id.ts";
import validateGetUsersId from "./GET_users_id.ts";

// POST
import validatePostDevicesUdidRestart from "./POST_devices_udid_restart.ts";
import validatePostDevicesUdidWipe from "./POST_devices_udid_wipe.ts";

// PUT
import validatePutDevicesUdidOwner from "./PUT_devices_udid_owner.ts";
import validatePutDevicesGroupsId from "./PUT_devices_groups_id.ts";
import validatePutUsersId from "./PUT_users_id.ts";

// The naming scheme here consistently maps between the file name and the
// route identifier. spaces and colons are removed, slashes are replaced with
// underscores, capitalization is kept the same, ".ts" is appended.
// The name used for the import is completely arbitrary for bundling, but
// do try to follow the same conventions.

/** A map of route to validator. */
// deno-fmt-ignore
export const validators = {
	"GET /apps": validateGetApps,
	"GET /apps/:id": validateGetAppsId,
	"GET /devices": validateGetDevices,
	"GET /devices/:udid": validateGetDevicesUdid,
	"GET /devices/groups": validateGetDevicesGroups,
	"GET /devices/groups/:id": validateGetDevicesGroupsId,
	"GET /locations": validateGetLocations,
	"GET /locations/:id": validateGetLocationsId,
	"GET /users": validateGetUsers,
	"GET /users/:id": validateGetUsersId,
	"GET /users/groups": validateGetUsersGroups,
	"GET /users/groups/:id": validateGetUsersGroupsId,
	"POST /devices/:udid/restart": validatePostDevicesUdidRestart,
	"POST /devices/:udid/wipe": validatePostDevicesUdidWipe,
	"PUT /devices/:udid/owner": validatePutDevicesUdidOwner,
	"PUT /devices/groups/:id": validatePutDevicesGroupsId,
	"PUT /users/:id": validatePutUsersId,
} as const;

type Validators = typeof validators;
type Endpoint = keyof Validators;

/** Given a route, get the type of the data it returns. */
// deno-fmt-ignore
export type RouteData<E extends Endpoint> =
	Validators[E] extends Validator<infer T>
		? T
		: never;

/** Validate the data using the validator for the given route */
export function validate<E extends Endpoint>(
	key: E,
	data: unknown,
): data is RouteData<E> {
	return validators[key](data);
}

/** Assert that the data is valid using the validator for the given route. */
export function assertValid<E extends Endpoint>(
	route: E,
	data: unknown,
): asserts data is RouteData<E> {
	const validator = validators[route];
	if (validator(data)) {
		return;
	}
	const errors = validator.errors!;
	throw new ValidationError(errors, route);
}

function createMessage({ errors, route }: {
	errors: ErrorObject[];
	route: string;
}): string {
	const schemaFile = route
		.replaceAll(" ", "")
		.replaceAll(":", "")
		.replaceAll("/", "_") + ".ts";

	const msgs = [];
	for (const error of errors) {
		const { keyword, instancePath, message } = error;
		const msg = message ?? "[no message]";
		msgs.push(`${keyword} at '${instancePath}': ${msg}`);
	}

	const lines = [
		`${errors.length} validation failure(s)`,
		"",
		"This is probably due to the Jamf School API returning unexpected data.",
		"Please open an issue by visiting the link below, and include as much of",
		"the following message and stack trace as you can, so we can resolve it.",
		"https://github.com/SeparateRecords/deno_jamf_school/issues/new",
		"",
		`Schema: ${schemaFile}`,
		"",
		...msgs,
		"",
	];

	return lines.join("\n");
}

export class ValidationError extends Error {
	errors: ErrorObject[];
	constructor(errors: ErrorObject[], route: string) {
		if (errors.length === 0) {
			throw new Error("ValidationError constructor called with no error objects");
		}

		super(createMessage({ errors, route }));

		this.name = this.constructor.name;
		this.errors = errors;
		Error.captureStackTrace?.(this, this.constructor);
	}
}
