<!-- deno-fmt-ignore-file -->
<!-- DO NOT EDIT: Generated from ./README.tpl.md -->

# Jamf School API for Deno

An **unofficial, idiomatic API wrapper for Jamf School**. It's designed to feel natural for anyone with basic web development experience to pick it up, and to be safe enough to trust in production.

If something doesn't work as expected or you just want some help, please [raise an issue on GitHub][issues] so we can improve the library and documentation for everyone!

Currently, only a limited (mostly read-only) subset of API features are supported.

**[Here's the documentation for the latest release.][docs]**

[issues]: https://github.com/SeparateRecords/deno_jamf_school/issues
[docs]: https://doc.deno.land/https/deno.land/x/jamf_school@0.3.2/mod.ts

## Features

- Designed for modern JavaScript
- A low-level API wrapper and a higher-level object-oriented interface
- Data validation means you always get the data you're promised
- Comprehensive documentation and easy-to-follow example
- Only requires `--allow-net=YOUR_SCHOOL.jamfcloud.com`

## Usage

[Here's how to get your API credentials](https://doc.deno.land/https/deno.land/x/jamf_school@0.3.2/mod.ts#Credentials). You'll have to replace the token, ID, and URL in the examples.

This example will print the name of each registered device.

<h6>device_names.ts</h6>

<!-- Using JS as the language for the more reliable syntax highlighting -->

```javascript
import * as jamf from "https://deno.land/x/jamf_school@0.3.2/mod.ts";

const client = jamf.createClient({
  id: "YOUR_NETWORK_ID",
  token: "YOUR_API_TOKEN",
  url: "https://YOUR_SCHOOL.jamfcloud.com/api",
});

// See the docs for everything clients can do.
const devices = await client.getDevices();

for (const device of devices) {
  console.log(device.udid, device.name);
}
```

Now run that script.

```bash
deno run --allow-net=YOUR_SCHOOL.jamfcloud.com device_names.ts
```

<details>
<summary>Show a more complex example</summary>
<br>

Restart all devices owned by anyone named "Robert".

```javascript
import * as jamf from "https://deno.land/x/jamf_school@0.3.2/mod.ts";

// The client can be instantiated with an API instead of credentials.
const api = jamf.createAPI({
  id: "YOUR_NETWORK_ID",
  token: "YOUR_API_TOKEN",
  url: "https://YOUR_SCHOOL.jamfcloud.com/api",
});

const client = jamf.createClient({ api });

// Using the API directly gives you control over exactly what requests
// are made. All the data returned is validated, of course.
const deviceData = await api.getDevices({ ownerName: "Robert" });

// If you have a client, objects can be created from API data directly.
const devices = deviceData.map((data) => client.createDevice(data));

// Everything is promise-based, so you can do things concurrently.
// Methods that perform actions (like restart) will reject on failure.
await Promise.allSettled(devices.map((device) => device.restart()));
```

</details>

## Changelog

Each entry explains what changed and links to a pull request that has more details.

### Version 0.3.2

<!-- deno-fmt-ignore -->

- **Improve implementation of `Device.enrollment` ([#56])** <br>
  This should be marginally faster. The "manual" type now also includes a `pending` property (currently always `false`).

<details>
<summary>Older versions</summary>

### Version 0.3.1

<!-- deno-fmt-ignore -->

- **Add `Device.enrollment` ([#53])** <br>
  It's an object instead of a string. See the docs for more information.

- **Add `Client.getUserByName` ([#53])** <br>
  Returns null if there are no users with the name, fails if multiple users have it.

[#53]: https://github.com/SeparateRecords/deno_jamf_school/pull/53

### Version 0.3.0

<!-- deno-fmt-ignore -->

- **Add support for apps ([#15])** <br>
  This includes `Client.getApps`, `Client.getAppsById`, and `Device.getApps`. See the documentation for more information (the `App` interface).

- **Add support for locations ([#40])** <br>
  Locations can get the data that belongs to them, and all objects can now get their location.

- **Specify the behaviour of toString and toJSON methods ([#49])** <br>
  These methods can now be used reliably now that their behaviour is consistent and obvious.

[#15]: https://github.com/SeparateRecords/deno_jamf_school/pull/15
[#40]: https://github.com/SeparateRecords/deno_jamf_school/pull/40
[#49]: https://github.com/SeparateRecords/deno_jamf_school/pull/49

### Version 0.2.1

<!-- deno-fmt-ignore -->

- **Suggest identifiers for APIGetDevicesOptions.modelIdentifier ([#34])** <br>
  This uses the list curated in [SeparateRecords/apple_device_identifiers] to suggest strings, and still allows any string to be assigned to the property.

[SeparateRecords/apple_device_identifiers]: https://github.com/SeparateRecords/apple_device_identifiers
[#34]: https://github.com/SeparateRecords/deno_jamf_school/pull/34

### Version 0.2.0

<!-- deno-fmt-ignore -->

- **Breaking: Changed how clients are instantiated with an API ([#8])** <br>
  The `API` object must now be passed in as an `api` property on an object.

- **Added methods to set device ownership ([#10], [#16])** <br>
  `API.assignDeviceOwner` and `Device.setOwner`. The documentation contains examples.

- **Various schema improvements and corrections ([#10], [#20])** <br>
  More data is now included. To the best of my knowledge, the current schemas are complete.

- **Schemas don't fail when additional properties are returned ([#19])** <br>
  Release builds of schemas are now resilient against additional properties being added, but will still fail if any required properties are omitted.

- **Handle authentication errors with a better message ([#24])** <br>
  Previously, authentication errors were lumped in with other errors, which made them confusing to read.

- **Changed how data is validated ([#7])** <br>
  Technical change, but a good increase in real-world performance.

[#24]: https://github.com/SeparateRecords/deno_jamf_school/pull/24
[#20]: https://github.com/SeparateRecords/deno_jamf_school/pull/20
[#19]: https://github.com/SeparateRecords/deno_jamf_school/pull/19
[#16]: https://github.com/SeparateRecords/deno_jamf_school/pull/16
[#10]: https://github.com/SeparateRecords/deno_jamf_school/pull/10
[#8]: https://github.com/SeparateRecords/deno_jamf_school/pull/8
[#7]: https://github.com/SeparateRecords/deno_jamf_school/pull/7

### Version 0.1.0

<!-- deno-fmt-ignore -->

- **Initial release** <br>
  Includes basic API support for devices, device groups, users, and user groups, as well as an object-oriented layer to simplify using the API.

</details>

## License and Disclaimer

JAMF is a trademark beloning to JAMF Software, LLC. This project's development is not affiliated with JAMF Software, LLC.

There is a copy of the project's license (MIT) located in [the root of the repository][repo] and in the [module entrypoint (mod.ts)](./mod.ts).

[repo]: https://github.com/SeparateRecords/deno_jamf_school
