import * as flags from "./deps/std_flags.ts";
import { copy as fsCopy } from "./deps/std_fs_copy.ts";
import { writeAll } from "./deps/std_io_util.ts";
import * as log from "./deps/std_log.ts";
import * as path from "./deps/std_path.ts";

import * as esbuild from "./deps/esbuild.ts";

// It doesn't have to be the same exact Ajv instance because the code
// is stored on the `source` property of the Function object,
// but it's more consistent this way.
import ajv from "../src/schemas/_ajv_jtd.ts";
import standaloneCode from "../src/deps/ajv_standalone.ts";

import * as schemas from "../src/schemas/mod.ts";

type Timer = () => () => number;

/**
 * Get a function that, when called, returns the number of milliseconds since
 * the first function was created. More accurate with --allow-hrtime
 */
const timer: Timer = (start = performance.now()) => () => performance.now() - start;

let {
	log: logArg,
	help: helpArg,
} = flags.parse(Deno.args, {
	string: ["log"],
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

if (typeof logArg === "string") {
	if (logArg === "") logArg = "INFO";

	await log.setup({
		loggers: {
			bundle: {
				// @ts-ignore this will throw if we give it an invalid level, which is
				// the desired behaviour
				level: logArg,
				handlers: ["console"],
			},
		},
		handlers: {
			console: new log.handlers.ConsoleHandler("DEBUG", {
				formatter: (record) => {
					const { loggerName, levelName, msg } = record;
					return `${loggerName} ${levelName.toLowerCase()}: ${msg}`;
				},
			}),
		},
	});
}

const logger = log.getLogger("bundle");

const timeFinish = timer();

addEventListener("unload", () => {
	logger.info(`Finished in ${timeFinish()} ms`);
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
logger.debug(`${repo(outFile)} is ${oldSize}B`);

// This is done to make sure the bundle is done in essentially an identical
// directory to this one (minus the different name). The validators are
// overwritten.
logger.debug(`Copying ${repo(schemasDir)} to ${repo(buildDir)}`);
await fsCopy(schemasDir, buildDir, { overwrite: true });

const te = new TextEncoder();

logger.info("Compiling route validators");
const timeTranspiling = timer();
await Promise.all([
	...Object.entries(schemas.validators).map(
		// Originally, I thought I had to transpile the validator to ESM, since AJV
		// compiles validators to CJS. As it turns out, you can actually import CJS
		// from ESM and esbuild will just... handle it. Somehow, it actually ended
		// up slimming down the bundle by a few kB too. Dunno how, but that's cool!
		async ([key, validator]) => {
			logger.debug(`Compiling validator: ${key}`);
			const src = standaloneCode(ajv, validator);

			// There is a direct* map between the object key and file path.
			// * so long as I name the routes and files consistently.
			const outFileName = key
				.replaceAll(" ", "")
				.replaceAll(":", "")
				.replaceAll("/", "_") + ".ts";

			// Since the file will be transpiled during bundling and it won't be
			// type checked at any stage of that, it's safe to write this CJS
			// straight to a TS file. This also means I don't have to write a plugin
			// to rewrite the imports of mod.ts.
			const outFilePath = path.join(buildDir, outFileName);

			logger.debug(`Opening ${repo(outFilePath)}`);
			// Note the omission of `create` - if there's no file to open, that's an
			// error, since `key` should directly map to a file.
			const file = await Deno.open(outFilePath, {
				write: true,
				truncate: true,
			});
			const bytes = te.encode(src);

			logger.debug(`Writing code for '${key}' to ${repo(outFilePath)}`);
			await writeAll(file, bytes);

			logger.debug(`Closing file ${repo(outFilePath)}`);
			Deno.close(file.rid);
		},
	),
]);
logger.debug(`Transpiled in ${timeTranspiling()} ms`);

// Referencing ./mod.ts basically makes TS treat the bundled file as if it
// were actually mod.ts. I have no idea if this is the intended behaviour, but
// it works. It also has the super fun side-effect of crashing the Deno LSP
// whenever you open the file in-editor, which makes development more exciting.
// There are tests to ensure that mod.ts and mod.bundle.js behave identically.
const banner = `/// <reference types="./mod.ts" />

// dprint-ignore-file
// deno-lint-ignore-file

// This file was generated automatically.
// Don't edit this file directly.

// WARNING: opening this file soft-crashes the Deno language server. If you
// opened this file in Visual Studio Code and use the vscode_deno extension,
// restart or reload your editor now (it's faster than waiting for the LS)
`;

logger.info(`Bundling, write to ${repo(outFile)}`);
await esbuild.build({
	entryPoints: [buildModTsPath],
	bundle: true,
	format: "esm",
	outfile: outFile,
	banner: {
		js: banner,
	},
	minifyIdentifiers: false,
	minifySyntax: true,
	minifyWhitespace: true,
});

// Unlike in Node, esbuild requires manually calling stop() in Deno, otherwise
// the program will keep running indefinitely.
esbuild.stop();

logger.debug(`Deleting ${repo(buildDir)}`);
await Deno.remove(buildDir, { recursive: true });

const newSize = (await Deno.stat(outFile)).size;
logger.debug(`${repo(outFile)} is ${newSize}B`);

const delta = newSize - oldSize;
const sign = delta > 0 ? "+" : "";

logger.info(`${repo(outFile)} changed by ${sign}${delta}B`);
