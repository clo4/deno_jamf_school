<!-- dprint-ignore-file -->
<!-- DO NOT EDIT: Generated from ./README.tpl.md -->

# Jamf School for Deno

<!-- I made a cool banner but can't use it due to potential trademark issues. RIP -->

**Jamf School for Deno** is an idiomatic, unofficial API wrapper for Jamf School.

**[Here's the docs.][docs]**

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
  url: "YOUR_SCHOOL.jamfcloud.com/api",
});

// See the docs for everything clients can do.
const devices = await client.getDevices();
```

<details>
<summary>A more complex example</summary>

```typescript
#!/usr/bin/env deno run --allow-net=YOUR_SCHOOL.jamfcloud.com
import * as jamf from "https://deno.land/x/jamf_school@0.1.0/mod.ts";

const api = jamf.createAPI({
  id: "YOUR_NETWORK_ID",
  token: "YOUR_API_TOKEN",
  url: "YOUR_SCHOOL.jamfcloud.com/api",
});

// The client can be instantiated with an API instead of credentials.
const client = jamf.createClient({ api });

// Using the API, it's easier to get finer control over requests,
// and implement more low-level optimizations.
const deviceData = await api.getDevices({
  name: "Robert",
});

// The API doesn't stop you from using the niceties of objects.
// Client and API are designed to work well together.
const devices = deviceData.map((data) => client.createDevice(data));

// Everything is promise-based, so you can do things concurrently.
await Promise.allSettled((devices) => device.restart());
```

</details>
