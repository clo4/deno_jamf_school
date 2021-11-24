import type { API } from "./models/API.ts";
import type { Credentials } from "./models/Credentials.ts";

import { API as InternalAPI } from "./internal/API.ts";

/**
 * Create an API HTTP wrapper.
 *
 * This object allows you to directly make requests to the Jamf School API.
 * Each method validates the returned data against a custom-built schema to
 * ensure that the correct data is returned.
 *
 * ```
 * const api = jamfAPI.createAPI({
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
} from "./models/API.ts";

export type { Credentials } from "./models/Credentials.ts";

export { version } from "./version.ts";
