import ajv, { JTDSchemaType } from "./_ajv_jtd.ts";

type ResponseData = {
	code: number;
};

const responseSchema: JTDSchemaType<ResponseData> = {
	properties: {
		code: { type: "int32" },
	},
};

export default ajv.compile(responseSchema);
