import { JTDSchemaType } from "./_ajv_jtd.ts";

export type LocationData = {
	id: number;
	name: string;
	isDistrict: boolean;
	street: string | null;
	streetNumber: string | null;
	postalCode: string | null;
	city: string | null;
	source: string;
	asmIdentifier: string | null; // TODO: what is this type? I don't think it's string
	schoolNumber: string | null;
};

export const locationDataSchema: JTDSchemaType<LocationData> = {
	properties: {
		id: { type: "int32" },
		name: { type: "string" },
		street: { type: "string", nullable: true },
		streetNumber: { type: "string", nullable: true },
		postalCode: { type: "string", nullable: true },
		city: { type: "string", nullable: true },
		source: { type: "string" },
		isDistrict: { type: "boolean" },
		asmIdentifier: { type: "string", nullable: true },
		schoolNumber: { type: "string", nullable: true },
	},
};
