import type { ErrorObject, ValidateFunction as Validator } from "./_ajv_jtd.ts";

// GET
import validateGetApps from "./GET_apps.ts";
import validateGetDevices from "./GET_devices.ts";
import validateGetDevicesGroups from "./GET_devices_groups.ts";
import validateGetDevicesGroupsId from "./GET_devices_groups_id.ts";
import validateGetDevicesUdid from "./GET_devices_udid.ts";
import validateGetUsers from "./GET_users.ts";
import validateGetUsersGroups from "./GET_users_groups.ts";
import validateGetUsersGroupsId from "./GET_users_groups_id.ts";
import validateGetUsersId from "./GET_users_id.ts";

// POST
import validatePostDevicesUdidRestart from "./POST_devices_udid_restart.ts";
import validatePostDevicesUdidWipe from "./POST_devices_udid_wipe.ts";

// PUT
import validatePutDevicesUdidOwner from "./PUT_devices_udid_owner.ts";

// The naming scheme here consistently maps between the file name and the
// route identifier. spaces and colons are removed, slashes are replaced with
// underscores, capitalization is kept the same, ".ts" is appended.
// The name used for the import is completely arbitrary for bundling, but
// do try to follow the same conventions.

// dprint-ignore
export const validators = {
	"GET /apps": validateGetApps,
	"GET /devices": validateGetDevices,
	"GET /devices/:udid": validateGetDevicesUdid,
	"GET /devices/groups": validateGetDevicesGroups,
	"GET /devices/groups/:id": validateGetDevicesGroupsId,
	"GET /users": validateGetUsers,
	"GET /users/:id": validateGetUsersId,
	"GET /users/groups": validateGetUsersGroups,
	"GET /users/groups/:id": validateGetUsersGroupsId,
	"POST /devices/:udid/restart": validatePostDevicesUdidRestart,
	"POST /devices/:udid/wipe": validatePostDevicesUdidWipe,
	"PUT /devices/:udid/owner": validatePutDevicesUdidOwner,
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

	return `${errors.length} validation failure(s)

This is probably due to the Jamf School API returning unexpected data.
Please open an issue by visiting the link below, and include as much of
the following message and stack trace as you can, so we can resolve it.
https://github.com/SeparateRecords/deno_jamf_school/issues/new

Schema: ${schemaFile}

${msgs.join("\n")}
`;
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
