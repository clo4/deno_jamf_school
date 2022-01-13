import { tagApply } from "https://crux.land/tag_apply@1.0.0";
import * as colors from "https://deno.land/std@0.121.0/fmt/colors.ts";

type Colors = typeof colors;
type ColorsItems = keyof Colors;

type TextStyle = {
	[K in ColorsItems]: Colors[K] extends (str: string) => string ? K
		: never;
}[ColorsItems];

/** Colorize text (if appropriate to do so) */
export const colorize = tagApply<[string, ...TextStyle[]], string>(
	([string, ...names]) =>
		!Deno.noColor && Deno.isatty(Deno.stdout.rid)
			? names.reduce((str, color) => colors[color](str), string)
			: string,
);

const { debug, log, info, warn, error } = console;

/** Adds prefixes to the console logging functions. */
export function colorizeConsole() {
	const [preDebug, preLog, preInfo, preWarn, preError] = colorize`
${["Debug", "magenta"]}
${["Log", "cyan"]}
${["Info", "yellow"]}
${["Warn", "red"]}
${[" Error ", "bgRed"]}
`.trim().split("\n").map((line) => line.trimStart());

	console.debug = debug.bind(console, preDebug);
	console.log = log.bind(console, preLog);
	console.info = info.bind(console, preInfo);
	console.warn = warn.bind(console, preWarn);
	console.error = error.bind(console, preError);
}

export function restoreConsole() {
	console.debug = debug;
	console.info = info;
	console.log = log;
	console.warn = warn;
	console.error = error;
}
