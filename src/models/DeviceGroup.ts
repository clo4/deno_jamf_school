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

	/** The URL used for the device group image, or null if not set. */
	readonly imageUrl: string | null;

	/**
	 * Whether the group is static (false) or smart (true).
	 *
	 * Smart groups select their members based on filters, whereas static group
	 * members must be manually assigned.
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

	/** Return the data used to create this object. */
	toJSON(): unknown;

	/** The name of the device group. */
	toString(): string;

	/**
	 * (Read) Update this device group's data.
	 *
	 * Other device groups created from the same data will not be updated.
	 */
	update(): Promise<this>;

	/** (Read) Get all the devices in the device group. */
	getDevices(): Promise<Device[]>;

	/** (Read) Get the location this device group belongs to. */
	getLocation(): Promise<Location | null>;
}
