# Examples

This directory contains examples of using this library. "Points of interest" in the code will be marked with a 📍 red pin.

## Running the examples

All of these examples assume 3 environment variables exist, and will fail if they don't. These correspond to their respective properties in [Credentials]($DOCS/mod.ts#Credentials).

- `JAMF_SCHOOL_ID`
- `JAMF_SCHOOL_TOKEN`
- `JAMF_SCHOOL_URL`

The scripts will prompt for any required permissions.

### "Restart device groups" ([source](./restart_device_groups.ts))

An interactive script that prompts you to select some device groups, and once selected, will restart the devices in those groups.

```bash
deno run --unstable $src/examples/restart_device_groups.ts
```

### "Restart every morning" ([source](./restart_every_morning.ts))

An example of using the lower-level "API" module to restart some known devices, and integrating that with the [deno_cron](https://deno.land/x/deno_cron) module to restart them every morning at 7 am.

```bash
deno run --unstable $src/examples/restart_every_morning.ts
```

## License

The code in this directory is public domain. It can be freely copied and reused. See [UNLICENSE](./UNLICENSE) for the legal stuff.

Note that no other code in this repository is public domain, that's all under the [MIT license](../LICENSE).
