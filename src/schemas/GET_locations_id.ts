import ajv, { JTDSchemaType } from "./_ajv_jtd.ts";
import { LocationData, locationDataSchema } from "./_location.ts";

type ResponseData = LocationData;

const responseDataSchema: JTDSchemaType<ResponseData> = locationDataSchema;

export default ajv.compile(responseDataSchema);
