import ajv, { JTDSchemaType } from "./_ajv_jtd.ts";

type ResponseData = {
	code: number;
	devicesMoved: string[];
	devicesNotFound: string[];
	devicesMoveFailed: string[];
	devicesLocationSame: string[];
};

const responseSchema: JTDSchemaType<ResponseData> = {
	properties: {
		code: { type: "int32" },
		devicesMoved: { elements: { type: "string" } },
		devicesNotFound: { elements: { type: "string" } },
		devicesMoveFailed: { elements: { type: "string" } },
		devicesLocationSame: { elements: { type: "string" } },
	},
};

export default ajv.compile(responseSchema);
