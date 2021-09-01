import ajv, { JTDSchemaType } from "./_ajv_jtd.ts";
import * as user from "./_user.ts";

type ResponseData = {
	code: number;
	count: number;
	users: user.UserData[];
};

const responseSchema: JTDSchemaType<ResponseData> = {
	properties: {
		code: { type: "int32" },
		count: { type: "int32" },
		users: {
			elements: user.userDataSchema,
		},
	},
};

export default ajv.compile(responseSchema);
