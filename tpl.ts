import type { Schema } from "./scripts/render.ts";
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
	},
	variables: {
		VERSION: jamf.version,
		STD_VERSION: "0.106.0",
	},
};

if (import.meta.main) {
	if (!Deno.isatty(Deno.stdout.rid)) {
		// If the output isn't a terminal, we're being piped into another program.
		console.log(JSON.stringify(config));
	} else {
		// The output is a terminal (not a file), so be helpful.
		const json = "deno run --no-check tpl.ts";
		const script =
			"deno run --no-check --allow-read=. --allow-write=. scripts/render.ts";
		console.log(`${json} | ${script}`);
	}
}
