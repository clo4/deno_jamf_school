import { JTDSchemaType } from "./_ajv_jtd.ts";

// Model shared by GET /devices/groups & GET /devices/groups/:id

export type DeviceGroupData = {
	description: string;
	information: string;
	id: number;
	isSmartGroup: boolean;
	locationId: number;
	members: number;
	name: string;
	shared: boolean;
	imageUrl: string | null;
	type: "normal" | "class";
	modified?: string;
};

export const deviceGroupDataSchema: JTDSchemaType<DeviceGroupData> = {
	properties: {
		description: { type: "string" },
		information: { type: "string" },
		id: { type: "int32" },
		isSmartGroup: { type: "boolean" },
		locationId: { type: "int32" },
		members: { type: "int32" },
		name: { type: "string" },
		shared: { type: "boolean" },
		type: { enum: ["normal", "class"] },
		imageUrl: { type: "string", nullable: true },
	},
	optionalProperties: {
		modified: { type: "string" },
	},
};
