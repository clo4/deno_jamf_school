import ajv, { JTDSchemaType } from "./_ajv_jtd.ts";

type ResponseData = {
	code: number;
	message: string;
};

const responseSchema: JTDSchemaType<ResponseData> = {
	properties: {
		code: { type: "int32" },
		message: { type: "string" },
	},
};

export default ajv.compile(responseSchema);
