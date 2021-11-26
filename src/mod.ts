import type { Client, Credentials } from "./models/mod.ts";

import { Client as InternalClient } from "./internal/Client.ts";

// This has to be namespaced for doc.deno.land to link to it, otherwise
// the generated link in `createClient` will go to models/mod.ts
import * as jamfAPI from "./api.ts";

/**
 * Create an API client.
 *
 * Clients are an object-oriented abstraction of the Jamf School API.
 *
 * ```
 * const client = jamf.createClient({
 *   id: "your_network_id",
 *   token: "your_api_token",
 *   url: "https://your_school.jamfcloud.com",
 * });
 *
 * const it = await client.getDeviceGroupByName("IT Devices");
 * await it?.restartDevices();
 * ```
 */
export function createClient(init: Credentials | { api: jamfAPI.API }): Client {
	let api;
	if ("api" in init) {
		api = init.api;
	} else {
		api = jamfAPI.createAPI(init);
	}

	return new InternalClient({ api });
}

export type {
	App,
	Client,
	Credentials,
	Device,
	DeviceGroup,
	Location,
	Profile,
	ProfileSchedule,
	User,
	UserGroup,
} from "./models/mod.ts";

export { version } from "./version.ts";
