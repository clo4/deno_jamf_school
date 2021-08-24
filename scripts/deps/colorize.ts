import { tagApply } from "https://crux.land/tag_apply@1.0.0";
import * as colors from "https://deno.land/std@0.106.0/fmt/colors.ts";

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
