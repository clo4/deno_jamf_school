import { bench, runBenchmarks } from "../deps/std_testing_bench.ts";
import { relativeTextFileReader } from "../deps/read_relative_file.ts";
import * as schemas from "../../src/schemas/mod.ts";

const readRelativeTextFile = relativeTextFileReader(import.meta.url);
const devices = await readRelativeTextFile("../example_data/GET_devices__200.json");
const devicesApps = await readRelativeTextFile(
	"../example_data/GET_devices__200__apps.json",
);

bench({
	name: "GET /devices",
	runs: 1000,
	func(timer) {
		timer.start();
		schemas.assertValid("GET /devices", JSON.parse(devices));
		timer.stop();
	},
});

bench({
	name: "GET /devices (with apps)",
	runs: 1000,
	func(timer) {
		timer.start();
		schemas.assertValid("GET /devices", JSON.parse(devicesApps));
		timer.stop();
	},
});

await runBenchmarks();
