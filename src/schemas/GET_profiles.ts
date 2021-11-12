import ajv, { JTDSchemaType } from "./_ajv_jtd.ts";
import * as profile from "./_profile.ts";

type ResponseData = {
	profiles: profile.ProfileData[];
};

const responseSchema: JTDSchemaType<ResponseData> = {
	properties: {
		profiles: {
			elements: profile.profileDataSchema,
		},
	},
};

export default ajv.compile(responseSchema);
