// MIT License
//
// Copyright (c) 2021 SeparateRecords
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/**
 * Jamf School for Deno is an idiomatic, unofficial wrapper for the Jamf School
 * API.
 *
 * All data you get back from the API is validated against a custom, public
 * JSON schema to ensure you don't get any unexpected results without knowing.
 *
 * The `Client` and related objects are an optional layer of sugar over an
 * `API` object that abstract away the actual routes and
 *
 * It's modelled after web APIs, so it feels right at home in JavaScript and
 * TypeScript.
 *
 * Getting started is super quick. Once you've got your network ID and API
 * token, create a new JS or TS file and write the following.
 *
 * ```
 * import * as jamf from "https://deno.land/x/jamf_school@0.1.0/mod.ts";
 *
 * const client = jamf.createClient({
 *   id: "YOUR_NETWORK_ID",
 *   token: "YOUR_API_TOKEN",
 *   url: "https://YOUR_SCHOOL.jamfcloud.com/api"
 * })
 * ```
 *
 * You can now start calling methods on the `client` object. If your credential
 * were incorrect, awaiting a method will throw an exception.
 *
 * @module
 */

import type { API, Client } from "./models/mod.ts";
import { API as ImplAPI } from "./internal/API.ts";
import { Client as ImplClient } from "./internal/Client.ts";

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
export function createAPI(credentials: Credentials): API {
	return new ImplAPI(credentials);
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
	init: Credentials | { api: API },
): Client {
	return new ImplClient({
		api: "api" in init ? init.api : createAPI(init),
	});
}

export type {
	API,
	APIGetDeviceOptions,
	APIGetDevicesOptions,
	APIRestartDeviceOptions,
	APIWipeDeviceOptions,
	Client,
	Device,
	DeviceGroup,
	User,
	UserGroup,
} from "./models/mod.ts";

// Deno's standard library does the same thing. Good for consistency.
export { version } from "./version.ts";
