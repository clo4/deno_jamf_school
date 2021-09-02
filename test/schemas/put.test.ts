import * as schemasJIT from "../../src/schemas/mod.ts";
import * as schemasAOT from "../../src/schemas/mod.bundle.js";
import { relativeTextFileReader } from "../deps/read_relative_file.ts";

const readRelativeTextFile = relativeTextFileReader(import.meta.url);

Deno.test("schemas/assertValid: PUT /devices/:udid/owner (200 OK)", async () => {
	const json = await readRelativeTextFile(
		"../example_data/PUT_devices_udid_owner__200.json",
	);
	schemasJIT.assertValid("PUT /devices/:udid/owner", JSON.parse(json));
	schemasAOT.assertValid("PUT /devices/:udid/owner", JSON.parse(json));
});
