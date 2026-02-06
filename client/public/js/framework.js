/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

/**
 * Exceedingly simple frontend framework ***heavily*** inspired by SolidJS.
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
 * @param {string} tag                      - The tag of the element to create.
 * @param {object|string} fieldsOrInnerHTML - If it's an object, it's used as an attributes object.
 *                                            If it's a string, it sets the element's `innerHTML`
 *                                            property.
 * @param {string} innerHTML                - Sets the element's `innerHTML` property ONLY if
 *                                            `fieldsOrInnerHTML` is an attributes object.
 * @returns Node
 */
export const createElement = (tag, fieldsOrInnerHTML = {}, innerHTML = "") => {
	const element = document.createElement(tag);

	if (typeof fieldsOrInnerHTML === "object") {
		Object.keys(fieldsOrInnerHTML).forEach(key => (element[key] = fieldsOrInnerHTML[key]));
		element.innerHTML = innerHTML;
	} else {
		element.innerHTML = fieldsOrInnerHTML;
	}

	return element;
};

/**
 * Wrapper for `document.getElementById()`.
 *
 * @param {string} id
 * @returns Node | null
 */
export const getElement = id => document.getElementById(id);

/**
 * Combines multiple elements into one new parent tag.
 *
 * @param {string} parentTag    - The tag of the parent element to create.
 * @param {...Node|object} args - The elements to add to the new parent. If the first item is a
 *                                plain object, it is used as an attributes object instead.
 * @returns Node
 */
export const combineElements = (parentTag, ...args) => {
	const parent = createElement(parentTag);

	// The second argument can optionally be an attributes object.
	if (args.length > 0 && typeof args[0] === "object" && !(args[0] instanceof Node)) {
		const attributes = args[0];

		Object.keys(attributes).forEach(key => (parent[key] = attributes[key]));
		args = args.slice(1);
	}

	parent.append(...args);

	return parent;
};

/**
 * Shortcut helper function for creating buttons.
 *
 * @param {string} value
 * @param {string} [className=""]
 * @param {MouseEvent} [onclick=()=>{}]
 * @param {object} [attributes={}]
 *
 * @returns HTMLInputElement
 */
export const createButton = (value, className = "", onclick = () => {}, attributes = {}) => {
	return createElement("input", { type: "button", value, className, onclick, ...attributes });
};

/**
 * Creates an element from field data.
 *
 * @param {Field} field
 * @param {Event} [onchange=()=>{}]
 *
 * @returns {HTMLElement | null}
 */
export const createFromField = (field, onchange = () => {}) => {
	switch (field.type) {
		case "STRING":
		case "string": {
			return createElement("input", {
				type: "text",
				minLength: field.min,
				maxLength: field.max,
				onchange,
				oninput: onchange,
			});
		}

		case "int": {
			const increments = field.increments ?? 1;
			const dropdown = createElement("select", { onchange });

			for (let i = field.min; i <= field.max; i += increments) {
				dropdown.append(
					createElement("option", { value: i, selected: i === field.default }, i),
				);
			}

			return dropdown;
		}

		default:
			return null;
	}
};
