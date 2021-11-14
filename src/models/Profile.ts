/**
 * Profile represents a single profile.
 *
 * The API does not provide any ways to edit the data on a profile.
 */
export interface Profile {
	/** Discriminator for type checks. */
	readonly type: "Profile";

	/** The ID of the profile. */
	readonly id: number;

	/** The ID of this profile's location. */
	readonly locationId: number;

	/** The identifier used when installing the profile. */
	readonly identifier: string;

	/** The name of the profile. */
	readonly name: string;

	/** The description of the device. */
	readonly description: string;

	/** Whether the profile can be installed on any device, regardless of OS. */
	readonly isUniversal: boolean;

	/**
	 * The platforms this profile can be installed on.
	 *
	 * Jamf School allows for iOS, macOS, tvOS and "custom" (universal) profiles.
	 * OS-specific profiles will only set their OS property to true. Universal
	 * profiles set every property to true.
	 */
	readonly platform: {
		readonly iOS: boolean;
		readonly macOS: boolean;
		readonly tvOS: boolean;
	};

	/** Return the data used to create this object. */
	toJSON(): unknown;

	/** The name of the profile. */
	toString(): string;

	/**
	 * (Read) Update this user's data.
	 *
	 * Other users created from the same data will not be updated.
	 */
	update(): Promise<void>;

	/** The profile's time filter. */
	timeConstraints(): ProfileTimeConstraints | null;
}

export interface ProfileTimeConstraints {
	/** Will the profile be installed on Monday? */
	readonly monday: boolean;

	/** Will the profile be installed on Tuesday? */
	readonly tuesday: boolean;

	/** Will the profile be installed on Wednesday? */
	readonly wednesday: boolean;

	/** Will the profile be installed on Thursday? */
	readonly thursday: boolean;

	/** Will the profile be installed on Friday? */
	readonly friday: boolean;

	/** Will the profile be installed on Saturday? */
	readonly saturday: boolean;

	/** Will the profile be installed on Sunday? */
	readonly sunday: boolean;

	/** Will the profile be installed on holidays? */
	readonly holidays: boolean;

	// TODO: Once Temporal is stable, switch to Temporal.PlainTime
	/** Time the profile will be installed. (HH:MM) */
	readonly installTime: string;

	// TODO: Once Temporal is stable, switch to Temporal.PlainTime
	/** Time the profile will be removed. (HH:MM) */
	readonly removeTime: string;
}
