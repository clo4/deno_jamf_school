import type { APIData } from "./API.ts";
import type { Device } from "./Device.ts";
import type { DeviceGroup } from "./DeviceGroup.ts";
import type { User } from "./User.ts";
import type { UserGroup } from "./UserGroup.ts";

/**
 * A high-level abstraction over the Jamf School API that allows you to reason
 * about data as objects with methods.
 *
 * As the implementations of these objects are not public, instance checks must
 * be done using the `type` property on each object.
 *
 * Lower-level actions can be done using an `API` object. This data can be
 * upgraded to an object using one of the create-methods on the `Client`.
 */
export interface Client {
	/** Discriminator for type checks. */
	readonly type: "Client";

	/**
	 * Create a device object with data from the API.
	 *
	 * If you don't already have the data, you may want `getDeviceById` or
	 * `getDeviceBySerialNumber`.
	 */
	createDevice(data: APIData["getDevices"][number]): Device;

	/**
	 * Create a device group object with data from the API.
	 *
	 * If you don't already have the data, you may want `getDeviceGroupById`.
	 */
	createDeviceGroup(data: APIData["getDeviceGroup"]): DeviceGroup;

	/**
	 * Create a user object with data from the API.
	 *
	 * If you don't already have the data, you may want `getUserById`.
	 */
	createUser(data: APIData["getUser"]): User;

	/**
	 * Create a user group object with data from the API.
	 *
	 * If you don't already have the data, you may want `getUserGroupById`.
	 */
	createUserGroup(data: APIData["getUserGroup"]): UserGroup;

	/** (Read) Get a single user by their ID. */
	getUserById(id: number): Promise<User | null>;

	/** (Read) Get all users. */
	getUsers(): Promise<User[]>;

	/** (Read) Get a single user group by its ID. */
	getUserGroupById(id: number): Promise<UserGroup | null>;

	/** (Read) Get a single user group by its name. */
	getUserGroupByName(name: string): Promise<UserGroup | null>;

	/** (Read) Get all user groups. */
	getUserGroups(): Promise<UserGroup[]>;

	/** (Read) Get a single device by its UDID. */
	getDeviceById(udid: string): Promise<Device | null>;

	/** (Read) Get a single device by its serial number. */
	getDeviceBySerialNumber(serialNumber: string): Promise<Device | null>;

	/** (Read) Get all devices. */
	getDevices(): Promise<Device[]>;

	/**
	 * (Read) Get all devices in the given groups.
	 *
	 * This is a far more efficient method than calling `getDevices` on
	 * each `DeviceGroup` and checking for uniqueness.
	 */
	getDevicesInGroups(deviceGroups: DeviceGroup[]): Promise<Device[]>;

	/** (Read) Get a single device group by its ID. */
	getDeviceGroupById(id: number): Promise<DeviceGroup | null>;

	/** (Read) Get a single device group by its name. */
	getDeviceGroupByName(name: string): Promise<DeviceGroup | null>;

	/** (Read) Get all device groups. */
	getDeviceGroups(): Promise<DeviceGroup[]>;
}
