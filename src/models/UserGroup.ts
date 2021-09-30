import type { User } from "./User.ts";
import type { Location } from "./Location.ts";

/**
 * UserGroup represents a named group of users.
 */
export interface UserGroup {
	/** Discriminator for type checks. */
	readonly type: "UserGroup";

	/** The ID of the user group. */
	readonly id: number;

	/** The name of the user group. */
	readonly name: string;

	/** A description of the user group (may be empty) */
	readonly description: string;

	/** Return the data used to create this object. */
	toJSON(): unknown;

	/** The name of the user group. */
	toString(): string;

	/**
	 * (Read) Update this user group's data.
	 *
	 * Other user groups created from the same data will not be updated.
	 */
	update(): Promise<this>;

	/** (Read) Get all the users in the user group. */
	getUsers(): Promise<User[]>;

	/** (Read) Get the location this user group belongs to. */
	getLocation(): Promise<Location | null>;
}
