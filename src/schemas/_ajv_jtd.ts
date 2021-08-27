// NOTE: AJV is a development dependency, it is completely absent at runtime.
// However, it is still (indirectly) referenced by schemas/mod.ts, thus
// required for correct typing. Importing schemas/mod.bundle.js with
// `deno run --no-check` will never evaluate or parse this.

import Ajv from "../deps/ajv_jtd.ts";
export * from "../deps/ajv_jtd.ts";

/** Singleton instance of `Ajv` */
export default new Ajv({
	allErrors: true,
	messages: true,
	code: {
		source: true,
	},
});
