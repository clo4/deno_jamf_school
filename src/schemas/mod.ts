import type { ErrorObject, ValidateFunction as Validator } from "./_ajv_jtd.ts";

// GET
import parseGetDevices from "./GET_devices.ts";
import parseGetDevicesGroups from "./GET_devices_groups.ts";
import parseGetDevicesGroupsId from "./GET_devices_groups_id.ts";
import parseGetDevicesUdid from "./GET_devices_udid.ts";
import parseGetUsers from "./GET_users.ts";
import parseGetUsersGroups from "./GET_users_groups.ts";
import parseGetUsersGroupsId from "./GET_users_groups_id.ts";
import parseGetUsersId from "./GET_users_id.ts";

// POST
import parsePostDevicesUdidRestart from "./POST_devices_udid_restart.ts";
import parsePostDevicesUdidWipe from "./POST_devices_udid_wipe.ts";

// The naming scheme here consistently maps between the file name and the
// route identifier. spaces and colons are removed, slashes are replaced with
// underscores, capitalization is kept the same, ".ts" is appended.
// The name used for the import is completely arbitrary for bundling, but
// do try to follow the same conventions.

// dprint-ignore
export const validators = {
	"GET /devices": parseGetDevices,
	"GET /devices/:udid": parseGetDevicesUdid,
	"GET /devices/groups": parseGetDevicesGroups,
	"GET /devices/groups/:id": parseGetDevicesGroupsId,
	"GET /users": parseGetUsers,
	"GET /users/:id": parseGetUsersId,
	"GET /users/groups": parseGetUsersGroups,
	"GET /users/groups/:id": parseGetUsersGroupsId,
	"POST /devices/:udid/restart": parsePostDevicesUdidRestart,
	"POST /devices/:udid/wipe": parsePostDevicesUdidWipe,
} as const;

type Validators = typeof validators;
type Endpoint = keyof Validators;
// dprint-ignore
export type RouteData<E extends Endpoint> =
	Validators[E] extends Validator<infer T>
		? T
		: never;

export function validate<E extends Endpoint>(
	key: E,
	data: unknown,
): data is RouteData<E> {
	return validators[key](data);
}

export function assertValid<E extends Endpoint>(
	key: E,
	data: unknown,
): asserts data is RouteData<E> {
	const validator = validators[key];
	if (validator(data)) {
		return;
	}
	const errors = validator.errors!;
	throw new ValidationError(errors);
}

function createMessage(error: ErrorObject): string {
	const msg = error.message ?? "[no message]";
	const schemaPath = error.schemaPath;
	const path = error.instancePath;
	return `Failed at '${path}': ${msg}`
}

export class ValidationError extends Error {
	errors: ErrorObject[];
	constructor(errors: ErrorObject[]) {
		if (errors.length === 0) {
			throw new Error("ValidationError constructor called with no error objects");
		}

		const moreErrors = errors.length > 1
			? ` (and ${errors.length - 1} more errors)`
			: "";
		super(createMessage(errors[0]) + moreErrors);
		this.name = this.constructor.name;
		Error.captureStackTrace?.(this, this.constructor);
		this.errors = errors;
	}
}
