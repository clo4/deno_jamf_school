import type { Client, Credentials } from "./models/mod.ts";

import { Client as InternalClient } from "./internal/Client.ts";
import { createAPI } from "./api.ts";

export function createClient(credentials: Credentials): Client {
	const api = createAPI(credentials);
	return new InternalClient({ api });
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
