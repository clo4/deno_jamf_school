import ajv, { JTDSchemaType } from "./_ajv_jtd.ts";

type ResponseData = {
	code: number;
	user: {
		id: number;
		locationId: number;
		status: "Active" | "Trash";
		deviceCount: number;
		email: string;
		username: string;
		domain: string;
		firstName: string;
		lastName: string;
		name: string;
		groupIds: number[];
		groups: string[];
		teacherGroups: number[];
		children: number[];
		notes: string;
		exclude: boolean;
		modified: string;
	};
};

const responseSchema: JTDSchemaType<ResponseData> = {
	properties: {
		code: { type: "int32" },
		user: {
			properties: {
				id: { type: "int32" },
				locationId: { type: "int32" },
				status: { enum: ["Active", "Trash"] },
				deviceCount: { type: "int32" },
				email: { type: "string" },
				username: { type: "string" },
				domain: { type: "string" },
				firstName: { type: "string" },
				lastName: { type: "string" },
				name: { type: "string" },
				groupIds: { elements: { type: "int32" } },
				groups: { elements: { type: "string" } },
				teacherGroups: { elements: { type: "int32" } },
				children: { elements: { type: "int32" } },
				notes: { type: "string" },
				exclude: { type: "boolean" },
				modified: { type: "string" },
			},
		},
	},
};

export default ajv.compile(responseSchema);
