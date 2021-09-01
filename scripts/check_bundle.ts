import * as hash from "./deps/std_hash.ts";
import * as path from "./deps/std_path.ts";
import { equal } from "./deps/std_testing_asserts.ts";

const thisFile = path.fromFileUrl(import.meta.url);
const thisDir = path.dirname(thisFile);
const repoRoot = path.dirname(thisDir);
const repo = (p: string) => p.slice(repoRoot.length + 1);

const bundlePath = path.join(repoRoot, "src", "schemas", "mod.bundle.js");

console.info("Hashing bundle");
const beforeHash = hash.createHash("md5")
	.update(await Deno.readTextFile(bundlePath))
	.digest();

const scriptPath = path.join(thisDir, "bundle.ts");
console.info(`Running ${repo(scriptPath)}`);
console.log();
const status = await Deno.run({
	cmd: [
		"deno",
		"run",
		"--no-check",
		"--quiet",
		"--unstable",
		"--allow-all",
		path.join(thisDir, "bundle.ts"),
	],
}).status();
console.log();

if (!status.success) {
	console.error(`${repo(scriptPath)} exited with a non-zero status code`);
	Deno.exit(1);
}

console.info("Hashing bundle again");
const afterHash = hash.createHash("md5")
	.update(await Deno.readTextFile(bundlePath))
	.digest();

if (!equal(beforeHash, afterHash)) {
	console.error("Hashes are unequal. Schemas must be bundled before committing.");
	console.error("$ deno run --unstable --allow-all ./scripts/bundle.ts");
	Deno.exit(1);
}

console.info("Hashes are equal");
