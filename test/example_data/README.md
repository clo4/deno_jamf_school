# example_data

All the data in this directory is from the Jamf School API. It has been manually curated, and completely redacted to ensure no personally or professionally identifiable data is remaining. Arrays are shuffled and have random elements deleted, and all other values are replaced with a known constant. The resulting JSON exists purely to check schemas against.

This data must be manually updated occasionally.

## How to redact data

To get help for the redaction script, run it without arguments. It takes in all its data over stdin, and outputs over stdout.

```bash
deno run scripts/redact.ts
```

### Bash

```bash
deno run scripts/redact.ts < ignore/real.json > test/example_data/redacted.json
```

### PowerShell

```powershell
Get-Content ignore\real.json | deno run scripts\redact.ts > test\example_data\redacted.json
```

### JavaScript

```javascript
import { redact } from "https://deno.land/x/redact_json@0.1.2/mod.ts";

const file = await Deno.readTextFile("ignore/real.json");

const json = JSON.parse(file);
const redacted = redact(json);
const string = JSON.stringify(redacted);

await Deno.writeTextFile("test/example_data/redacted.json", string);
```
