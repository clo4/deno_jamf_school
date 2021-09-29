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
	// I'm *pretty* sure this is a string, but I don't know for sure. This
	// support article makes me think I'm correct. Might need testing later.
	// https://support.apple.com/en-au/guide/apple-school-manager/apd230e24905/web
	asmIdentifier: string | null;
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
