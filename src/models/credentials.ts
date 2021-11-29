/**
 * The minimum required information to use the API.
 */
export interface Credentials {
	/**
	 * Your Jamf School network ID.
	 *
	 * This can be located in the Jamf School web interface:
	 *
	 * Devices > Enroll device(s) > On-device enrollment (iOS & macOS)
	 */
	id: string;

	/**
	 * Your API token.
	 *
	 * This must be created through the Jamf School web interface:
	 *
	 * Organisation > Settings > API > Add API Key
	 *
	 * All methods state their required permissions.
	 */
	token: string;

	/**
	 * Your API endpoint.
	 *
	 * This generally follows this format:
	 *
	 * https://your_school_instance.jamfcloud.com/api
	 */
	url: string;
}
