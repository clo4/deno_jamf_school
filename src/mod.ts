import type { Client, Credentials } from "./models/mod.ts";

import { Client as InternalClient } from "./internal/Client.ts";
import * as api from "./api.ts";

/**
 * Create an API client.
 *
 * Clients are an object-oriented wrapper over the Jamf School API.
 *
 * ```
 * const client = jamf.createClient({
 *   id: "your_network_id",
 *   token: "your_api_token",
 *   url: "https://your_school.jamfcloud.com",
 * });
 * ```
 */
export function createClient(init: Credentials | { api: api.API }): Client {
	return new InternalClient({
		api: "api" in init //
			? init.api
			: api.createAPI(init),
	});
}

export type {
	App,
	Client,
	Credentials,
	Device,
	DeviceGroup,
	Location,
	User,
	UserGroup,
} from "./models/mod.ts";

export { version } from "./version.ts";
