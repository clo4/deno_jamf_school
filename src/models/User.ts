import type { Device } from "./Device.ts";
import type { UserGroup } from "./UserGroup.ts";
import type { Location } from "./Location.ts";

/**
 * User represents a single user.
 */
export interface User {
	/** Discriminator for type checks. */
	readonly type: "User";

	/** The Jamf-assigned ID of the user. */
	readonly id: number;

	/** The user's email address. */
	readonly email: string;

	/** The username of the user. */
	readonly username: string;

	/** The user's domain, if they were imported from a LDAP server. */
	readonly domain: string;

	/** The user's full name. */
	readonly name: string;

	/** The user's first name.*/
	readonly firstName: string;

	/** The user's last name.*/
	readonly lastName: string;

	/** Additional notes associated with the user. */
	readonly notes: string;

	/** Whether the user is in the trash (deleted). */
	readonly isTrashed: boolean;

	/** Whether the user is excluded from teacher restrictions. */
	readonly isExcludedFromRestrictions: boolean;

	/**
	 * (Read) Update this user's data.
	 *
	 * Other users created from the same data will not be updated.
	 */
	update(): Promise<this>;

	/** (Read) Get all the devices assigned to this user. */
	getDevices(): Promise<Device[]>;

	/** (Read) Get all the groups the user is in. */
	getGroups(): Promise<UserGroup[]>;

	/** (Read) Get the location this user belongs to. */
	getLocation(): Promise<Location | null>;
}
