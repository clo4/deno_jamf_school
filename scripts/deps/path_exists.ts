/**
 * Test whether or not the given path exists by checking with the file system
 *
 * This function was deprecated in deno_std due to TOCTTOU concerns, but that's
 * not a problem in this context. `exists` is being used to verify that a file
 * that _should_ exist actually _does_ exist.
 */
export async function exists(filePath: string): Promise<boolean> {
	try {
		await Deno.lstat(filePath);
		return true;
	} catch {
		return false;
	}
}
