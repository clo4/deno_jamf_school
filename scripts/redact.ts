#!/usr/bin/env deno

import * as flags from "./deps/std_flags.ts";
import * as collections from "./deps/std_collections.ts";
import { colorize } from "./deps/colorize.ts";
import { shuffle } from "./deps/shuffle.ts";
import { readAll } from "./deps/std_io_util.ts";

// deno-fmt-ignore
const helpText = colorize`
Preserve privacy by redacting JSON values.
This script takes UTF-8 JSON over stdin and outputs UTF-8 JSON over stdout.

${["OPTIONS:", "bold"]}

  -h, --help              Show this message.

  -p, --pretty            Pretty-print the output with JSON.stringify.

  -k, --preserve <keys>   Comma-separated list of keys to not redact the value.
                          Eg.  --preserve${["=", "dim"]}code,type,enrollType

  -d, --prune <keys>      Comma-separated list of keys of arrays to prune.
                          Eg.  --prune${["=", "dim"]}devices,deviceGroups,users,userGroups

  -s, --shuffle <keys>    Comma-separated list of keys of arrays to shuffle.
                          Eg.  --shuffle${["=", "dim"]}devices,deviceGroups,users,userGroups

${["NOTES:", "bold"]}

 o  Pruning means each item in an array has between a 10% and 80% chance of
    being removed. This percentage changes between arrays. Note that because
    ${["each element", "italic"]} has a chance of being deleted, you shouldn't use this
    for small arrays.

 o  Preserving a key means its value won't be redacted. If a key is to be
    preserved ${["and", "italic"]} pruned, it will be pruned and the remaining values will not
    be changed.

 o  Pruning arrays uses 'Math.random', so setting the seed with
    'deno run --seed=<seed>' should produce deterministic output (untested)

 o  Pretty-printing is supported using JSON.stringify, but is not recommended.
    Instead, pipe into 'deno fmt --ext=json -' for a nicer looking result.

 o  You can import 'redact' from this module to use it programmatically. See
    the ${["EXAMPLES", "underline"]} section below.

 o  This script requires no permissions, it reads stdin and writes to stdout.


${["EXAMPLES:", "bold"]}

${["POSIX shell (Linux, macOS):", "underline"]}

  ${["$", "dim"]} deno run scripts/redact.js < data.json > anon.json

${["PowerShell (Windows):", "underline"]}

  ${["PS C:\\>", "dim"]} Get-Content data.json | deno run scripts\\redact.js > anon.json

${["Preserve certain keys:", "underline"]}

  ${["$", "dim"]} deno run scripts/redact.js --preserve=teacher,parent < data.json

${["Prune between 10% and 80% of values in specific arrays:", "underline"]}

  ${["$", "dim"]} deno run scripts/redact.js --prune=devices,groups < data.json

${["Format the output:", "underline"]}

  ${["$", "dim"]} deno run scripts/redact.js < data.json | deno fmt --ext=json -

${["Redact data in JavaScript:", "underline"]}

  import { redact } from "./scripts/redact.js";
  redact({ a: "abc", b: "def", c: true }, { preserveKeys: new Set(["a"]) })
  //=> { a: "abc", b: "[redacted]", c: false }

`.slice(1)

export type JSONValue =
	| string
	| number
	| boolean
	| null
	| JSONArray
	| JSONObject;

type JSONArray = JSONValue[];
type JSONObject = { readonly [key: string]: JSONValue };

async function main() {
	const argv = flags.parse(Deno.args, {
		boolean: ["help", "pretty"],
		string: ["preserve", "prune", "shuffle"],
		alias: {
			help: "h",
			pretty: "p",
			preserve: "k",
			prune: "d",
			shuffle: "s",
		},
	});

	const help: boolean = argv.help;
	const pretty: boolean = argv.pretty;
	const preserve: Set<string> = new Set(argv.preserve?.split(","));
	const prune: Set<string> = new Set(argv.prune?.split(","));
	const shuffle: Set<string> = new Set(argv.shuffle?.split(","));

	if (help || Deno.isatty(Deno.stdin.rid)) {
		console.log(helpText);
		Deno.exit(0);
	}

	const stdin = new TextDecoder().decode(await readAll(Deno.stdin));
	const json: JSONObject | JSONArray = JSON.parse(stdin);

	const redactedObject = redact(json, {
		preserveKeys: preserve,
		pruneKeys: prune,
		shuffleKeys: shuffle,
	});
	const redactedText = JSON.stringify(
		redactedObject,
		null, // no replacer
		pretty ? 2 : undefined, // only indent if --pretty
	);

	console.log(redactedText);
	Deno.exit(0);
}

/**
 * Scale a number so that 0 is `min` (0.1) and 1 is `max` (0.8).
 */
function scale(n: number, { min = 0.1, max = 0.8 } = {}) {
	return (max - min) * n + min;
}

type RedactOptions = {
	/**
	 * A set of object keys for which the value will not be redacted.
	 */
	preserveKeys: Set<string>;

	/**
	 * A set of object keys for which, if the value is an array, between 10%
	 * and 80% of the values in the array will be deleted.
	 */
	pruneKeys: Set<string>;

	/**
	 * A set of object keys for which, if the value is an array, the array
	 * will be shuffled.
	 */
	shuffleKeys: Set<string>;
};

/**
 * Recursively replace values in a JSON object with a known value of the same type.
 * This will not mutate the input object.
 *
 * - `null` will not be changed.
 * - Strings will be set to `"[redacted]"`
 * - Numbers will be set to `0`
 * - Booleans will be set to `false`
 * - Arrays will have the values redacted recursively.
 * - Objects will have their items redacted recursively. The keys will not be changed.
 *
 * An options bag can be provided with a set of object keys to preserve (don't redact
 * the value when the key is encountered) and object keys to prune (when the value
 * is an array, prune it).
 *
 * For a pruned array, each value has between a 10% and 80% chance of being removed
 * from the output.
 */
export function redact(item: JSONValue, {
	preserveKeys = new Set(),
	pruneKeys = new Set(),
	shuffleKeys = new Set(),
}: Partial<RedactOptions> = {}): JSONValue {
	const options: RedactOptions = {
		preserveKeys,
		pruneKeys,
		shuffleKeys,
	};
	return redactValue(item, options);
}

function redactValue(item: JSONValue, options: RedactOptions): JSONValue {
	switch (typeof item) {
		case "string": {
			return "[redacted]";
		}
		case "number": {
			return 0;
		}
		case "boolean": {
			return false;
		}
		case "object": {
			if (item === null) {
				return null;
			}
			if (Array.isArray(item)) {
				return redactArray(item, options);
			}
			return redactObject(item, options);
		}
	}
}

function redactArray(item: JSONArray, options: RedactOptions) {
	return item.map((value) => redactValue(value, options));
}

function redactObject(item: JSONObject, options: RedactOptions): JSONObject {
	return collections.mapEntries(item, ([key, value]) => {
		// This percentage is the same for each value in the array, so it
		// can't be generated inside the filter callback.
		const percentChanceToDelete = scale(Math.random());

		// Whether the element should be deleted is also random. Assuming
		// Math.random outputs a uniform distribution of numbers between
		// zero and one, over a large enough array the number of elements
		// deleted will approach percentChanceToDelete. It's less effort :p
		const filtered = options.pruneKeys.has(key) && Array.isArray(value)
			? value.filter(() => Math.random() > percentChanceToDelete)
			: value;

		const shuffled = options.shuffleKeys.has(key) && Array.isArray(filtered)
			? shuffle(filtered)
			: filtered;

		return options.preserveKeys.has(key)
			? [key, shuffled]
			: [key, redactValue(shuffled, options)];
	});
}

if (import.meta.main) {
	await main();
}
