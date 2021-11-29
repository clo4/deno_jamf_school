/**
 * Helper function that gives properties on the object and calls getters
 * defined on the class's prototype.
 */
// deno-lint-ignore ban-types
export function customInspect(object: Object): string {
	const props: Record<string, unknown> = {};

	const objectDescriptors = Object.getOwnPropertyDescriptors(object);
	for (const [property, descriptor] of Object.entries(objectDescriptors)) {
		if ("value" in descriptor) {
			props[property] = descriptor.value;
		}
	}

	// Class getters are defined on the prototype, not the instance
	const prototype = Object.getPrototypeOf(object);
	const prototypeDescriptors = Object.getOwnPropertyDescriptors(prototype);
	for (const [property, descriptor] of Object.entries(prototypeDescriptors)) {
		if (typeof descriptor.get === "function") {
			props[property] = descriptor.get.bind(object)();
		}
	}

	const string = Deno.inspect(props, { colors: !Deno.noColor });
	return `${object.constructor.name} ${string}`;
}
