import ajv from "../src/schemas/_ajv_jtd.ts";

// This shim recursively adds the additionalProperties prop to schemas
// before they're compiled, because release builds shouldn't be as strict
// as dev builds. Additional properties are acceptable in production.

const realCompile = ajv.compile.bind(ajv);

export const isRelease = Deno.env.get("BUNDLE_RELEASE") === "1";

if (isRelease) {
	ajv.compile = function (...args) {
		const [schema] = args;
		recurisvelyAddAdditionalProps(schema);
		return realCompile(...args);
	};
	ajv.compile.prototype = realCompile.prototype;
}

const recurisvelyAddAdditionalProps = (object) => {
	if ("properties" in object) {
		object.additionalProperties ??= true;
		for (const value of Object.values(object.properties)) {
			recurisvelyAddAdditionalProps(value);
		}
	} else if ("optionalProperties" in object) {
		object.additionalProperties ??= true;
		for (const value of Object.values(object.optionalProperties)) {
			recurisvelyAddAdditionalProps(value);
		}
	} else if ("elements" in object) {
		recurisvelyAddAdditionalProps(object.elements);
	} else if ("values" in object) {
		recurisvelyAddAdditionalProps(object.values);
	} else if ("mapping" in object) {
		for (const value of Object.values(object.mapping)) {
			recurisvelyAddAdditionalProps(value);
		}
	} else if ("definitions" in object) {
		for (const value of Object.values(object.definitions)) {
			recurisvelyAddAdditionalProps(value);
		}
	}
};
