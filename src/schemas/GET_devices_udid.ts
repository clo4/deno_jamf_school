import ajv, { JTDSchemaType } from "./_ajv_jtd.ts";

type ResponseData = {
	code: number;
	device: {
		UDID: string;
		locationId: number;
		serialNumber: string;
		name: string;
		isManaged: boolean;
		isSupervised: boolean;
		class: string;
		assetTag: string;
		os: {
			prefix: string;
			version: string;
		};
		model: {
			name: string;
			identifier: string;
			type: { value: string };
		};
		owner: {
			id: number;
			locationId: number;
			name: string;
			username?: string;
			email?: string;
			firstName?: string;
			lastName?: string;
			notes?: string;
			modified?: string;
		};
		groups: string[];
		batteryLevel: number;
		totalCapacity: number;
		apps?: {
			name: string;
			identifier: string;
			version: string;
			vendor: string;
			icon: string;
		}[];
		modified: string;
	};
};

const responseSchema: JTDSchemaType<ResponseData> = {
	properties: {
		code: { type: "int32" },
		device: {
			properties: {
				UDID: { type: "string" },
				locationId: { type: "int32" },
				serialNumber: { type: "string" },
				name: { type: "string" },
				isManaged: { type: "boolean" },
				isSupervised: { type: "boolean" },
				class: { type: "string" },
				assetTag: { type: "string" },
				os: {
					properties: {
						prefix: { type: "string" },
						version: { type: "string" },
					},
				},
				model: {
					properties: {
						name: { type: "string" },
						identifier: { type: "string" },
						type: {
							properties: {
								value: { type: "string" },
							},
						},
					},
				},
				owner: {
					properties: {
						id: { type: "int32" },
						locationId: { type: "int32" },
						name: { type: "string" },
					},
					optionalProperties: {
						username: { type: "string" },
						email: { type: "string" },
						firstName: { type: "string" },
						lastName: { type: "string" },
						notes: { type: "string" },
						modified: { type: "string" },
					},
					additionalProperties: true,
				},
				groups: {
					elements: { type: "string" },
				},
				batteryLevel: { type: "float32" },
				totalCapacity: { type: "float32" },
				modified: { type: "string" },
			},
			optionalProperties: {
				apps: {
					elements: {
						properties: {
							name: { type: "string" },
							identifier: { type: "string" },
							version: { type: "string" },
							vendor: { type: "string" },
							icon: { type: "string" },
						},
					},
				},
			},
			additionalProperties: true,
		},
	},
};

export default ajv.compile(responseSchema);
