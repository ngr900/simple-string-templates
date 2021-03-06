const StringTemplateError = require('./StringTemplateError.js');
const { extractDeepProperty } = require('@ngr900/deep-property');

function interpolateStringTemplate(template, values, options = {}) {
	options = Object.assign(
		{
			warn: false,
			throw: false,
		},
		options
	);

	if (typeof template !== 'string') {
		throw new StringTemplateError('Template must be a string.');
	}

	if (typeof values !== 'object' || values === null) {
		throw new StringTemplateError('Values must be an object.');
	}

	const slots = (template.match(/(\${.+?})/g) || []).reduce(
		(unique, slot) => (!unique.includes(slot) ? [...unique, slot] : unique),
		[]
	);

	for (const slot of slots) {
		const prop = slot.substring(2, slot.length - 1).trim();
		const [exists, value] = extractDeepProperty(values, prop);
		if (exists) {
			const regex = new RegExp(slot.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'), 'g');
			template = template.replace(regex, value);
		} else {
			if (options.throw) {
				throw new StringTemplateError(`No value found for ${slot}.`);
			} else if (options.warn) {
				console.warn(`No value found for ${slot}`);
			}
		}
	}
	
	return template;
}

function stringTemplateFactory(template) {
	return function (values, options) {
		return interpolateStringTemplate(template, values, options);
	};
}

module.exports = {
	interpolateStringTemplate,
	stringTemplateFactory,
	StringTemplateError
};
