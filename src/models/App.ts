import type { Device } from "./Device.ts";
import type { Location } from "./Location.ts";

/**
 * App represents an individual application.
 *
 * The API does not provide any ways to edit the data on an app.
 */
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
	readonly icon: string;

	/** The app's name. */
	readonly name: string;

	/** Version number of the app. This isn't necessarily SemVer. */
	readonly version: string;

	/** A floating-point number representing the price of the app. */
	readonly price: number;

	/** Whether or not the app is in the trash (deleted). */
	readonly isTrashed: boolean;

	/**
	 * (Read) Update this apps's data.
	 *
	 * Other apps created from the same data will not be updated.
	 */
	update(): Promise<this>;

	/** (Read) Get all the devices that have this app. */
	getDevices(): Promise<Device[]>;

	/** (Read) Get the location this app belongs to. */
	getLocation(): Promise<Location | null>;
}
