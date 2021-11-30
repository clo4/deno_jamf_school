import { cron } from "https://deno.land/x/deno_cron@v1.0.0/cron.ts";
import { List } from "https://deno.land/x/cliffy@v0.20.1/prompt/list.ts";

import { api } from "./auth.ts";

const udids = await List.prompt("Enter some UDIDs");

// Visit https://crontab.guru to create your own schedule.
// "At the 0th minute of the 7th hour (on every day, month, and day-name)"
cron("0 7 * * *", () => restart());

async function restart() {
	// 📍 Using the API method to restart devices (in parallel)
	return await Promise.allSettled(
		udids.map((udid) => api.restartDevice(udid, { clearPasscode: true })),
	);
}
