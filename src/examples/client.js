import * as jamf from "../mod.ts";

/**
 * Get an environment variable, fail if it's empty or doesn't exist
 * @param {String} key The key to get
 */
function requireEnv(key) {
	const val = Deno.env.get(key);
	if (!val) {
		throw new Error(`Missing a required environment variable: ${key}`);
	}
	return val;
}

export const client = jamf.createClient({
	id: requireEnv("JAMF_SCHOOL_ID"),
	token: requireEnv("JAMF_SCHOOL_TOKEN"),
	url: requireEnv("JAMF_SCHOOL_URL"),
});
