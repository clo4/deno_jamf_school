import * as glob from "./deps/std_fs_expand_glob.ts";
import * as path from "./deps/std_path.ts";
import * as flags from "./deps/std_flags.ts";
import * as log from "./deps/std_log.ts";
import { assert, equal } from "./deps/std_testing_asserts.ts";
import { exists } from "./deps/path_exists.ts";

// 1. Hash all the rendered markdown files
// 2. Render the templates again
// 3. Hash all of them again
// 4. Compare each hash

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
			formatter: ({ loggerName, levelName, msg }) => {
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

Deno.chdir(repoRoot);

const templateExtension = ".tpl.md";
const renderedExtension = ".md";

// Changes .tpl.md to .md
const removeTplFromExtension = (tplPath: string) => {
	assert(tplPath.endsWith(templateExtension));
	const lengthWithoutTplMd = tplPath.length - templateExtension.length;
	const pathWithoutExtension = tplPath.slice(0, lengthWithoutTplMd);
	return pathWithoutExtension + renderedExtension;
};

logger.info("Finding files with .tpl.md extension");

/** A map of .tpl.md -> .md */
const filePathMap = new Map(
	[...glob.expandGlobSync("**/*.tpl.md")]
		// Don't care about anything that isn't a file, including symlinks
		.filter((entry) => entry.isFile)
		// Change .tpl.md to .md
		.map((entry) => [entry.path, removeTplFromExtension(entry.path)] as const),
);

// Verify that all the expected .md files exist
for (const [tplPath, mdPath] of filePathMap) {
	logger.debug(`Expecting to find ${repo(mdPath)}  (from ${repo(tplPath)})`);

	const mdPathExists = await exists(mdPath);
	if (!mdPathExists) {
		logger.error(`No file at ${repo(mdPath)}`);
		Deno.exit(1);
	}
}

/** Get a map of .md -> hash */
async function hashRenderedMdFiles() {
	const hashing = [...filePathMap].map(async ([_, mdPath]) => {
		const mdContent = await Deno.readFile(mdPath);
		const mdContentHash = await crypto.subtle.digest("SHA-256", mdContent);
		return [mdPath, mdContentHash] as const;
	});

	return new Map(await Promise.all(hashing));
}

// 1. Hash all the files
logger.info("Hashing files");
const beforeHashes = await hashRenderedMdFiles();

// 2. Render the templates
const scriptPath = path.join(thisDir, "render.ts");
logger.info(`Running ${repo(scriptPath)}`);
const status = await Deno.run({
	cmd: [
		"deno",
		"run",
		"--no-check",
		"--quiet",
		"--allow-read",
		"--allow-write",
		scriptPath,
		`--log-level=debug`,
	],
}).status();

// 2.a. If rendering failed, exit 1
if (!status.success) {
	logger.error(`${repo(scriptPath)} exited with a non-zero status code`);
	Deno.exit(1);
}

// 3. Hash the files again
logger.info("Hashing files again");
const afterHashes = await hashRenderedMdFiles();

// 4. Compare the hashes
if (!equal(beforeHashes, afterHashes)) {
	logger.error("Hashes are unequal. Templates must be rendered before pushing.");
	Deno.exit(1);
}

logger.info("All hashes are equal");
