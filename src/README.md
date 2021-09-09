<!-- dprint-ignore-file -->
<!-- DO NOT EDIT: Generated from ./README.tpl.md -->

# Jamf School for Deno

<!-- I made a cool banner but can't use it due to potential trademark issues. RIP -->

**Jamf School for Deno** is an idiomatic, unofficial API wrapper for Jamf School.

If something doesn't work as expected, _please_ [raise an issue on GitHub][issues] so we
can improve the library for everyone!

**[Here's the documentation for the latest release.][docs]**

[issues]: https://github.com/SeparateRecords/deno_jamf_school/issues
[docs]: https://doc.deno.land/https/deno.land/x/jamf_school@0.1.0/mod.ts

## Status

**Currently an MVP. Don't use this yet.**

(Unless you only need to restart and wipe devices, it's great at doing that.)

## Features

- Complete data validation, for maximum safety.
- Excellent documentation and errors.
- Consistent API modelled after the web's document API.
- Only requires `--allow-net=YOUR_URL`

## Usage

```typescript
#!/usr/bin/env deno run --allow-net=YOUR_SCHOOL.jamfcloud.com
import * as jamf from "https://deno.land/x/jamf_school@0.1.0/mod.ts";

const client = jamf.createClient({
  id: "YOUR_NETWORK_ID",
  token: "YOUR_API_TOKEN",
  url: "https://YOUR_SCHOOL.jamfcloud.com/api",
});

// See the docs for everything clients can do.
const devices = await client.getDevices();
```

<details>
<summary>A more complex example</summary>

```typescript
#!/usr/bin/env deno run --allow-net=YOUR_SCHOOL.jamfcloud.com
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

- **Added methods to set device ownership ([#10])**\
  `API.assignDeviceOwner` and `Device.setOwner`. The documentation contains examples.

- **Improved schemas ([#10])**\
  `API.getDevice` should fail less often now, and `API.getDevices` has more detail.

- **Changed how clients are instantiated with an API ([#8])**\
  The `API` must now be passed in as an `api` property on an object.

- **Changed how data is validated ([#7])**\
  Technical change, but a pretty good performance win.

[#10]: https://github.com/SeparateRecords/deno_jamf_school/pull/10
[#8]: https://github.com/SeparateRecords/deno_jamf_school/pull/8
[#7]: https://github.com/SeparateRecords/deno_jamf_school/pull/7

### Version 0.1.0

- **Initial release**\
  Includes basic API support for devices, device groups, users, and user groups, as well
  as an object-oriented layer to simplify using the API.
