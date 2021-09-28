import * as schemasJIT from "../../src/schemas/mod.ts";
import * as schemasAOT from "../../src/schemas/mod.bundle.js";

/** Assert valid using both the bundled AND runtime schemas modules. */
export const assertValid: typeof schemasJIT.assertValid = (key, data) => {
	schemasJIT.assertValid(key, data);
	schemasAOT.assertValid(key, data);
};
