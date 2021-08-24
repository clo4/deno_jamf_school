# Jamf School for Deno

<!-- I made a cool banner but can't use it due to potential trademark issues. RIP -->

**Jamf School for Deno** is an idiomatic, unofficial API wrapper for Jamf School.

**[Here's the docs.][docs]**

[docs]: https://doc.deno.land/https/deno.land/x/jamf_school@$VERSION/mod.ts

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
import * as jamf from "https://deno.land/x/jamf_school@$VERSION/mod.ts";

const client = jamf.createClient({
	id: "YOUR_ID",
	token: "YOUR_API_TOKEN",
	url: "YOUR_SCHOOL.jamfcloud.com",
});

// See the docs for everything clients can do.
const devices = await client.getDevices();
```
