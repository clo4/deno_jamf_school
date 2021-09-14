import * as flags from "./deps/std_flags.ts";
import { copy as fsCopy } from "./deps/std_fs_copy.ts";
import * as path from "./deps/std_path.ts";

import * as esbuild from "./deps/esbuild.ts";
import { colorizeConsole } from "./deps/colorize.ts";

// It doesn't have to be the same exact Ajv instance because the code
// is stored on the `source` property of the Function object,
// but it's more consistent this way.
import ajv from "../src/schemas/_ajv_jtd.ts";
import standaloneCode from "../src/deps/ajv_standalone.ts";
import "./ajv_compile_shim.js";

import * as schemas from "../src/schemas/mod.ts";

colorizeConsole();

const { help: helpArg } = flags.parse(Deno.args, {
	boolean: ["help"],
	alias: { help: ["h"] },
});

// dprint-ignore
const help = `
Optimize src/schemas/mod.ts by:
1. Compiling all validators ahead of time
2. Bundling all code into a single file, src/schemas/mod.bundle.js
`.trimStart();

if (helpArg) {
	console.log(help);
	Deno.exit(0);
}

type Timer = () => () => number;

/**
 * Get a function that, when called, returns the number of milliseconds since
 * the first function was created. More accurate with --allow-hrtime
 */
const timer: Timer = (start = performance.now()) => () => performance.now() - start;

const timeFinish = timer();

addEventListener("unload", () => {
	console.info(`Finished in ${timeFinish()} ms`);
});

// These paths are used as bases for the important shit
// ./bundle.ts
const thisFile = path.fromFileUrl(import.meta.url);
// .
const scriptsDir = path.dirname(thisFile);

// .. -- The root of the repository
const repoRoot = path.dirname(scriptsDir);
/** Trim the start of that path until the first segment in this repository. */
const repo = (p: string) => p.slice(repoRoot.length + 1);

// ../src -- Base directory for source code
const srcDir = path.join(repoRoot, "src");

// ../src/schemas -- Source for copying
const schemasDir = path.join(srcDir, "schemas");
// ../src/_schemas -- Destination for copying
const buildDir = path.join(srcDir, "_schemas");

// ../src/_schemas/mod.ts -- Bundle entrypoint
const buildModTsPath = path.join(buildDir, "mod.ts");
// ../src/schemas/mod.bundle.js -- Bundle output
const outFile = path.join(schemasDir, "mod.bundle.js");

const oldSize = (await Deno.stat(outFile)).size;
console.debug(`${repo(outFile)} is ${oldSize}B`);

// This is done to make sure the bundle is done in essentially an identical
// directory to this one (minus the different name). The validators are
// overwritten.
console.debug(`Copying ${repo(schemasDir)} to ${repo(buildDir)}`);
await fsCopy(schemasDir, buildDir, { overwrite: true });

console.info("Writing route validators");
const timeWritingValidators = timer();
await Promise.all([
	...Object.entries(schemas.validators).map(
		async ([key, validator]) => {
			console.debug(`Reading validator: ${key}`);
			const src = standaloneCode(ajv, validator);

			// There is a direct map between the object key and file path,
			// so long as the files are named consistently.
			const outFileName = key
				.replaceAll(" ", "")
				.replaceAll(":", "")
				.replaceAll("/", "_") + ".ts";

			// Since the file will be transpiled during bundling and it won't be
			// type checked at any stage of that, it's safe to write this CJS
			// straight to a TS file. This also means I don't have to write a plugin
			// to rewrite the imports of mod.ts. esbuild will happily import CJS
			// from an ESM file.
			const outFilePath = path.join(buildDir, outFileName);

			console.debug(`Writing code for '${key}' to ${repo(outFilePath)}`);
			await Deno.writeTextFile(outFilePath, src, { create: false });
			console.debug(`Finished writing ${repo(outFilePath)}`);
		},
	),
]);
console.debug(`Wrote validators in ${timeWritingValidators()} ms`);

// Referencing ./mod.ts basically makes TS treat the bundled file as if it
// were actually mod.ts. I have no idea if this is the intended behaviour, but
// it works. It also has the super fun side-effect of crashing the Deno LSP
// whenever you open the file in-editor, which makes development more exciting.
// Tests verify that schemas/mod.ts and schemas/mod.bundle.js behave identically.
const banner = `
/// <reference types="./mod.ts" />

// dprint-ignore-file
// deno-lint-ignore-file

// This file was generated automatically.
// Don't edit this file directly.

// WARNING: opening this file soft-crashes the Deno language server. If you
// opened this file in Visual Studio Code and use the vscode_deno extension,
// restart or reload your editor now (it's faster than waiting for the LS)
`.trimStart();

const timeBundling = timer();

console.info(`Bundling, write to ${repo(outFile)}`);
await esbuild.build({
	entryPoints: [buildModTsPath],
	bundle: true,
	format: "esm",
	outfile: outFile,
	banner: {
		js: banner,
	},
	// Keeps stack traces clean and readable
	minifyIdentifiers: false,
	// With whitespace un-minified, GitHub reports that the majority of this
	// repository is JavaScript because the bundle is so large :(
	minifySyntax: true,
	minifyWhitespace: true,
});
console.debug(`Finished bundling in ${timeBundling()} ms`);

// Unlike in Node, esbuild requires manually calling stop() in Deno, otherwise
// the program will keep running indefinitely.
esbuild.stop();

console.debug(`Deleting ${repo(buildDir)}`);
await Deno.remove(buildDir, { recursive: true });

const newSize = (await Deno.stat(outFile)).size;
console.debug(`${repo(outFile)} is ${newSize}B`);

const delta = newSize - oldSize;
const sign = delta > 0 ? "+" : "";

console.info(`${repo(outFile)} changed by ${sign}${delta}B`);
