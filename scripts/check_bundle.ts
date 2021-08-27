import * as hash from "./deps/std_hash.ts";
import * as path from "./deps/std_path.ts";
import * as flags from "./deps/std_flags.ts";
import * as log from "./deps/std_log.ts";
import { equal } from "./deps/std_testing_asserts.ts";

const { log: logArg } = flags.parse(Deno.args, {
	string: ["log"],
	default: { "log": "INFO" },
});

await log.setup({
	loggers: {
		validator: {
			level: logArg,
			handlers: ["console"],
		},
	},
	handlers: {
		console: new log.handlers.ConsoleHandler("DEBUG", {
			formatter: (record) => {
				const { loggerName, levelName, msg } = record;
				return `${loggerName} ${levelName.toLowerCase()}: ${msg}`;
			},
		}),
	},
});

const logger = log.getLogger("validator");

const thisFile = path.fromFileUrl(import.meta.url);
const thisDir = path.dirname(thisFile);
const repoRoot = path.dirname(thisDir);
const repo = (p: string) => p.slice(repoRoot.length + 1);

const bundlePath = path.join(repoRoot, "src", "schemas", "mod.bundle.js");

logger.info("Hashing bundle");
const beforeHash = hash.createHash("md5")
	.update(await Deno.readTextFile(bundlePath))
	.digest();

const scriptPath = path.join(thisDir, "bundle.ts");
logger.info(`Running ${repo(scriptPath)}`);
const status = await Deno.run({
	cmd: [
		"deno",
		"run",
		"--no-check",
		"--quiet",
		"--unstable",
		"--allow-all",
		path.join(thisDir, "bundle.ts"),
		`--log=${logArg}`,
	],
}).status();

if (!status.success) {
	logger.error(`${repo(scriptPath)} exited with a non-zero status code`);
	Deno.exit(1);
}

logger.info("Hashing bundle again");
const afterHash = hash.createHash("md5")
	.update(await Deno.readTextFile(bundlePath))
	.digest();

if (!equal(beforeHash, afterHash)) {
	logger.error("Hashes are unequal. Schemas must be bundled before committing.");
	logger.error("$ deno run --unstable --allow-all ./scripts/bundle.ts");
	Deno.exit(1);
}

logger.info("Hashes are equal");
