# deno_jamf_school

This is an **unofficial API wrapper for Jamf School**. It is written in TypeScript,
designed to be used in the Deno runtime, and targeted towards school IT administrators.
It aims to be idiomatic, easy to use, safe for production, and well documented.

The library introduction ([src/README.md](src/README.md)) has usage examples.

## Goals and Ambitions

The aim for this library is to be usable by any school IT administrator with a passing
knowledge of JavaScript and an inclination towards automation. This results in the
following design criteria:

- **Simply designed.** Have as little public as possible, with obvious names.
- **Documented.** Simple english, everything laid out as bare as possible.
- **Private.** For use in schools, _no data can ever be shared_. This library should be
  usable with only the bare minimum network permission.
- **Tested.** Everything that is worth testing should be tested.

## Why Deno? Why not Node.js?

Deno is a secure JavaScript runtime, designed so you can run untrusted code with
confidence. Unlike Node.js, where any code you download from NPM can read any file or
contact any web server, scripts run with Deno only have access to what you explicitly
allow. **This is a critical feature for schools.**

[Here's the Deno manual](https://deno.land/manual). If you're not already familiar with
it, you'll pick it up quickly.

## License and Disclaimer

JAMF is a trademark beloning to JAMF Software, LLC. This project's development is not
affiliated with JAMF Software, LLC.

There is a copy of the project's license (MIT) located in
[the root of the repository](./LICENSE) and in the
[module entrypoint (src/mod.ts)](./src/mod.ts).

## Project directories

### [src](src)

All library source code lives in this directory. This is the directory published to
deno.land/x

### [src / schemas](src/schemas)

All schema files to validate API data are located here.

The file `mod.bundle.js` is created automatically by the bundle script, and exists to
Make importing the library faster. See #7 for more information.

### [src / models](src/models)

A type-only directory that describes the public types.

### [src / internal](src/internal)

Contains implementations of the interfaces defined in src/models. Nothing from this
directory is counted as part of the public API and should not be imported in user-code.

---

### ** / deps

External and shared dependencies. Each dependency is exported from an individual,
descriptively named file. Don't import from a deps directory in user-code.

---

### [test](test)

Tests live here. Tests must be allowed to read the test data.

```bash
deno test --allow-read=./test/example_data
```

### [test / example_data](test/example_data)

The sample data. All this data has been redacted; absolutely no personally identifiable
data is present.

---

### [scripts](scripts)

Custom scripts that help with development or continuous integration, such as the bundle
and render scripts.

Here are some commands to copy/paste (run from the repo root)

#### Render .tpl.md files

```bash
deno run --no-check tpl.ts | deno run --no-check -A ./scripts/render.ts
```

#### Bundle src/schemas

```bash
deno run --no-check -A --unstable ./scripts/bundle.ts
```

#### Install `redact`

```bash
deno install -qfn redact https://deno.land/x/redact_json/cli.ts
```
