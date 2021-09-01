import ajv, { JTDSchemaType } from "./_ajv_jtd.ts";
import * as group from "./_user_group.ts";

type ResponseData = {
	code: number;
	group: group.UserGroupData;
};

const responseDataSchema: JTDSchemaType<ResponseData> = {
	properties: {
		code: { type: "int32" },
		group: group.userGroupDataSchema,
	},
};

export default ajv.compile(responseDataSchema);
