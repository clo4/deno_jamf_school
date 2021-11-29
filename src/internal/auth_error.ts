export class AuthError extends Error {
	constructor() {
		super(`Your API token or network ID was invalid`);
		this.name = this.constructor.name;
		Error.captureStackTrace?.(this, this.constructor);
	}
}
