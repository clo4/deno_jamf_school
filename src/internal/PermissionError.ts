import { assert } from "../deps/std_testing_asserts.ts";

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
