import type { JTDParser } from "./_ajv_jtd.ts";

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
export const parsers = {
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

type Parsers = typeof parsers;
type Endpoint = keyof Parsers;
// dprint-ignore
export type RouteData<E extends Endpoint> =
	Parsers[E] extends JTDParser<infer T>
		? T
		: never;

export function mustParse<P extends Endpoint>(
	route: P,
	text: string,
): RouteData<P> {
	const parser = parsers[route];
	const parsed = parser(text);
	if (parsed === undefined) {
		throw new ParseError({
			text,
			route,
			message: parser.message!,
			position: parser.position!,
		});
	}
	return parsed as RouteData<P>;
}

type ParseErrorConstructorInit = {
	message: string;
	position: number;
	text: string;
	route: string;
};

/**
 * An error with a very readable message that tells you exactly where
 * parsing failed. It's slow to construct, because it has to do a lot of
 * work to create a useful message.
 */
class ParseError extends Error {
	route: string;
	error: string;
	position: number;
	text: string;

	// This error does as much as is reasonable to give you context of for the
	// parsing error on the same line.
	constructor(init: ParseErrorConstructorInit) {
		const {
			text,
			route,
			position: idx,
			message: error,
		} = init;

		let lineCountBeforeError = 1;
		for (let i = 0; i < idx; i++) {
			if (text[i] === "\n") {
				lineCountBeforeError++;
			}
		}

		// 35 characters leading up to, but not including, the error.
		const charsBeforeError = text.slice(idx - 35, idx);

		// The immediate context. At most 35 characters. If there are any line
		// breaks, it's the last line with no leading whitespace.
		const leadingChars = charsBeforeError
			.slice(charsBeforeError.lastIndexOf("\n") + 1) // Start *after* \n
			.trimStart(); // TODO: this failed here in the REPL but works in testing?

		// Literally point at the location of the error.
		const errorLocationPointer = `${" ".repeat(leadingChars.length)}^--- ${error}`;

		// The following 10 characters after (and including) the error, also ending
		// at the first line break.
		const trailingChars = text.slice(idx, idx + 10);
		const nextNewline = trailingChars.indexOf("\n");
		const stopIndex = nextNewline !== -1 ? nextNewline : undefined;
		const trailingContext = trailingChars.slice(0, stopIndex);

		const parserFile = route
			.replaceAll(" ", "")
			.replaceAll(":", "")
			.replaceAll("/", "_") + ".ts";

		const errorPosition = lineCountBeforeError > 1
			? `${idx} (line ${lineCountBeforeError})`
			: `${idx}`;

		// dprint-ignore
		let message = `
Failed at index ${errorPosition}

Parser: ${parserFile}

    ${leadingChars}${trailingContext}
    ${errorLocationPointer}

This is likely due to unexpected data being returned from the API.
Please raise an issue on GitHub with the link below so this can be fixed,
and include as much of this error as you can (without violating privacy).
https://github.com/SeparateRecords/deno_jamf_school/issues/new
`;

		message = message
			.trimStart()
			.replaceAll("\r", ""); // in case a carriage return snuck in

		super(message);

		this.name = this.constructor.name;
		Error.captureStackTrace?.(this, this.constructor);

		this.position = idx;
		this.error = error;
		this.text = text;
		this.route = route;
	}
}
