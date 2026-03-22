/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { deepFreeze } from "./util/util.js";

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

		reset() {
			state.set(deepFreeze(initialValue));
		},

		addHook(hook, initTrigger = true) {
			hooks.add(hook);

			if (initTrigger) {
				hook(value, null, value);
			}
		},
	};

	if (initialHook !== null && typeof initialHook === "function") {
		state.addHook(initialHook);
	}

	state.set(initialValue);
	initialValue = deepFreeze(initialValue);

	return state;
};

export const $singleton = (logic = {}) => {
	let view = null;

	return function () {
		if (view === null) {
			view = logic.$element();
			view.__$logic$__ = logic;
		}

		return view;
	};
};

const onMount = element => {
	if (element instanceof HTMLElement) {
		for (const child of element.children) {
			onMount(child);
		}

		element.__$logic$__?.onMount?.();
	}
};

const onUnmount = element => {
	if (element instanceof HTMLElement) {
		for (const child of element.children) {
			onUnmount(child);
		}

		element.__$logic$__?.onUnmount?.();
	}
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
 * @returns {HTMLElement}
 */
export const $ = (tag, ...args) => {
	const element = document.createElement(tag);

	let i = 0;

	// Check whether second argument is an attributes object.
	if (args.length >= i && typeof args[i] === "object" && !(args[i] instanceof Node)) {
		const attributes = args[i];

		Object.keys(attributes).forEach(key => {
			const attr = attributes[key];

			// The `style` attribute can only be set per-field so we have to do this.
			if (key === "style") {
				Object.keys(attr).forEach(styleKey => (element.style[styleKey] = attr[styleKey]));
			} else {
				element[key] = attr;
			}
		});

		i++;
	}

	// Check whether second or third argument is for `textContent`.
	if (args.length >= i && typeof args[i] === "string") {
		element.textContent = args[i];
		i++;
	}

	// The rest of the arguments are children.
	const children = args.slice(i);

	for (const child of children) {
		element.append(child);
		onMount(child);
	}

	return element;
};

/**
 * Replaces an element's children with new ones.
 */
export const $replace = (element, ...children) => {
	for (const child of element.children) {
		onUnmount(child);
	}

	element.replaceChildren(...children);

	for (const child of element.children) {
		onMount(child);
	}

	return element;
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
 * Returns the center coordinate of an element.
 *
 * @param {HTMLElement} element
 *
 * @returns {{x: number, y: number}}
 */
export const $center = element => {
	const { left, top, width, height } = element.getBoundingClientRect();

	return { x: left + width / 2, y: top + height / 2 };
};
