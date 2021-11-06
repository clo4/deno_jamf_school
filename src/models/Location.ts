import type { Device } from "./Device.ts";
import type { DeviceGroup } from "./DeviceGroup.ts";
import type { User } from "./User.ts";
import type { UserGroup } from "./UserGroup.ts";
import type { App } from "./App.ts";

/**
 * Location represents a physical site. All data in Jamf School must be
 * assigned to a location. Locations are able to get the data that is assigned
 * to them.
 *
 * Many of the properties are nullable because the only required field when
 * creating a location is its name.
 */
export interface Location {
	/** Discriminator for type checks. */
	readonly type: "Location";

	/** The ID of this location, starting from zero. */
	readonly id: number;

	/** The name of the location. */
	readonly name: string;

	/** Whether this location is a district. */
	readonly isDistrict: boolean;

	/** The street this location is on. */
	readonly streetName: string | null;

	/** The street number this location is at. */
	readonly streetNumber: string | null;

	/** The post code this location is in. */
	readonly postalCode: string | null;

	/** The city this location is in. */
	readonly city: string | null;

	/** The ID this location is assigned in Apple School Manager. */
	readonly asmIdentifier: string | null;

	/**
	 * The number assigned to this school. This data is arbitrary and may not
	 * necessarily be a numeric string.
	 */
	readonly schoolNumber: string | null;

	/** Return the data used to create this object. */
	toJSON(): unknown;

	/** The name of the location. */
	toString(): string;

	/** (Read) Get all devices that belong to this location. */
	getDevices(): Promise<Device[]>;

	/** (Read) Get all device groups that belong to this location. */
	getDeviceGroups(): Promise<DeviceGroup[]>;

	/** (Read) Get all users that belong to this location. */
	getUsers(): Promise<User[]>;

	/** (Read) Get all user groups that belong to this location. */
	getUserGroups(): Promise<UserGroup[]>;

	/** (Read) Get all apps that belong to this location. */
	getApps(): Promise<App[]>;

	/**
	 * (Read) Update this location's data.
	 *
	 * Other locations created from this data will not be updated.
	 */
	update(): Promise<this>;

	/**
	 * (Edit) Move devices to this location.
	 *
	 * This will also move the device's owner and any other devices they own.
	 *
	 * Devices already in this location will not be affected.
	 */
	moveDevices(devices: { udid: string }[]): Promise<this>;

	/**
	 * (Edit) Move users and their devices to this location.
	 *
	 * Users already in this location will not be affected.
	 */
	moveUsers(users: { id: number }[]): Promise<this>;
}
