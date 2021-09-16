<!-- dprint-ignore-file -->
<!-- DO NOT EDIT: Generated from ./README.tpl.md -->

# Jamf School for Deno

**Jamf School for Deno is an unofficial, idiomatic API wrapper for Jamf School.**\
It should be usable by any school IT admin with _some_ experience in JavaScript.

If something doesn't work as expected or you just want some help, please
[raise an issue on GitHub][issues] so we can improve the library and documentation for
everyone!

**[Here's the documentation for the latest release.][docs]**

[issues]: https://github.com/SeparateRecords/deno_jamf_school/issues
[docs]: https://doc.deno.land/https/deno.land/x/jamf_school@0.1.0/mod.ts

## Status

This is currently in alpha. There may be unexpected breakages due to API changes. This
library only supports a very limited subset of API features for devices, device groups,
users, and user groups.

## Features

- Designed for Deno: only requires `--allow-net=YOUR_URL`
- Excellent documentation and error messages.
- Complete data validation for all API requests.
- A consistent API modelled after the web's document API.

## Usage

This will print the name of each registered device. To run this example, you'll have to
change the ID, token, and URL. [Here's how to get those credentials.][credentials]

<h6>device_names.ts</h6>

```javascript
import * as jamf from "https://deno.land/x/jamf_school@0.1.0/mod.ts";

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

```console
$ deno run --allow-net=YOUR_SCHOOL.jamfcloud.com device_names.ts
```

[credentials]: https://doc.deno.land/https/deno.land/x/jamf_school@0.1.0/mod.ts#Credentials

<details>
<summary>A more complex example</summary>
<br>

Restart all devices owned by anyone named "Robert".

```javascript
import * as jamf from "https://deno.land/x/jamf_school@0.1.0/mod.ts";

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
await Promise.allSettled((devices) => device.restart());
```

</details>

## Changelog

Each entry only explains what changed, but links to a pull request that explains why.

### Version 0.2.0

- **Added methods to set device ownership ([#10], [#16])**\
  `API.assignDeviceOwner` and `Device.setOwner`. The documentation contains examples.

- **Improved schemas ([#10], [#20])**\
  Various API methods should fail much less often now.

- **Changed how clients are instantiated with an API ([#8])**\
  The `API` must now be passed in as an `api` property on an object.

- **Changed how data is validated ([#7])**\
  Technical change, but a pretty good performance win.

- **Schemas don't fail when additional properties are returned ([#19])**\
  Release builds of schemas are now resilient against additional properties being added,
  but will still break if any properties are unexpectedly removed.

- **Handle authentication errors with a better message ([#24])**\
  Previously, auth errors were lumped in with other API errors, which made them
  confusing to read. Now it should be much more obvious when your token or ID is wrong.

[#24]: https://github.com/SeparateRecords/deno_jamf_school/pull/24
[#20]: https://github.com/SeparateRecords/deno_jamf_school/pull/20
[#19]: https://github.com/SeparateRecords/deno_jamf_school/pull/19
[#16]: https://github.com/SeparateRecords/deno_jamf_school/pull/16
[#10]: https://github.com/SeparateRecords/deno_jamf_school/pull/10
[#8]: https://github.com/SeparateRecords/deno_jamf_school/pull/8
[#7]: https://github.com/SeparateRecords/deno_jamf_school/pull/7

### Version 0.1.0

- **Initial release**\
  Includes basic API support for devices, device groups, users, and user groups, as well
  as an object-oriented layer to simplify using the API.

## License and Disclaimer

JAMF is a trademark beloning to JAMF Software, LLC. This project's development is not
affiliated with JAMF Software, LLC.

There is a copy of the project's license (MIT) located in
[the root of the repository][repo] and in the [module entrypoint (mod.ts)](./mod.ts).

[repo]: https://github.com/SeparateRecords/deno_jamf_school
