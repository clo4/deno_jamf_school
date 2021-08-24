export function relativeTextFileReader(base: string) {
	return async (path: string) => {
		const url = new URL(path, base);
		return await Deno.readTextFile(url);
	};
}
