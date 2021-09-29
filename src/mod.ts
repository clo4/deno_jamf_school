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
 * `API` object that abstract away the complexity and provide convenience
 * methods.
 *
 * It's modelled after web APIs, so it feels right at home in JavaScript and
 * TypeScript.
 *
 * Getting started is super quick. Once you've got your network ID and API
 * token, create a new JS or TS file and write the following.
 *
 * ```
 * import * as jamf from "https://deno.land/x/jamf_school/mod.ts";
 *
 * const client = jamf.createClient({
 *   id: "YOUR_NETWORK_ID",
 *   token: "YOUR_API_TOKEN",
 *   url: "https://YOUR_SCHOOL.jamfcloud.com/api"
 * })
 * ```
 *
 * You can now start calling methods on the `client` object. If the credentials
 * were incorrect, awaiting a method will throw an error to let you know.
 *
 * The library handles failure differently depending on the action being
 * performed. If the method retrieves objects, it returns null (or an empty
 * array) if there is a network failure, but throws when an unexpected
 * condition is encountered. For example, duplicate names will cause a
 * `Foo.getBarByName` method to throw, instead of returning null or a single
 * the value. If the method performs an action, such as `Device.restart`, it
 * will always throw on failure.
 *
 * @module
 */

// Can't be namespaced because doc.deno.land will always link to another page
import type { API, Client } from "./models/mod.ts";

// Never show up in docs, these can be namespaced
import * as api from "./internal/API.ts";
import * as client from "./internal/Client.ts";

export interface Credentials {
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
}

/**
 * Create an API object, a low level wrapper over the API that validates the
 * data returned and gives it back to you directly. The validation guarantees
 * that you get no less data than promised, but allows for additional data to
 * be returned.
 *
 * ```
 * const api = jamf.createAPI({
 *   id: "YOUR_NETWORK_ID",
 *   token: "YOUR_API_TOKEN",
 *   url: "https://YOUR_SCHOOL.jamfcloud.com/api"
 * });
 *
 * const app = await api.getApp(23);
 * console.log(app.name);
 * ```
 */
export function createAPI(init: Credentials): API {
	return new api.API(init);
}

/**
 * Create a Client. Clients make it easier to use the API by modelling
 * data as objects with methods. The methods are designed to handle common
 * tasks, such as finding a device with a specific name, or getting all users
 * that belong to a particular location.
 *
 * ```
 * const client = jamf.createClient({
 *   id: "YOUR_NETWORK_ID",
 *   token: "YOUR_API_TOKEN",
 *   url: "https://YOUR_SCHOOL.jamfcloud.com/api"
 * });
 *
 * const locations = await client.getLocations();
 * await usersByLocation = await Promise.all(
 *   locations.map((loc) => loc.getUsers())
 * );
 * ```
 *
 * A `Client` can upgrade raw data returned by an `API` instance using the
 * "create" methods. You can also reuse the same `API` by supplying it when
 * creating the client.
 *
 * ```
 * const api = jamf.createAPI({
 *   id: "YOUR_NETWORK_ID",
 *   token: "YOUR_API_TOKEN",
 *   url: "https://YOUR_SCHOOL.jamfcloud.com/api"
 * });
 *
 * // The client can be created with an API instead of credentials.
 * const client = jamf.createClient({ api });
 *
 * // The raw data. This may expose more properties than the object does.
 * const data = await api.getDevice(3);
 *
 * // Provodes convenience methods for restarting, getting the owner, etc.
 * const device = client.createDevice(data);
 *
 * // They're the same device!
 * console.assert(data.UDID === device.udid)
 * ```
 *
 * All objects can also be converted back to the JSON that would be used to
 * create them using `JSON.parse(JSON.stringify(object))`.
 */
export function createClient(init: Credentials | { api: API }): Client {
	return new client.Client({
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
	Location,
	User,
	UserGroup,
} from "./models/mod.ts";

// deno.land/std follows this pattern
export { version } from "./version.ts";
