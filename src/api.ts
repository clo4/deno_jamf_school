import type { API } from "./models/api.ts";
import type { Credentials } from "./models/credentials.ts";

import { API as InternalAPI } from "./internal/api.ts";

/**
 * Create an API HTTP wrapper.
 *
 * This object allows you to directly make requests to the Jamf School API.
 * Each method validates the returned data against a custom-built schema to
 * ensure that the correct data is returned.
 *
 * ```
 * const api = jamfapi.createAPI({
 *   id: "your_network_id",
 *   token: "your_api_token",
 *   url: "https://your_school.jamfcloud.com",
 * });
 *
 * await api.updateUser(33, {
 *   firstName: "Testing",
 *   lastName: "Account",
 *   email: "testing@example.com",
 *   memberOf: [0, 1, "New Group"],
 * });
 * ```
 */
export function createAPI(credentials: Credentials): API {
	return new InternalAPI(credentials);
}

export type {
	API,
	APIDeviceData,
	APIDeviceGroupData,
	APIGetDeviceOptions,
	APIGetDevicesOptions,
	APIMoveDeviceOptions,
	APIMoveDevicesOptions,
	APIMoveUserOptions,
	APIRestartDeviceOptions,
	APIUserData,
	APIUserGroupData,
	APIWipeDeviceOptions,
} from "./models/api.ts";

export type { Credentials } from "./models/credentials.ts";
