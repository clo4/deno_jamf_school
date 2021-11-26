import { client } from "./client.js";
import { cron } from "https://deno.land/x/deno_cron@v1.0.0/cron.ts";
import { associateBy } from "https://deno.land/std@0.106.0/collections/associate_by.ts";
import { zip } from "https://deno.land/std@0.106.0/collections/zip.ts";
import { Checkbox } from "https://deno.land/x/cliffy@v0.20.1/prompt/checkbox.ts";

console.log("Restart all devices in selected groups, each day at 7 am");

const groups = await client.getDeviceGroups();
const selected = await promptGroups();

// On each day, at 7:00 am, restart all devices in the selected groups
cron("0 7 * * *", () => restartDevices(selected));

async function restartDevices(groups) {
	// Each time this is run, get all the devices in the selected groups.
	const devices = await client.getDevicesInGroups(groups);

	// This could be hundreds of devices, so we'll restart in parallel.
	const results = await Promise.allSettled(
		devices.map((device) => device.restart()),
	);

	// The 'results' array can be associated
	const data = [];
	for (const [device, result] of zip(devices, results)) {
		data.push({
			device: device.serialNumber,
			name: device.name,
			status: result.status === "fulfilled" ? "✅" : result.reason,
		});
	}

	console.log(new Date());
	console.table(data);
}

async function promptGroups() {
	const ids = await Checkbox.prompt({
		message: "Enable some groups to restart! (space = toggle, enter = continue)",
		options: groups.map((group) => ({
			name: group.name,
			value: group.id.toString(),
		})),
		minOptions: 1,
	});
	const groupsById = associateBy(groups, (group) => group.id.toString());
	const selected = ids.map((id) => groupsById[id]);
	console.log("Leave this script running and the devices will restart.");
	return selected;
}
