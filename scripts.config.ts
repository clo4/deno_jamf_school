import type { DenonConfig } from "https://deno.land/x/denon@2.4.8/mod.ts";

const config: DenonConfig = {
	scripts: {
		fmt: {
			cmd: "dprint fmt",
			desc: "Format files",
		},
	},
};

export default config;
