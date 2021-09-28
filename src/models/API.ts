import type { AnyIdentifier } from "../deps/apple_device_identifiers.ts";
import type { RouteData } from "../schemas/mod.ts";

/**
 * API is a low-level wrapper over the Jamf School API. It serves as a
 * replacement to manually making requests. It performs data validation and
 * error handling. Network errors, validation errors, and permission errors
 * will all be raised.
 *
 * Unfortunately, the data returned by these methods cannot be explored through
 * doc.deno.land due to limitations with the documentation generator, as it
 * would require a full TypeScript implementation to evaluate the types.
 * Instead, the best solution is to either use the deno language server, or
 * find the RouteData parameter in the method you want and find the matching
 * file in https://deno.land/x/jamf_school/schemas.
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

	/**
	 * (Read) Get a single app by its ID.
	 *
	 * The ID used is a Jamf School ID, not the app's App Store ID.
	 */
	getApp(id: number): Promise<RouteData<"GET /apps/:id">>;
}

/** Helper type to map from API method name to the method's return type. */
export type APIData = {
	// deno-lint-ignore no-explicit-any
	[K in keyof API]: ReturnType<Extract<API[K], (...args: any) => any>> extends
		Promise<infer T> ? T : never;
};

export interface APIGetDeviceOptions {
	/**
	 * Specify whether the API should include apps in the output.
	 * Apps will be included unless `false` is provided.
	 */
	includeApps?: boolean;
}

// Some of the names of the options are different, because the API is bad and
// inconsistent. Have I said that enough yet? Anyway, implementations are
// expected to adapt these options to the _actual_ names.
export interface APIGetDevicesOptions {
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
	 * Any string is valid, but not all strings are identifiers. If an invalid
	 * identifier is given, no devices will be returned. Currently known valid
	 * identifiers will be suggested in your editor.
	 */
	modelIdentifier?: AnyIdentifier;

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
}

export interface APIRestartDeviceOptions {
	/**
	 * Specifies whether the passcode should be cleared before restarting.
	 * The passcode will be restored after restarting.
	 */
	clearPasscode: boolean;
}

interface APIRefreshDeviceInventoryOptions {
	/**
	 * Specify whether errors should be cleared when refreshing the device's
	 * inventory. For example, this will attempt to reinstall apps if
	 * installation failed previously.
	 */
	clearErrors: boolean;
}

interface APIUpdateDeviceDetailsOptions {
	/** Set a new asset tag for the device. */
	assetTag?: string;

	/** Set a new note for the device. */
	notes?: string;
}

export interface APIWipeDeviceOptions {
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
}

interface APIUpdateDeviceCellularPlanInit {
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
}

interface APIMoveDeviceInit {
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
}

interface APIMoveDevicesInit {
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
}

interface APIUserData {
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
}

interface APIUserDataBulkUpdate extends APIUserData {
	/**
	 * Specify the action to perform on the user. By default, the user will be
	 * updated or created as necessary ("auto"). Using "delete" will trash the
	 * user.
	 */
	action?: "auto" | "delete";
}

interface APIMoveUserInit {
	/** ID of the location to move the user to. */
	locationId: number;
	/** Whether to only move the user, instead of the user and their devices. */
	onlyUser?: boolean;
}
