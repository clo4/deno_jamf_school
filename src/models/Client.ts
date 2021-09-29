import type { APIData } from "./API.ts";
import type { Device } from "./Device.ts";
import type { DeviceGroup } from "./DeviceGroup.ts";
import type { User } from "./User.ts";
import type { UserGroup } from "./UserGroup.ts";
import type { Location } from "./Location.ts";
import type { App } from "./App.ts";

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
	 * If you don't already have the data, you may want `getDeviceById`,
	 * `getDeviceBySerialNumber`, or `getDevices`.
	 */
	createDevice(data: APIData["getDevices"][number]): Device;

	/**
	 * Create a device group object with data from the API.
	 *
	 * If you don't already have the data, you may want `getDeviceGroupById` or
	 * `getDeviceGroups`.
	 */
	createDeviceGroup(data: APIData["getDeviceGroup"]): DeviceGroup;

	/**
	 * Create a user object with data from the API.
	 *
	 * If you don't already have the data, you may want `getUserById` or
	 * `getUsers`.
	 */
	createUser(data: APIData["getUser"]): User;

	/**
	 * Create an app object with data from the API.
	 *
	 * If you don't already have the data, you may want `getApps`.
	 */
	createApp(data: APIData["getApps"][number]): App;

	/**
	 * Create a site object with data from the API.
	 *
	 * If you don't already have the data, you may want `getLocations`.
	 */
	createLocation(data: APIData["getLocation"]): Location;

	/**
	 * Create a user group object with data from the API.
	 *
	 * If you don't already have the data, you may want `getUserGroupById` or
	 * `getUserGroups`.
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

	/** (Read) Get all the apps registered to this Jamf School instance. */
	getApps(): Promise<App[]>;

	/** (Read) Get a single app by its Jamf School ID. */
	getAppById(id: number): Promise<App | null>;

	/**
	 * (Read) Get a single app by its bundle identifier
	 *
	 * If no apps with the given bundle ID exist, it returns null.
	 * If more than one exists, an error is thrown.
	 *
	 * For example, `"com.agilebits.onepassword-ios"`
	 */
	getAppByBundleId(bundleId: string): Promise<App | null>;

	/**
	 * (Read) Get a single app by its name.
	 *
	 * If no apps with the name exist, it returns null.
	 * If more than one app exists, an error is thrown.
	 */
	getAppByName(name: string): Promise<App | null>;

	/** (Read) Get all locations. */
	getLocations(): Promise<Location[]>;

	/** (Read) Get a location by its ID. */
	getLocationById(id: number): Promise<Location | null>;

	/** (Read) Get a location by its name. */
	getLocationByName(name: string): Promise<Location | null>;
}
