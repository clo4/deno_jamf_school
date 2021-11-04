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

	/** Whether the users in this group are parents. */
	readonly isParentGroup: boolean | null;

	/** Whether the users in this group are teachers. */
	readonly isTeacherGroup: boolean | null;

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

	/**
	 * (Edit) Set this user group's description.
	 *
	 * This method will not update the object. To update it, call
	 * `UserGroup.update()`.
	 */
	setName(name: string): Promise<this>;

	/**
	 * (Edit) Set this user group's description.
	 *
	 * This method will not update the object. To update it, call
	 * `UserGroup.update()`.
	 */
	setDescription(text: string): Promise<this>;

	/**
	 * (Edit) Set whether the users in this group are parents.
	 *
	 * A value of `true` indicates that users in this group are
	 * parents. `false` indicates that they are not. Using `null`
	 * means the users will inherit their status.
	 *
	 * This method will not update the object. To update it, call
	 * `UserGroup.update()`.
	 */
	setParentGroup(status: boolean | null): Promise<this>;

	/**
	 * (Edit) Set whether the users in this group are teachers.
	 *
	 * A value of `true` indicates that users in this group are
	 * teachers. `false` indicates that they are not. Using `null`
	 * means the users will inherit their status.
	 *
	 * This method will not update the object. To update it, call
	 * `UserGroup.update()`.
	 */
	setTeacherGroup(status: boolean | null): Promise<this>;
}
