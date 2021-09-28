import ajv, { JTDSchemaType } from "./_ajv_jtd.ts";
import { AppData, appDataSchema } from "./_apps.ts";

type ResponseData = {
	apps: AppData[];
};

const responseSchema: JTDSchemaType<ResponseData> = {
	properties: {
		apps: {
			elements: appDataSchema,
		},
	},
};

export default ajv.compile(responseSchema);
