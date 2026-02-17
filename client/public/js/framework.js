/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

/**
 * Exceedingly simple frontend framework.
 */

export const createState = (initialValue = null, initialHook = null) => {
	const hooks = new Set();
	let value = null;

	const state = {
		get() {
			return value;
		},

		set(newValue, payload = null) {
			const oldValue = value;
			value = newValue;

			for (const hook of hooks) {
				hook(newValue, payload, oldValue);
			}
		},

		addHook(hook) {
			hooks.add(hook);
		},
	};

	if (initialHook !== null && typeof initialHook === "function") {
		state.addHook(initialHook);
	}

	state.set(initialValue);

	return state;
};

export const createSingletonView = initFunc => {
	let view = null;

	return function () {
		if (view === null) {
			view = initFunc();
		}

		return view;
	};
};

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
 * Wrapper for `document.querySelector()`.
 */
export const $get = selector => document.querySelector(selector);

/**
 * Wrapper for `document.querySelectorAll()`.
 */
export const $getAll = selector => document.querySelectorAll(selector);

/**
 * Creates an element from field data.
 */
export const $field = (field, onchange = () => {}) => {
	switch (field.type) {
		case "STRING":
		case "string": {
			const textbox = $("input", {
				type: "text",
				minLength: field.min,
				maxLength: field.max,
				onchange,
				oninput: onchange,
			});

			if (field.type === "STRING") {
				textbox.autocapitalize = "characters";
			}

			return textbox;
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

/**
 * @param {string} text
 * @param {...} args
 *
 * @returns {HTMLButtonElement}
 */
export const $button = (text, ...args) => {
	if (args.length < 1) {
		return $("button", text);
	}

	if (args.length === 1) {
		if (typeof args[0] === "function") {
			return $("button", { onclick: args[0] }, text);
		}

		return $("button", { className: args[0] }, text);
	}

	return $("button", { className: args[0], onclick: args[1] }, text);
};
