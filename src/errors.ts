import { STATUS_TEXT } from "./deps/std_http_status.ts";
import { assert } from "./deps/std_testing_asserts.ts";

const permissionMethodMap = {
	GET: "Read",
	POST: "Add",
	PUT: "Edit",
	DELETE: "Delete",
} as const;

type PermissionErrorInit = {
	method: string;
	endpoint: string;
};

export class PermissionError extends Error {
	method: string;
	endpoint: string;

	constructor({ method, endpoint }: PermissionErrorInit) {
		method = method.toUpperCase();

		// dprint-ignore
		assert(method === "GET" || method === "PUT" || method === "POST" || method === "DELETE");
		const permission = permissionMethodMap[method];

		// dprint-ignore
		super(`Your API key requires the '${permission}' permission for ${method} ${endpoint}`);
		this.name = this.constructor.name;
		Error.captureStackTrace?.(this, this.constructor);
		this.method = method;
		this.endpoint = endpoint;
	}
}

// APIError: POST /devices/2097209720972/wipe returned 404 Not Found, with the following data:
export class APIError extends Error {
	private constructor(
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
