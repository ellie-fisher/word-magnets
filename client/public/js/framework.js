/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

/**
 * Exceedingly simple frontend framework ***heavily*** inspired by SolidJS (and a lil bit of Redux).
 */

let currentEffect = null;

export function createSignal(initialValue) {
	let value = initialValue;
	const effects = new Set();

	function get() {
		if (currentEffect !== null && !effects.has(currentEffect)) {
			effects.add(currentEffect);
		}

		return value;
	}

	function set(newValue, payload = null) {
		if (newValue !== value) {
			value = newValue;
			effects.forEach(func => func(payload));
		}
	}

	return [get, set];
}

export function createEffect(func, initialPayload = null) {
	function effect(payload = null) {
		currentEffect = effect;
		func(payload);
		currentEffect = null;
	}

	effect(initialPayload);
}

/**
 * Creates a DOM element.
 *
 * @param {string} tag - The tag of the element to create.
 * @param {...} args   - If the first element in the `args` array is a plain object, it's treated as
 *                       an attributes object.
 *                       If the first or second element is a string, it sets the `textContext` of
 *                       the new element.
 *                       Everything else is treated as a child.
 *
 * @returns Node
 */
export const $ = (tag, ...args) => {
	const element = document.createElement(tag);

	let i = 0;

	// Check whether second argument is an attributes object.
	if (args.length >= i && typeof args[i] === "object" && !(args[i] instanceof Node)) {
		const attributes = args[i];
		Object.keys(attributes).forEach(key => (element[key] = attributes[key]));
		i++;
	}

	// Check whether second or third argument is for `textContent`.
	if (args.length >= i && typeof args[i] === "string") {
		element.textContent = args[i];
		i++;
	}

	// The rest of the arguments are children.
	for (; i < args.length; i++) {
		element.append(args[i]);
	}

	return element;
};

/**
 * Replaces an element's children with new ones.
 */
export const $replace = (node, ...children) => {
	node.replaceChildren(...children);
	return node;
};

/**
 * Wrapper for `document.getElementById()`.
 */
export const $get = id => document.getElementById(id);

/**
 * Creates an element from field data.
 */
export const $field = (field, onchange = () => {}) => {
	switch (field.type) {
		case "STRING":
		case "string": {
			return $("input", {
				type: "text",
				minLength: field.min,
				maxLength: field.max,
				onchange,
				oninput: onchange,
			});
		}

		case "int": {
			const increments = field.increments ?? 1;
			const dropdown = $("select", { onchange });

			for (let i = field.min; i <= field.max; i += increments) {
				dropdown.append($("option", { value: i, selected: i === field.default }, i));
			}

			return dropdown;
		}

		default:
			return null;
	}
};
