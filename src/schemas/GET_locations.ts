import ajv, { JTDSchemaType } from "./_ajv_jtd.ts";
import { LocationData, locationDataSchema } from "./_location.ts";

type ResponseData = {
	locations: LocationData[];
};

const responseDataSchema: JTDSchemaType<ResponseData> = {
	properties: {
		locations: { elements: locationDataSchema },
	},
};

export default ajv.compile(responseDataSchema);
