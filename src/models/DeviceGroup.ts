import type { Device } from "./Device.ts";
import type { Location } from "./Location.ts";

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

	/** (Read) Get the location this device group belongs to. */
	getLocation(): Promise<Location | null>;
}
