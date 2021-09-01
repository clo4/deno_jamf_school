import ajv, { JTDSchemaType } from "./_ajv_jtd.ts";
import * as user from "./_user.ts";

type ResponseData = {
	code: number;
	user: user.UserData;
};

const responseSchema: JTDSchemaType<ResponseData> = {
	properties: {
		code: { type: "int32" },
		user: user.userDataSchema,
	},
};

export default ajv.compile(responseSchema);
