import ajv, { JTDSchemaType } from "./_ajv_jtd.ts";
import * as group from "./_user_group.ts";

type ResponseData = {
	code: number;
	count: number;
	groups: group.UserGroupData[];
};

const responseDataSchema: JTDSchemaType<ResponseData> = {
	properties: {
		code: { type: "int32" },
		count: { type: "int32" },
		groups: { elements: group.userGroupDataSchema },
	},
};

export default ajv.compileParser(responseDataSchema);
