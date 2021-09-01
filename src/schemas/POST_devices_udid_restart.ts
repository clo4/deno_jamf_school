import ajv, { JTDSchemaType } from "./_ajv_jtd.ts";

type ResponseData = {
	message: string;
	device?: string;
};

const responseSchema: JTDSchemaType<ResponseData> = {
	properties: {
		message: { type: "string" },
	},
	optionalProperties: {
		device: { type: "string" },
	},
};

export default ajv.compile(responseSchema);
