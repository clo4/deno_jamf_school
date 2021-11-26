import { JTDSchemaType } from "./_ajv_jtd.ts";

export type ProfileData = {
	id: number;
	locationId: number;
	type: { value: string };
	status: { value: string };
	identifier: string;
	name: string;
	description: string;
	platform: "iOS" | "macOS" | "tvOS" | "universal";
	// Days are stringified numbers starting from "1" (Monday) to "7" (Sunday)
	daysOfTheWeek: ("1" | "2" | "3" | "4" | "5" | "6" | "7")[];
	isTemplate: boolean;
	startTime: string | null;
	endTime: string | null;
	useHolidays: boolean;
	// Always installed on the weekend
	restrictedWeekendUse: boolean;
};

export const profileDataSchema: JTDSchemaType<ProfileData> = {
	properties: {
		id: { type: "int32" },
		locationId: { type: "int32" },
		type: {
			properties: {
				value: { type: "string" },
			},
		},
		status: {
			properties: {
				value: { type: "string" },
			},
		},
		identifier: { type: "string" },
		name: { type: "string" },
		description: { type: "string" },
		platform: { enum: ["iOS", "macOS", "tvOS", "universal"] },
		daysOfTheWeek: {
			elements: { enum: ["1", "2", "3", "4", "5", "6", "7"] },
		},
		isTemplate: { type: "boolean" },
		startTime: { type: "string", nullable: true },
		endTime: { type: "string", nullable: true },
		useHolidays: { type: "boolean" },
		restrictedWeekendUse: { type: "boolean" },
	},
};
