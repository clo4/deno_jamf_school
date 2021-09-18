import type { Schema } from "./scripts/render.ts";
import * as path from "./scripts/deps/std_path.ts";
import * as jamf from "./src/mod.ts";

// This file is configuration for scripts/render.ts and exists purely to
// separate the logic from any opinions.
// $ deno run tpl.ts | deno run --allow-read=. --allow-write=. scripts/render.ts

export const config: Schema = {
	settings: {
		inputFileSuffix: ".tpl.md",
		outputFileSuffix: ".md",
		replaceLeadingTabs: "  ",
		contentPrefix:
			"<!-- dprint-ignore-file -->${eol}<!-- DO NOT EDIT: Generated from ./${name} -->",
		lineEnding: "lf",
		excludePaths: [
			"**/node_modules", // just in case!
		],
		// Regardless of CWD, the root will be relative to this file.
		root: path.dirname(path.fromFileUrl(import.meta.url)),
	},
	variables: {
		VERSION: jamf.version,
		STD_VERSION: "0.107.0",
		REPO: "https://github.com/SeparateRecords/deno_jamf_school",
		DOCS: `https://doc.deno.land/https/deno.land/x/jamf_school@${jamf.version}`,
	},
};

if (import.meta.main) {
	if (!Deno.isatty(Deno.stdout.rid)) {
		// If the output isn't a terminal, we're being piped into another program.
		console.log(JSON.stringify(config, null, 2));
	} else {
		// The output is a terminal (not a file), so be helpful.
		const commands = [
			"deno run --no-check ./tpl.ts",
			"deno run --no-check --allow-read=. --allow-write=. ./scripts/render.ts",
		];
		console.log(commands.join(" | "));
	}
}
