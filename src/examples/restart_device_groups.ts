import { associateBy } from "https://deno.land/std@0.116.0/collections/associate_by.ts";
import { zip } from "https://deno.land/std@0.116.0/collections/zip.ts";
import { Checkbox } from "https://deno.land/x/cliffy@v0.20.1/prompt/checkbox.ts";
import { wait } from "https://deno.land/x/wait@0.1.12/mod.ts";

// The client is created in another file so it can be shared between examples.
import * as jamf from "../mod.ts";
import { client } from "./auth.ts";

// Show a spinner while fetching device groups
const spinner = wait("Fetching device groups...").start();
// 📍 Fetch device groups
const groups = await client.getDeviceGroups();
spinner.stop();

// This will create the interactive menu and return the selected groups.
const selected = await selectDeviceGroups(groups);

// Finally, restart the devices.
await restartDevices(selected);

/**
 * This function does 3 things:
 * 1. Get all the devices in the given device groups
 * 2. Schedule a device restart for each of them
 * 3. For each device, log whether that was successful.
 */
async function restartDevices(groups: jamf.DeviceGroup[]) {
	// 📍 Fetch devices in groups (no duplicates)
	const devices = await client.getDevicesInGroups(groups);

	// This could be hundreds of devices, best to restart them in parallel.
	// Note that these promises resolve once Jamf School has *scheduled* a
	// restart, which may never happen if (for example) the device is offline.

	// 📍 Restart devices in parallel
	const results = await Promise.allSettled(
		devices.map((device) => device.restart()),
	);

	// Each item in the 'results' array is in the same place as the device, so
	// the two arrays can be combined to find out each device's status.
	for (const [device, result] of zip(devices, results)) {
		if (result.status === "fulfilled") {
			console.log(device.serialNumber, device.name, "Scheduled");
		} else {
			console.log(device.serialNumber, device.name, "Failed:", result.reason);
		}
	}
}

/** Create an interactive prompt that allows you to select device groups. */
async function selectDeviceGroups(groups: jamf.DeviceGroup[]) {
	const ids = await Checkbox.prompt({
		message: "Enable some groups to restart (space = toggle, enter = continue)",
		options: groups.map((group) => ({
			name: group.name,
			value: group.id.toString(),
		})),
		minOptions: 1,
	});
	const groupsById = associateBy(groups, (group) => group.id.toString());
	const selected = ids.map((id) => groupsById[id]);
	return selected;
}
