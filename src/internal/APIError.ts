import { STATUS_TEXT } from "../deps/std_http_status.ts";

// APIError: POST /devices/2097209720972/wipe returned 404 Not Found, with the following data:
export class APIError extends Error {
	constructor(
		init: {
			status: number;
			statusText: string;
			route: string;
			text: string;
			method: string;
		},
	) {
		const { status, statusText, route, text, method } = init;
		super(
			`${method} ${route} returned ${status} ${statusText} with this data: ${text}`,
		);
		this.name = this.constructor.name;
		Error.captureStackTrace?.(this, this.constructor);
	}

	/**
	 * Constructors can't be async, so we need to use an async function to
	 * construct the error. It offloads the work of formatting everything to the
	 * error itself, less code at the call site.
	 */
	static async of(
		init: { request: Request; response: Response },
	): Promise<APIError> {
		const { response, request } = init;
		return new APIError({
			status: response.status,
			statusText: STATUS_TEXT.get(response.status) ?? "",
			text: await response.text(),
			method: request.method,
			route: new URL(request.url).pathname,
		});
	}
}

// Everything this function does could be done better by a decorator.
/**
 * Return `value` if `error` is an `APIError`, otherwise throw `error`.
 *
 * JavaScript (or at least V8, not sure if this is in the spec) captures
 * the stack on error instantiation instead of when it's thrown, so re-throwing
 * it won't touch the trace.
 */
export function suppressAPIError<T>(value: T, error: unknown): T {
	if (!(error instanceof APIError)) {
		throw error;
	}
	return value;
}
