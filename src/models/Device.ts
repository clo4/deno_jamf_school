import type { DeviceGroup } from "./DeviceGroup.ts";
import type { User } from "./User.ts";

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
