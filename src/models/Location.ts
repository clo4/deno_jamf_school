import type { Device } from "./Device.ts";
import type { DeviceGroup } from "./DeviceGroup.ts";
import type { User } from "./User.ts";
import type { UserGroup } from "./UserGroup.ts";
import type { App } from "./App.ts";

export interface Location {
	/** The ID of this location, starting from zero. */
	readonly id: number;

	/** Whether this location is a district. */
	readonly isDistrict: boolean;

	/** The street this location is on (null if empty) */
	readonly streetName: string | null;

	/** The street number this location is at (null if empty) */
	readonly streetNumber: string | null;

	/** The post code this location is in (null if empty) */
	readonly postalCode: string | null;

	/** The city this location is in (null if empty) */
	readonly city: string | null;

	/** The number assigned to this school in the Jamf School web interface. */
	readonly schoolNumber: string | null;

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
}
