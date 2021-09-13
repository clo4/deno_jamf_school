import type * as models from "../models/mod.ts";
import { API } from "./API.ts";
import { Client } from "./Client.ts";

export type Credentials = {
	/**
	 * Your Jamf School network ID.
	 *
	 * This can be located in the Jamf School web interface:
	 *
	 * Devices > Enroll device(s) > On-device enrollment (iOS & macOS)
	 */
	id: string;

	/**
	 * Your API token.
	 *
	 * This must be created through the Jamf School web interface:
	 *
	 * Organisation > Settings > API > Add API Key
	 *
	 * All methods state their required permissions.
	 */
	token: string;

	/**
	 * Your API endpoint.
	 *
	 * This generally follows this format:
	 *
	 * https://your_school_instance.jamfcloud.com/api
	 */
	url: string;
};

/**
 * A low-level, type-safe wrapper over the Jamf School API that validates all
 * data it receives.
 *
 * The only state it has is your network ID and API token, which are immutable
 * once set.
 *
 * To find your network ID:
 *
 *   Devices > Enroll device(s) > On-device enrollment (iOS & macOS)
 *
 * To create an API token:
 *
 *   Organisation > Settings > API > Add API Key
 *
 */
export function createAPI(credentials: Credentials): models.API {
	return new API(credentials);
}

/**
 * Create an API client. Clients are a high level bridge to the API that can
 * query for data and return its representation as an object. Clients don't
 * perform actions on any data as all actions are methods on the returned
 * objects.
 *
 * `API` and `Client` can interoperate. The 'create*' methods on the client
 * take data returned from an `API` and upgrade it to an object with methods.
 */
export function createClient(
	init: Credentials | { api: models.API },
): models.Client {
	return new Client({
		api: "api" in init ? init.api : createAPI(init),
	});
}
