# Contributing

Here is information that you'll need to know if you plan on contributing to this
codebase. GitHub puts a handy table of contents button at the top left of this document.
You'll want to use that.

## Structure

### Dependencies

There's a common pattern in Deno projects of using a `deps.ts` file for dependencies. I
prefer to re-export dependencies from a descriptively named file in a `deps` directory,
which lets the importer choose how it's imported. This way, you don't need to be aware
of _how_ the module is re-exported.

### Source code

All source code is located under the `src` directory. This is the directory that is
published to deno.land/x. No tests or config are included in src, which makes it a lot
cleaner to view from the module repository.

## Conventions

While this project follows most of the conventions of a modern Deno/TypeScript project,
there are a few notable differences in structure that are important to be aware of.

### Formatting

Instead of `deno fmt`, this project uses `dprint`. dprint is the backend for Deno
formatter, and supports configuration - most of the settings from Deno are kept the
same. Your platform's package manager probably lists it, but if not, compiling it from
source isn't too hard (cargo install dprint).

Before committing, run `dprint fmt`.

### Indentation

Please use tabs. Spaces are fine, and in fact for the first 90 commits, I was also using
spaces. However, tabs allow you to configure the width in your editor to be just right
for you. If that's two spaces, great! If that's 200 spaces, well- sure, you can do that.
Dunno why you would, but you can.

> **Pro tip:** On GitHub, append `?ts=4` to the URL to set the tab width to 4. It makes
> viewing code with tabs bearable if you hate 8-wide tabs, like me.

### Naming: What words should I use?

For verbs, please try to stick to
[Microsoft's list of approved PowerShell verbs][verbs]. Replace "new" with "create",
since `new` is a keyword in JavaScript.

[verbs]: https://docs.microsoft.com/en-us/powershell/scripting/developer/cmdlet/approved-verbs-for-windows-powershell-commands?view=powershell-7.1

### Naming: Methods

Methods follow the naming convention below (spaced for readability).

<!-- dprint-ignore -->
verb **Noun** \[*Modifier*\]

<!-- dprint-ignore -->
For example, <code>update**Data**</code>, <code>get**Devices**</code>, and
<code>get**Device***ById*</code>.

**However**, if the noun is implied by the class itself, it can be omitted. For example,
on the `Device` class, what _would_ be `wipeDevice` is just `wipe`.

### Naming: Properties

<!-- dprint-ignore -->
Properties are just a **noun**. For example, <code>**id**</code> and
<code>**udid**</code>.

<!-- dprint-ignore -->
However, if the property is a boolean, it must start with 'is' or 'has' - whichever is
more contextually appropriate. For example, <code>is**Managed**</code>.
