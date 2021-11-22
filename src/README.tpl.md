# Jamf School API for Deno

An **unofficial, idiomatic API wrapper for Jamf School**. It's designed to be easy for IT professionals with JavaScript experience to learn, and to be safe enough to trust in production.

If something doesn't work as expected or you just want some help, please [raise an issue on GitHub]($REPO/issues). Bad documentation is a bug!

Currently, only a subset of API features are supported.

**[Here's the documentation for the latest release.]($DOCS/mod.ts)**

## Features

- Designed for modern JavaScript
- A low-level API wrapper and a higher-level object-oriented interface
- Data validation means you always get the data you're promised
- Comprehensive documentation and easy-to-follow example
- Only requires `--allow-net=YOUR_SCHOOL.jamfcloud.com`

## Usage

[Here's how to get your API credentials]($DOCS/mod.ts#Credentials). You'll have to replace the token, ID, and URL in the examples.

This example will print the name of each registered device.

<h6>device_names.ts</h6>

<!-- Using JS as the language for the more reliable syntax highlighting -->

```javascript
import * as jamf from "$src/mod.ts";

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

## Changelog

Each entry explains what changed and links to a pull request that has more details.

### Version 0.5.0

<!-- deno-fmt-ignore -->

- **Add support for profiles ($76)** <br>
  Due to limitations with the API, it isn't possible to get profiles assigned to particular devices or device groups.

<details>
<summary>Older versions</summary>

### Version 0.4.1

<!-- deno-fmt-ignore -->

- **Added `User.restartDevices()` ($73)** <br>
  Users contain devices, so this makes the API more consistent.

- **Fixed `DeviceGroup.restartDevices()` ($75)** <br>
  The documentation claimed that failing to restart devices wouldn't throw, but it actually did.

### Version 0.4.0

<!-- deno-fmt-ignore -->

- **Added methods to edit a User/UserGroup/Device/DeviceGroup ($58, $61, $62)** <br>
  Update multiple properties using an `API`, or more easily with the respective objects' `set` methods.

- **Added methods to set User/Device locations ($63, $66)** <br>
  Move individual users and devices, or move in bulk with `Location` objects. Search the docs for 'move' or 'location'.

- **Added `Client.getUserByUsername` ($58)** <br>
  Usernames are inherently unique, so this makes it a reliable way to fetch users.

- **Added `locationId` & `ownerId` property to relevant objects ($66)** <br>
  Makes it easier to use the objects and allows for better optimization.

- **Added `DeviceGroup.restartDevices()` & `Location.restartDevices()` ($70)** <br>
  These methods make simple restart-scripts much easier to write, but they don't provide detailed results (failure to restart will not result in an exception).

- **Renamed `API.assignDeviceOwner` ($58)** <br>
  Now it's more consistent: `API.setDeviceOwner`

- **Relaxed signature of `Client.getDevicesInGroups` ($58)** <br>
  The only property of the `DeviceGroup` objects used was `id`, and this update is aiming to make this style general.

- **Improved how objects are displayed in the console ($60)** <br>
  `console.log(someDevices)` no longer results in `Device {}`! Indentation doesn't work properly due to some internal Deno stuff.

- **Breaking: Methods that returned `Promise<this>` now return `Promise<void>` ($68)** <br>
  Returning `this` is unexpected and encourages worse code than returning nothing at all.

### Version 0.3.2

<!-- deno-fmt-ignore -->

- **Improved the implementation of `Device.enrollment` ($56)** <br>
  This should be marginally faster. The "manual" type now also includes a `pending` property (currently always `false`).

### Version 0.3.1

<!-- deno-fmt-ignore -->

- **Added `Device.enrollment` ($53)** <br>
  It's an object instead of a string. See the docs for more information.

- **Added `Client.getUserByName` ($53)** <br>
  Returns null if there are no users with the name, fails if multiple users have it.

### Version 0.3.0

<!-- deno-fmt-ignore -->

- **Added support for apps ($15)** <br>
  This includes `Client.getApps`, `Client.getAppsById`, and `Device.getApps`. See the documentation for more information (the `App` interface).

- **Added support for locations ($40)** <br>
  Locations can get the data that belongs to them, and all objects can now get their location.

- **Specified the behaviour of toString and toJSON methods ($49)** <br>
  These methods can now be used reliably now that their behaviour is consistent and obvious.

### Version 0.2.1

<!-- deno-fmt-ignore -->

- **Suggest identifiers for APIGetDevicesOptions.modelIdentifier ($34)** <br>
  This uses the list curated in [SeparateRecords/apple_device_identifiers] to suggest strings, and still allows any string to be assigned to the property.

[SeparateRecords/apple_device_identifiers]: https://github.com/SeparateRecords/apple_device_identifiers

### Version 0.2.0

<!-- deno-fmt-ignore -->

- **Breaking: Changed how clients are instantiated with an API ($8)** <br>
  The `API` object must now be passed in as an `api` property on an object.

- **Added methods to set device ownership ($10, $16)** <br>
  `API.assignDeviceOwner` and `Device.setOwner`. The documentation contains examples.

- **Various schema improvements and corrections ($10, $20)** <br>
  More data is now included. To the best of my knowledge, the current schemas are complete.

- **Schemas don't fail when additional properties are returned ($19)** <br>
  Release builds of schemas are now resilient against additional properties being added, but will still fail if any required properties are omitted.

- **Handle authentication errors with a better message ($24)** <br>
  Previously, authentication errors were lumped in with other errors, which made them confusing to read.

- **Changed how data is validated ($7)** <br>
  Technical change, but a good increase in real-world performance.

### Version 0.1.0

<!-- deno-fmt-ignore -->

- **Initial release** <br>
  Includes basic API support for devices, device groups, users, and user groups, as well as an object-oriented layer to simplify using the API.

</details>

## License and Disclaimer

JAMF is a trademark beloning to JAMF Software, LLC. This project's development is not affiliated with JAMF Software, LLC.

There is a copy of the project's license (MIT) located in [the root of the repository][repo] and in the [module entrypoint (mod.ts)](./mod.ts).

[repo]: $REPO
