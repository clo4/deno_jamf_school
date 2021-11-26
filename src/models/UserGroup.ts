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

	/** The ID of this user group's location. */
	readonly locationId: number;

	/** Return the data used to create this object. */
	toJSON(): unknown;

	/** The name of the user group. */
	toString(): string;

	/**
	 * (Read) Update this user group's data.
	 *
	 * Other user groups created from the same data will not be updated.
	 */
	update(): Promise<void>;

	/** (Read) Get all the users in the user group. */
	getUsers(): Promise<User[]>;

	/** (Read) Get the location this user group belongs to. */
	getLocation(): Promise<Location | null>;

	/**
	 * (Edit) Set this user group's description.
	 *
	 * This method will not update the object. To update it, call
	 * `UserGroup.update()`.
	 *
	 * This method is a no-op if the name is the same as the user group's
	 * current name.
	 */
	setName(name: string): Promise<void>;

	/**
	 * (Edit) Set this user group's description.
	 *
	 * This method will not update the object. To update it, call
	 * `UserGroup.update()`.
	 *
	 * This method is a no-op if the description is the same as the user group's
	 * current description.
	 */
	setDescription(text: string): Promise<void>;

	/**
	 * (Edit) Set whether the users in this group are parents.
	 *
	 * A value of `true` indicates that users in this group are
	 * parents. `false` indicates that they are not. Using `null`
	 * means the users will inherit their status.
	 *
	 * This method will not update the object. To update it, call
	 * `UserGroup.update()`.
	 *
	 * This method is a no-op if the user group is already a parent group.
	 */
	setParentGroup(status: boolean | null): Promise<void>;

	/**
	 * (Edit) Set whether the users in this group are teachers.
	 *
	 * A value of `true` indicates that users in this group are
	 * teachers. `false` indicates that they are not. Using `null`
	 * means the users will inherit their status.
	 *
	 * This method will not update the object. To update it, call
	 * `UserGroup.update()`.
	 *
	 * This method is a no-op if the user group is already a teacher group.
	 */
	setTeacherGroup(status: boolean | null): Promise<void>;
}
