import * as jamf from "../../src/mod.ts";
import { assertValid } from "../../src/schemas/mod.ts";
import { relativeTextFileReader } from "../deps/read_relative_file.ts";
import { assert, assertEquals } from "../deps/std_testing_asserts.ts";

const readRelativeTextFile = relativeTextFileReader(import.meta.url);

const client = jamf.createClient({ id: "", token: "", url: "" });

const data = JSON.parse(
  await readRelativeTextFile("../example_data/GET_devices__200.json"),
);
assertValid("GET /devices", data);

Deno.test({
  name: "Device.toJSON() is the same as the data used to create it",
  fn() {
    const device = client.createDevice(data.devices[0]);
    assertEquals(device.toJSON(), data.devices[0]);
  },
});

Deno.test({
  name: "Device.toString() is the same as Device.name",
  fn() {
    const device = client.createDevice(data.devices[0]);
    assertEquals(device.toString(), device.name);
  },
});

Deno.test({
  name: "Device.enrollment is an object with 'type' and 'pending'",
  fn() {
		for (const deviceData of data.devices) {
			const device = client.createDevice(deviceData);
			const obj = device.enrollment;
			assert(typeof obj === "object");
			assert("type" in obj);
			assert("pending" in obj);
		}
  },
});
