import ajv, { JTDSchemaType } from "./_ajv_jtd.ts";
import * as group from "./_device_group.ts";

type ResponseData = {
	code: number;
	deviceGroups: group.DeviceGroupData[];
};

const responseSchema: JTDSchemaType<ResponseData> = {
	properties: {
		code: { type: "int32" },
		deviceGroups: {
			elements: group.deviceGroupDataSchema,
		},
	},
};

export default ajv.compileParser(responseSchema);
