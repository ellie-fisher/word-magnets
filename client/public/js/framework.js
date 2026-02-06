/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

/**
 * A quasi-frontend-framework because we don't need or want any external dependencies.
 */

import { deepFreeze } from "./util.js";

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
 * Clears the `innerHTML` of `parent` and sets its children to `children`.
 *
 * @param {Node} parent
 * @param  {...Node|string} children
 */
export const setChildren = (parent, ...children) => {
	parent.innerHTML = "";
	parent.append(...children);
};

/**
 * A class for managing and reacting to state changes.
 */
export class State {
	#initial;
	#values;
	#hooks;

	/**
	 * @param {object} initial - Initial state values, which get deeply cloned.
	 */
	constructor(initial) {
		this.#initial = structuredClone(initial);
		this.#values = structuredClone(initial);
		this.#hooks = [];

		deepFreeze(this.#initial);
	}

	/**
	 * Adds a hook that is called whenever a value is updated.
	 *
	 * @param {(key: string, newValue: any, payload: any, oldValue: any) => void} hook
	 * @returns {Function|null} If `hook` is a function, it gets returned, otherwise `null`.
	 */
	addSetHook(hook) {
		const isFunction = typeof hook === "function";

		if (isFunction && !this.#hooks.includes(hook)) {
			this.#hooks.push(hook);
		}

		return isFunction ? hook : null;
	}

	/**
	 * Removes a hook.
	 *
	 * @param {(key: string, newValue: any, payload: any, oldValue: any) => void} hook
	 */
	removeSetHook(hook) {
		if (typeof hook === "function") {
			const index = this.#hooks.indexOf(hook);

			if (index >= 0) {
				this.#hooks.splice(index, 1);
			}
		}
	}

	/**
	 * Clears all hooks.
	 */
	clearSetHooks() {
		this.#hooks = [];
	}

	/**
	 * Sets a value (if the specified key exists) and calls all hooks.
	 *
	 * @param {string} key
	 * @param {any} value
	 * @param {any} [payload=null]
	 *
	 * @returns {boolean} Whether the key exists.
	 */
	setValue(key, value, payload = null) {
		const has = Object.hasOwn(this.#values, key);

		if (has) {
			const oldValue = this.#values[key];

			this.#values[key] = value;
			this.#hooks.forEach(hook => hook(key, value, payload, oldValue));
		}

		return has;
	}

	/**
	 * Gets a value at the key specified, if it exists.
	 *
	 * @param {string} key
	 * @returns {[true, any]|[false]} Tuple where the first value is whether or not the key exists.
	 *                                If it does, the second value will be the value stored at the key.
	 *                                Otherwise, there will be no second value.
	 */
	getValue(key) {
		if (Object.hasOwn(this.#values, key)) {
			return [true, this.#values[key]];
		}

		return [false];
	}

	/**
	 * Iterates through an object and updates values if the key specified exists.
	 *
	 * @param {object} object
	 *
	 * @returns {number} Number of values successfully updated.
	 */
	updateValues(object) {
		let updated = 0;

		Object.keys(object).forEach(key => {
			updated += this.setValue(key, object[key]); // A lil clever type coercion here.
		});

		return updated;
	}
}
