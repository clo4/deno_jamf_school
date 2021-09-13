import ajv, { JTDSchemaType } from "./_ajv_jtd.ts";

type ResponseData = {
	apps: {
		id: number;
		locationId: number;
		isBook: boolean;
		bundleId: string;
		icon: string;
		name: string;
		version: string;
		shortVersion: string;
		extVersion: number;
		supportsiBooks: boolean;
		canAutoUpdate: boolean;
		canToggleRemovable: boolean;
		platform: string;
		type: string;
		showInTeacher: boolean;
		allowTeacherDistribution: boolean;
		teacherGroups: number[];
		showInParent: boolean;
		manageApp: boolean;
		mediaPriority: number;
		removeWithProfile: boolean;
		disableBackup: boolean;
		lastModified: string;
		automaticReinstallWhenRemoved: boolean | null;
		automaticUpdate: boolean | null;
		nonRemovable: boolean | null;
		associatedDirectDownload: boolean | null;
		associatedDomains: string | null;
		adamId?: number;
		description: string | null;
		externalVersion?: number;
		html?: string;
		vendor: string;
		price?: number;
		isDeleted?: boolean;
		isDeviceAssignable?: boolean;
		is32BitOnly?: boolean;
		isCustomB2B?: boolean;
		deviceFamilies?: string[] | null;
		isTvOSCompatible?: boolean;
		isMacOsCompatible?: boolean;
		autoGrant?: boolean;
		autoRevoke?: boolean;
		totalLicenses?: number;
		usedLicenses?: number;
		availableLicenses?: number;
		size?: string;
		enableCaching?: boolean;
		hideManageable?: boolean;
		assetType?: string;
		url?: string | null;
		notifierId?: string | null;
	}[];
};

const responseSchema: JTDSchemaType<ResponseData> = {
	properties: {
		apps: {
			elements: {
				properties: {
					id: { type: "int32" },
					locationId: { type: "int32" },
					isBook: { type: "boolean" },
					bundleId: { type: "string" },
					icon: { type: "string" },
					name: { type: "string" },
					version: { type: "string" },
					shortVersion: { type: "string" },
					extVersion: { type: "int32" },
					supportsiBooks: { type: "boolean" },
					canAutoUpdate: { type: "boolean" },
					canToggleRemovable: { type: "boolean" },
					platform: { type: "string" },
					type: { type: "string" },
					showInTeacher: { type: "boolean" },
					allowTeacherDistribution: { type: "boolean" },
					teacherGroups: { elements: { type: "int32" } },
					showInParent: { type: "boolean" },
					manageApp: { type: "boolean" },
					mediaPriority: { type: "int32" },
					removeWithProfile: { type: "boolean" },
					disableBackup: { type: "boolean" },
					lastModified: { type: "string" },
					automaticReinstallWhenRemoved: { type: "boolean", nullable: true },
					automaticUpdate: { type: "boolean", nullable: true },
					nonRemovable: { type: "boolean", nullable: true },
					associatedDirectDownload: { type: "boolean", nullable: true },
					associatedDomains: { type: "string", nullable: true },
					description: { type: "string", nullable: true },
					vendor: { type: "string" },
				},
				optionalProperties: {
					adamId: { type: "int32" },
					externalVersion: { type: "int32" },
					html: { type: "string" },
					price: { type: "float32" },
					isDeviceAssignable: { type: "boolean" },
					isDeleted: { type: "boolean" },
					is32BitOnly: { type: "boolean" },
					isCustomB2B: { type: "boolean" },
					deviceFamilies: { elements: { type: "string" }, nullable: true },
					isTvOSCompatible: { type: "boolean" },
					isMacOsCompatible: { type: "boolean" },
					autoGrant: { type: "boolean" },
					autoRevoke: { type: "boolean" },
					totalLicenses: { type: "int32" },
					usedLicenses: { type: "int32" },
					availableLicenses: { type: "int32" },
					size: { type: "string" },
					enableCaching: { type: "boolean" },
					hideManageable: { type: "boolean" },
					assetType: { type: "string" },
					url: { type: "string", nullable: true },
					notifierId: { type: "string", nullable: true },
				},
			},
		},
	},
};

export default ajv.compile(responseSchema);
