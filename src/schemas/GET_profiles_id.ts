import ajv, { JTDSchemaType } from "./_ajv_jtd.ts";
import * as profile from "./_profile.ts";

type ResponseData = profile.ProfileData;

const responseSchema: JTDSchemaType<ResponseData> = profile.profileDataSchema;

export default ajv.compile(responseSchema);
