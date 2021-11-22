import type { API } from "./models/API.ts";
import type { Credentials } from "./models/Credentials.ts";

import { API as InternalAPI } from "./internal/API.ts";

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
