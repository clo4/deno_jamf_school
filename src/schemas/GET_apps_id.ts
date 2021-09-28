import ajv, { JTDSchemaType } from "./_ajv_jtd.ts";
import { AppData, appDataSchema } from "./_apps.ts";

type ResponseData = AppData;

const responseSchema: JTDSchemaType<ResponseData> = appDataSchema;

export default ajv.compile(responseSchema);
