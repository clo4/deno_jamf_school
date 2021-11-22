import type { API, Client } from "./models/mod.ts";

import { Client as InternalClient } from "./internal/Client.ts";

export function createClientWith(api: API): Client {
	return new InternalClient({ api });
}

export * from "./api.ts";
export * from "./mod.ts";
