import ajv, { JTDSchemaType } from "./_ajv_jtd.ts";
import * as group from "./_device_group.ts";

type ResponseData = {
	code: number;
	deviceGroup: group.DeviceGroupData;
};

const responseSchema: JTDSchemaType<ResponseData> = {
	properties: {
		code: { type: "int32" },
		deviceGroup: group.deviceGroupDataSchema,
	},
};

export default ajv.compile(responseSchema);
