import { JTDSchemaType } from "./_ajv_jtd.ts";

// Model shared by GET /users/groups & GET /users/groups/:id

export type UserGroupData = {
	id: number;
	locationId: number;
	name: string;
	description: string;
	userCount: number;
	acl: {
		teacher: "inherit" | "allow" | "deny";
		parent: "inherit" | "allow" | "deny";
	};
	modified: string;
};

export const userGroupDataSchema: JTDSchemaType<UserGroupData> = {
	properties: {
		id: { type: "int32" },
		locationId: { type: "int32" },
		name: { type: "string" },
		description: { type: "string" },
		userCount: { type: "int32" },
		acl: {
			properties: {
				teacher: { enum: ["allow", "deny", "inherit"] },
				parent: { enum: ["allow", "deny", "inherit"] },
			},
		},
		modified: { type: "string" },
	},
};
