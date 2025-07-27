/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

/**
 * A quasi-frontend-framework because we don't need or want any external dependencies.
 */

/**
 * Creates a DOM element.
 *
 * @param {string} tag                      - The tag of the element to create.
 * @param {object|string} fieldsOrInnerHTML - If it's an object, it's used as an attributes object. If it's a string,
 *                                            it sets the element's `innerHTML` property.
 * @param {string} innerHTML                - Sets the element's `innerHTML` property ONLY if `fieldsOrInnerHTML` is
 *                                            an attributes object.
 * @returns Node
 */
const createElement = (tag, fieldsOrInnerHTML = {}, innerHTML = "") => {
	const element = document.createElement(tag);

	if (typeof(fieldsOrInnerHTML) === "object") {
		Object.keys(fieldsOrInnerHTML).forEach(key => element[key] = fieldsOrInnerHTML[key]);
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
const getElement = id => document.getElementById(id);

/**
 * Combines multiple elements into one new parent tag.
 *
 * @param {string} parentTag    - The tag of the parent element to create.
 * @param {...Node|object} args - The elements to add to the new parent. If the first item is a plain object, it is
 *                                used as an attributes object instead.
 * @returns Node
 */
const combineElements = (parentTag, ...args) => {
	const parent = createElement(parentTag);

	// The second argument can optionally be an attributes object.
	if (args.length > 0 && typeof(args[0]) === "object" && !(args[0] instanceof Node)) {
		const attributes = args[0];

		Object.keys(attributes).forEach(key => parent[key] = attributes[key]);
		args = args.slice(1);
	}

	parent.append(...args);

	return parent;
};
