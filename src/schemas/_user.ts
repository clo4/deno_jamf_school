import { JTDSchemaType } from "./_ajv_jtd.ts";

// Model shared by GET /users & GET /users/:id

export type UserData = {
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
	vpp: {
		status: string;
	}[];
};

export const userDataSchema: JTDSchemaType<UserData> = {
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
		vpp: {
			elements: {
				properties: {
					status: { type: "string" },
				},
			},
		},
	},
};
