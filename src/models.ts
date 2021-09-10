import type { RouteData } from "./schemas/mod.ts";

// Large swathes of this file are currently commented because the
// implementation is either non-existent or untested.

/**
 * A low-level wrapper over the Jamf School API. It serves as a replacement
 * to manually making requests. It performs data validation error handling.
 * Network errors, validation errors, and permission errors will all be raised.
 *
 * Unfortunately, the data returned by these methods cannot be explored through
 * doc.deno.land due to limitations with `deno doc`, as it would require a full
 * TypeScript implementation to evaluate the types.
 *
 * Instead, the best solution is to browse https://deno.land/x/jamf_school/schemas
 * (each file has a `ResponseData` type) or to use the Deno language service in
 * your editor.
 */
export interface API {
	/** Discriminator for type checks. */
	readonly type: "API";

	/** (Read) Get a single device by its UDID. */
	getDevice(
		udid: string,
		options?: APIGetDeviceOptions,
	): Promise<RouteData<"GET /devices/:udid">["device"]>;

	/** (Read) Get all devices. */
	getDevices(
		options?: APIGetDevicesOptions,
	): Promise<RouteData<"GET /devices">["devices"]>;

	/**
	 * (Edit) Assign a new owner to a device. Using ID 0 will remove
	 * the owner without setting a new one.
	 */
	assignDeviceOwner(
		udid: string,
		userId: number,
	): Promise<RouteData<"PUT /devices/:udid/owner">>;

	// /**
	//  * (Edit) Move the device and its owner to a new location.
	//  *
	//  * The device owner will also be moved if `onlyDevice` is not `true`.
	//  */
	// moveDevice(
	// 	udid: string,
	// 	init: APIMoveDeviceInit,
	// ): Promise<RouteData<"PUT /devices/:udid/migrate">>;

	// /**
	//  * (Edit) Move a collection of devices to a new location.
	//  *
	//  * The device owners will also be moved if `onlyDevice` is not `true`.
	//  */
	// moveDevices(
	// 	init: APIMoveDevicesInit,
	// ): Promise<RouteData<"PUT /devices/migrate">>;

	// /**
	//  * (Add) Clear the device's activation lock.
	//  *
	//  * If a device is activation locked, the device is tied to the Apple ID
	//  * that is signed in. After wiping, the same Apple ID must be used to sign
	//  * in. Clearing the activation lock allows you to use any ID, or skip the
	//  * sign-in step entirely.
	//  */
	// clearDeviceActivationLock(
	// 	udid: string,
	// ): Promise<RouteData<"POST /devices/:udid/activationlock/clear">>;

	/** (Add) Schedule the device to restart.  */
	restartDevice(
		udid: string,
		options?: APIRestartDeviceOptions,
	): Promise<RouteData<"POST /devices/:udid/restart">>;

	// /** (Add) Update the device's asset tag or notes. */
	// updateDeviceDetails(
	// 	udid: string,
	// 	options: APIUpdateDeviceDetailsOptions,
	// ): Promise<RouteData<"POST /devices/:udid/details">>;

	// /**
	//  * (Add) Schedule refreshing the device's inventory, optionally clearing
	//  * errors such as app installation failures.
	//  */
	// refreshDeviceInventory(
	// 	udid: string,
	// 	options?: APIRefreshDeviceInventoryOptions,
	// ): Promise<RouteData<"POST /devices/:udid/refresh">>;

	/**
	 * (Add) Schedule wiping a device of all its data, without changing the user
	 * the device is assigned to in Jamf School.
	 */
	wipeDevice(
		udid: string,
		options?: APIWipeDeviceOptions,
	): Promise<RouteData<"POST /devices/:udid/wipe">>;

	// /**
	//  * (Add) Schedule restoring the device.
	//  */
	// // TODO: figure out wtf this does
	// restoreDevice(
	// 	udid: string,
	// ): Promise<RouteData<"POST /devices/:udid/restore">>;

	// /**
	//  * (Add) Schedule removal of the Jamf School management profile from the
	//  * device.
	//  */
	// unenrollDevice(
	// 	udid: string,
	// ): Promise<RouteData<"POST /devices/:udid/unenroll">>;

	// /** (Add) Schedule updating the device's eSIM cellular plan information. */
	// updateDeviceCellularPlan(
	// 	udid: string,
	// 	init: APIUpdateDeviceCellularPlanInit,
	// ): Promise<RouteData<"POST /devices/:udid/cellularPlan">>;

	// /**
	//  * (Delete) Trash a device.
	//  *
	//  * Trashing a device revokes its license.
	//  */
	// trashDevice(
	// 	udid: string,
	// ): Promise<RouteData<"DELETE /devices/:udid">>;

	/** (Read) Get a single device group by its ID. */
	getDeviceGroup(
		id: number,
	): Promise<RouteData<"GET /devices/groups/:id">["deviceGroup"]>;

	/** (Read) Get all device groups. */
	getDeviceGroups(): Promise<RouteData<"GET /devices/groups">["deviceGroups"]>;

	/** (Read) Get a single user by their ID. */
	getUser(id: number): Promise<RouteData<"GET /users/:id">["user"]>;

	/** (Read) Get all users. */
	getUsers(): Promise<RouteData<"GET /users">["users"]>;

	// /** (Add) Update existing users and add new users in bulk. */
	// bulkUserUpdate(
	// 	users: APIUserDataBulkUpdate[],
	// ): Promise<RouteData<"POST /users/bulk">>;

	// /** (Add) Create a new user. */
	// createUser(
	// 	data: APIUserData,
	// ): Promise<RouteData<"POST /users">>;

	// /** (Edit) Update an existing user's details. */
	// updateUser(
	// 	id: number,
	// 	data: Partial<APIUserData>,
	// ): Promise<RouteData<"PUT /users/:id">>;

	// /** (Delete) Move an existing user to the trash. */
	// trashUser(
	// 	id: number,
	// ): Promise<RouteData<"DELETE /users/:id">>;

	// /** (Edit) Set a new password for the given user. */
	// setUserPassword(
	// 	id: number,
	// 	password: string,
	// ): Promise<RouteData<"PUT /users/:id/password">>;

	// /** (Edit) Move the user and their devices to a new location. */
	// moveUser(
	// 	id: number,
	// 	init: APIMoveUserInit,
	// ): Promise<RouteData<"PUT /users/:id/migrate">>;

	/** (Read) Get a single user group by their ID. */
	getUserGroup(
		id: number,
	): Promise<RouteData<"GET /users/groups/:id">["group"]>;

	/** (Read) Get all user groups. */
	getUserGroups(): Promise<RouteData<"GET /users/groups">["groups"]>;

	/** (Read) Get all apps. */
	getApps(): Promise<RouteData<"GET /apps">["apps"]>;
}

/** Helper type to map from API method name to the method's return type. */
export type APIData = {
	// deno-lint-ignore no-explicit-any
	[K in keyof API]: ReturnType<Extract<API[K], (...args: any) => any>> extends
		Promise<infer T> ? T : never;
};

export type APIGetDeviceOptions = {
	/**
	 * Specify whether the API should include apps in the output.
	 * Apps will be included unless `false` is provided.
	 */
	includeApps?: boolean;
};

// Some of the names of the options are different, because the API is bad and
// inconsistent. Have I said that enough yet? Anyway, implementations are
// expected to adapt these options to the _actual_ names.
export type APIGetDevicesOptions = {
	/**
	 * Specify whether each device should include its apps in the response.
	 * Apps will not be included in the response unless this is `true`.
	 *
	 * If you have a lot of devices with a lot of apps, this may substantially
	 * increase the size of the response. As such, on slow internet connections,
	 * this may cause the response to time out.
	 */
	includeApps?: boolean;

	/**
	 * Select a single device by its serial number (case insensitive). The
	 * serial number must be complete; it cannot be partial.
	 */
	serialNumber?: string;

	/**
	 * Select only devices that match a given asset tag.
	 * ```
	 * { assetTag: "admin" }
	 * ```
	 */
	assetTag?: string;

	/**
	 * Select only devices that match the given model identifier.
	 * ```
	 * { modelIdentifier: "iPad11,6" }
	 * ```
	 *
	 * This API provides a good, but non-comprehensive, list of device
	 * identifiers and their human-readable names.
	 * https://api.ipsw.me/v4/devices
	 */
	modelIdentifier?: string;

	/**
	 * Select devices based on which location they have been assigned to.
	 * ```
	 * { locationId: 0 }
	 * ```
	 */
	locationId?: number;

	/**
	 * Select devices based on their groups. Devices that are in any of
	 * the groups will be returned.
	 * ```
	 * { groupIds: [0, 1] }
	 * ```
	 */
	groupIds?: number[];

	/**
	 * Select devices based on the user groups the device owner is in.
	 * Devices with an owner in any of the groups are returned.
	 * ```
	 * { ownerGroupIds: [0, 1, 2] }
	 * ```
	 */
	ownerGroupIds?: number[];

	/**
	 * Select devices that belong to this user.
	 * ```
	 * { ownerId: 36 }
	 * ```
	 */
	ownerId?: number;

	/**
	 * Select devices that have an owner that matches this name.
	 * This name can be partial.
	 * ```
	 * { ownerName: "John" }
	 * { ownerName: "John Doe" }
	 * ```
	 */
	ownerName?: string;

	/**
	 * Select only devices that have an owner assigned.
	 */
	isOwned?: boolean;

	/**
	 * Select based on each device's management status. If this option is
	 * omitted, both managed and unmanaged device will be returned.
	 *
	 * Management relates to whether a device has checked in with Jamf School
	 * in the past 7 days, regardless of if it is supervised.
	 *
	 * NOTE: Due to buggy API behaviour, it is better to filter the returned
	 * array instead of using this option.
	 * ```
	 * const devices = await api.getDevices();
	 * const managed = devices.filter((device) => device.isManaged);
	 * ```
	 */
	isManaged?: boolean;

	/**
	 * Select based on each device's supervision status. If this option is
	 * omitted, both supervised and unsupervised devices will be returned.
	 *
	 * Supervision relates to whether the MDM can remotely manage the device,
	 * such as installing apps and profiles (regardless of if it is managed).
	 */
	isSupervised?: boolean;

	/**
	 * Select only trashed or untrashed devices.
	 *
	 * NOTE: This doesn't seem to do anything, more investigation is needed.
	 */
	isTrashed?: boolean;

	/**
	 * Select only devices with the given enrollment type.
	 */
	enrollmentType?: "manual" | "dep" | "depPending" | "ac2" | "ac2Pending";
};

export type APIRestartDeviceOptions = {
	/**
	 * Specifies whether the passcode should be cleared before restarting.
	 * The passcode will be restored after restarting.
	 */
	clearPasscode: boolean;
};

type APIRefreshDeviceInventoryOptions = {
	/**
	 * Specify whether errors should be cleared when refreshing the device's
	 * inventory. For example, this will attempt to reinstall apps if
	 * installation failed previously.
	 */
	clearErrors: boolean;
};

type APIUpdateDeviceDetailsOptions = {
	/** Set a new asset tag for the device. */
	assetTag?: string;

	/** Set a new note for the device. */
	notes?: string;
};

export type APIWipeDeviceOptions = {
	/**
	 * Specify whether to clear the activation lock before wiping the device.
	 *
	 * Activation lock will keep a device tied to a specific Apple ID. If
	 * not cleared, the device will be locked to the Apple ID that was signed in
	 * before wiping, which means you'll need to be able to sign in to the Apple
	 * ID before continuing setup.
	 * If the activation lock is cleared, the device and Apple ID will be
	 * unlinked.
	 *
	 * In most cases, you'll want this to be `true`.
	 */
	clearActivationLock: boolean;
};

type APIUpdateDeviceCellularPlanInit = {
	/**
	 * The carrier's eSIM server URL. This information varies from carrier to
	 * carrier.
	 */
	serverUrl: string;

	/**
	 * Specify whether the device will need to be tethered to a network for this
	 * command.
	 */
	requiresNetworkTether?: boolean;
};

type APIMoveDeviceInit = {
	/**
	 * The ID of the location to move the device to.
	 *
	 * Note that unless `onlyDevice` is set to true, the device's owner
	 * will be moved to this location as well.
	 */
	locationId: number;
	/**
	 * Specify whether to only move the device to the location, instead of
	 * moving the device and its owner.
	 */
	onlyDevice?: boolean;
};

type APIMoveDevicesInit = {
	/**
	 * The array of devices to move. This array must not be empty
	 * and may only contain a maximum of 20 items.
	 */
	udids: string[];
	/**
	 * The ID of the location to move the devices to.
	 *
	 * Note that unless `onlyDevice` is set to true, the devices' owners
	 * will be moved to this location as well.
	 */
	locationId: number;
	/**
	 * Specify whether to only move the device to the location, instead of
	 * moving the device and its owner.
	 */
	onlyDevice?: boolean;
};

type APIUserData = {
	/** The user's username. This must be unique. */
	username: string;

	/** The password used to sign in to the Jamf School account. */
	password: string;

	/** Whether or not to store the password. */
	storePassword?: boolean;

	/** The LDAP domain the user is in. */
	domain?: string;

	/** User's email address. This must be unique. */
	email: string;

	/** User's first name. */
	firstName: string;

	/** User's surname. */
	lastName: string;

	/**
	 * A list of user group names or IDs the user will belong to.
	 * If the name doesn't belong to an existing group, a group with that
	 * name will be created.
	 */
	memberOf: (string | number)[];

	/**
	 * A list of user groups that this user can manage in the Jamf Teacher
	 * app.
	 */
	teacher?: number[];

	/** A list of users that this user can manage in the Jamf Parent app. */
	children?: number[];

	/** Other information associated with the user. */
	notes?: string;

	/**
	 * Whether the user should be excluded from restrictions applied by a
	 * teacher.
	 */
	exclude?: boolean;

	/** The ID of the location to assign the user to. */
	locationId?: number;
};

type APIUserDataBulkUpdate = APIUserData & {
	/**
	 * Specify the action to perform on the user. By default, the user will be
	 * updated or created as necessary ("auto"). Using "delete" will trash the
	 * user.
	 */
	action?: "auto" | "delete";
};

type APIMoveUserInit = {
	/** ID of the location to move the user to. */
	locationId: number;
	/** Whether to only move the user, instead of the user and their devices. */
	onlyUser?: boolean;
};

/**
 * A high-level abstraction over the Jamf School API that allows you to reason
 * about data as objects with methods.
 *
 * A client instance does not act on the objects it creates, only acting as a
 * way to get other objects that can perform actions.
 *
 * Lower-level actions can be done with the API, for example bulk
 * editing operations.
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
	 * Create an app object with data from the API.
	 *
	 * If you don't already have the data, you may want `getApps`.
	 */
	createApp(data: APIData["getApps"][number]): App;

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

/**
 * Device represents a single device.
 */
export interface Device {
	/** Discriminator for type checks. */
	readonly type: "Device";

	/**
	 * The unique device identifier.
	 *
	 * The UDID is calculated based on the device's hardware rather than being
	 * randomly assigned during manufacturing.
	 */
	readonly udid: string;

	/**
	 * The device's serial number.
	 *
	 * Serial numbers are less unique than the UDID, but are easier for humans
	 * to reason about and type.
	 */
	readonly serialNumber: string;

	/** The device name. */
	readonly name: string;

	/**
	 * The management status of the device.
	 *
	 * Management is a Jamf concept. Unmanaged devices are devices that haven't
	 * check in with Jamf in 7 days.
	 */
	readonly isManaged: boolean;

	/**
	 * The supervision status of the device.
	 *
	 * Jamf has greater control over supervised devices, as they are completely
	 * managed by Jamf. Most features enabled by supervision are not accessible
	 * though the API.
	 */
	readonly isSupervised: boolean;

	/** The device class is the kind of device (eg. `ipad`) */
	readonly deviceClass: string;

	/** The device's asset tag. */
	readonly assetTag: string;

	/** Human-friendly name of the operating system (eg. `"iOS 15.0.0"`) */
	readonly os: string;

	/** The operating system prefix (eg. `"iOS"`) */
	readonly osPrefix: string;

	/** The version of the operating system (eg. `"15.0.0"`) */
	readonly osVersion: string;

	/** Human-friendly model name of the device. */
	readonly modelName: string;

	/**
	 * The model identifier is a string that uniquely identifies the specific
	 * device model (eg. `iPad11,6`).
	 *
	 * Search with [your favourite search engine] for "apple model identifier
	 * list site:github.com" and you'll find many (non-comprehensive) lists for
	 * different kinds of devices.
	 */
	readonly modelIdentifier: string;

	/** The name for the category of device (eg. `iPad`) */
	readonly modelType: string;

	/** The remaining charge as a percentage (number between 0 and 1) */
	readonly batteryPercentage: number;

	/**
	 * The total capacity of the battery in watt-hours (Wh).
	 *
	 * Jamf does not report the battery volatage or milliamp-hours.
	 *
	 * You can calculate the milliamp hours if you know the battery voltage.
	 * Most of Apple's mobile devices use ~3.8V batteries.
	 *
	 * ```
	 * const mAh = device.batteryCapacity * 1000 / V
	 * ```
	 *
	 * You can calculate the voltage if you know the milliamp-hours.
	 *
	 * ```
	 * const V = device.batteryCapacity / mAh * 1000
	 * ```
	 *
	 * NOTE: I know nothing about electricity. If this is wrong, let me know!
	 */
	readonly batteryCapacity: number;

	/**
	 * (Read) Update this device's data.
	 *
	 * Other devices created from the same data will not be updated.
	 */
	update(): Promise<this>;

	/** (Read) Get the device's owner, if any. */
	getOwner(): Promise<User | null>;

	/**
	 * (Edit) Assign a new owner to this device.
	 *
	 * The owner can be set by using an object with an `id` property (number).
	 * ```
	 * device.setOwner(testAccount)
	 * ```
	 *
	 * Alternatively, if you know the ID of the user you want to use, an object
	 * literal may be more appropriate.
	 * ```
	 * device.setOwner({ id: 4 });
	 * ```
	 */
	setOwner(user: { id: number }): Promise<this>;

	/** (Read) Get the device's groups. */
	getGroups(): Promise<DeviceGroup[]>;

	/** (Add) Schedule a restart. */
	restart(): Promise<this>;

	/** (Add) Schedule a complete wipe. */
	wipe(): Promise<this>;
}

/**
 * DeviceGroup represents a named collection of devices.
 */
export interface DeviceGroup {
	/** Discriminator for type checks. */
	readonly type: "DeviceGroup";

	/** The Jamf-assigned ID of the device group. */
	readonly id: number;

	/** The device group's name. */
	readonly name: string;

	/**
	 * A description of the structure or contents of the device group.
	 * This may be empty.
	 */
	readonly description: string;

	/** Additional relevant information. This may be empty. */
	readonly information: string;

	/** The URL used for the device group image, null if not set. */
	readonly imageUrl: string | null;

	/**
	 * Whether the group is static (false) or smart (true).
	 *
	 * Smart groups select their members based on filters.
	 */
	readonly isSmartGroup: boolean;

	// /**
	//  * _If you know what this is, please raise an issue to tell me._
	//  * https://github.com/SeparateRecords/deno_jamf_school/issues/new
	//  */
	// readonly isShared: boolean;

	// /**
	//  * _If you know what this is, please raise an issue to tell me._
	//  * https://github.com/SeparateRecords/deno_jamf_school/issues/new
	//  */
	// readonly isClass: boolean;

	/**
	 * (Read) Update this device group's data.
	 *
	 * Other device groups created from the same data will not be updated.
	 */
	update(): Promise<this>;

	/**
	 * (Read) Get all the devices in the device group.
	 *
	 * Note that if you have an array of device groups, it is _far_ more efficient
	 * to call the following:
	 * ```
	 * await client.getDevicesInGroups(array)
	 * ```
	 * Don't map over an array of device groups - filter them and use the method
	 * shown above. If you see this pattern in your code, it can be replaced.
	 * ```
	 * await Promise.all(array.map((group) => group.getDevices()))
	 * ```
	 */
	getDevices(): Promise<Device[]>;
}

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
}

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

	/**
	 * (Read) Update this user group's data.
	 *
	 * Other user groups created from the same data will not be updated.
	 */
	update(): Promise<this>;

	/** (Read) Get all the users in the user group. */
	getUsers(): Promise<User[]>;
}

export interface App {
	/** Discriminator for type checks. */
	readonly type: "App";

	/** The Jamf ID of the app. */
	readonly id: number;

	/**
	 * The app's unique ID, assigned once it's in the appropriate store.
	 *
	 * This is sometimes called an Adam ID, iTunes ID, or App Store ID.
	 *
	 * This will be null for in-house and enterprise apps.
	 */
	readonly appId: number | null;

	/** Whether this app is actually not an app, but a book. */
	readonly isBook: boolean;

	/** The technical bundle identifier of the app. */
	readonly bundleId: string;

	/** The URL of the icon of the app. */
	readonly iconURL: URL;

	/** The app's name. */
	readonly name: string;

	/** Version number of the app. This isn't necessarily SemVer. */
	readonly version: string;

	/** A floating-point number representing the price of the app. */
	readonly price: number;

	/** Whether or not the app is in the trash (deleted). */
	readonly isTrashed: boolean;

	// /**
	//  * (Read) Update this apps's data.
	//  *
	//  * Other apps created from the same data will not be updated.
	//  */
	// update(): Promise<this>;
}
