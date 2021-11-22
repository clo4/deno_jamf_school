import type { API, Client } from "./models/mod.ts";

import { Client as InternalClient } from "./internal/Client.ts";

export function createClientWith(api: API): Client {
	return new InternalClient({ api });
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

export { createAPI } from "./api.ts";
export { createClient } from "./mod.ts";
