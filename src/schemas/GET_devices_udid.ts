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
		// This can be a completely empty object if the device has no owner.
		owner: {
			id?: number;
			locationId?: number;
			name?: string;
			username?: string;
			email?: string;
			firstName?: string;
			lastName?: string;
			notes?: string;
			modified?: string;
			inTrash?: boolean;
			deviceCount?: number;
			groupIds?: number[];
			groups?: string[];
			teacherGroups?: string[];
			children?: number[];
			vpp?: {
				status: string;
			}[];
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
		lastCheckin: {
			date: string;
			"timezone_type": number;
			timezone: string;
		};
		inTrash: boolean;
		deviceEnrollType: "ac2" | "dep" | "ac2Pending" | "depPending" | "manual";
		deviceDepProfile: string | null;
		availableCapacity: number;
		hasPasscode: boolean;
		passcodeCompliant: number;
		hardwareEncryptionEnabled: number;
		iTunesStoreLoggedIn: number;
		iCloudBackupEnabled: number;
		iCloudBackupLatest: number;
		groupIds: number[];
		WiFiMAC: string;
		bluetoothMAC: string;
		IPAddress: string;
		region: {
			string: string;
			coordinates: string | null;
		};
		notes: string;
		isBootstrapStored?: boolean;
		serviceSubscription?: {
			CarrierSettingsVersion: string;
			CurrentCarrierNetwork: string;
			CurrentMCC: string;
			CurrentMNC: string;
			ICCID: string;
			IMEI: string;
			IsDataPreferred: boolean;
			IsRoaming: boolean;
			IsVoicePreferred: boolean;
			Label: string;
			LabelID: string;
			MEID?: string;
			EID?: string;
			PhoneNumber: string;
			Slot: string;
		}[];
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
					optionalProperties: {
						id: { type: "int32" },
						locationId: { type: "int32" },
						name: { type: "string" },
						username: { type: "string" },
						email: { type: "string" },
						firstName: { type: "string" },
						lastName: { type: "string" },
						notes: { type: "string" },
						modified: { type: "string" },
						inTrash: { type: "boolean" },
						deviceCount: { type: "int32" },
						groups: { elements: { type: "string" } },
						groupIds: { elements: { type: "int32" } },
						teacherGroups: { elements: { type: "string" } },
						children: { elements: { type: "int32" } },
						vpp: {
							elements: {
								properties: {
									status: { type: "string" },
								},
							},
						},
					},
				},
				groups: {
					elements: { type: "string" },
				},
				batteryLevel: { type: "float32" },
				totalCapacity: { type: "float32" },
				modified: { type: "string" },
				lastCheckin: {
					properties: {
						date: { type: "string" },
						timezone_type: { type: "int32" },
						timezone: { type: "string" },
					},
				},
				IPAddress: { type: "string" },
				WiFiMAC: { type: "string" },
				bluetoothMAC: { type: "string" },
				availableCapacity: { type: "float32" },
				deviceDepProfile: { type: "string", nullable: true },
				deviceEnrollType: {
					enum: ["ac2", "ac2Pending", "dep", "depPending", "manual"],
				},
				groupIds: {
					elements: { type: "int32" },
				},
				hardwareEncryptionEnabled: { type: "int32" },
				hasPasscode: { type: "boolean" },
				passcodeCompliant: { type: "int32" },
				iCloudBackupEnabled: { type: "int32" },
				iCloudBackupLatest: { type: "int32" },
				iTunesStoreLoggedIn: { type: "int32" },
				inTrash: { type: "boolean" },
				notes: { type: "string" },
				region: {
					properties: {
						string: { type: "string" },
						coordinates: { type: "string", nullable: true },
					},
				},
			},
			optionalProperties: {
				isBootstrapStored: { type: "boolean" },
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
				serviceSubscription: {
					elements: {
						properties: {
							CarrierSettingsVersion: { type: "string" },
							CurrentCarrierNetwork: { type: "string" },
							CurrentMCC: { type: "string" },
							CurrentMNC: { type: "string" },
							ICCID: { type: "string" },
							IMEI: { type: "string" },
							IsDataPreferred: { type: "boolean" },
							IsRoaming: { type: "boolean" },
							IsVoicePreferred: { type: "boolean" },
							Label: { type: "string" },
							LabelID: { type: "string" },
							PhoneNumber: { type: "string" },
							Slot: { type: "string" },
						},
						optionalProperties: {
							MEID: { type: "string" },
							EID: { type: "string" },
						},
					},
				},
			},
			// additionalProperties: true,
		},
	},
};

export default ajv.compile(responseSchema);
