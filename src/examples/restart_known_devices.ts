import { cron } from "https://deno.land/x/deno_cron@v1.0.0/cron.ts";

import { api } from "./auth.ts";

const udids = [
	"Put some UDIDs (unique device identifiers) in this array!",
	"When viewing a device on the Jamf School website, its UDID is in the URL.",
];

// Visit https://crontab.guru to create your own schedule.
// "At the 0th minute of the 7th hour (on every day, month, and day-name)"
cron("0 7 * * *", () => restart());

async function restart() {
	return await Promise.allSettled(udids.map((udid) =>
		api.restartDevice(udid, {
			clearPasscode: true,
		})
	));
}
