/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { $ } from "./framework.js";

export const flagFixed = 1 << 0;
export const flagPlayer = 1 << 1;

/**
 * Returns a number whose value is limited to the given range.
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 *
 * @returns {number} A number in the range [min, max]
 */
export const clamp = (value, min, max) => {
	return Math.min(Math.max(value, min), max);
};

/**
 * Gives an array enum-like functionality.
 *
 * @param {any[]} arr
 *
 * @returns {any[]}
 */
export const enumerate = arr => {
	arr.forEach((value, index) => {
		arr[value] = index;
	});

	return arr;
};

export const validateField = (field, value) => {
	switch (field.type) {
		case "STRING":
		case "string": {
			return value.length >= field.min && value.length <= field.max;
		}

		case "int": {
			const parsed = parseInt(value);

			return !isNaN(parsed) && parsed >= field.min && parsed <= field.max;
		}

		default:
			return false;
	}
};

/**
 * Recursively freezes an object and all its values/children.
 *
 * @param {any} value
 * @param {Set<any>} visited
 *
 * @returns {any}
 */
export const deepFreeze = (value, visited = new Set()) => {
	if (!visited.has(value) && typeof value === "object") {
		visited.add(value);
		Object.keys(value).forEach(key => deepFreeze(value[key]));
	}

	return Object.freeze(value);
};

/**
 * Returns whether a value is a valid index of the specified array.
 *
 * @param {any[]} array
 * @param {number} index
 *
 * @returns {boolean}
 */
export const hasIndex = (array, index) => {
	return Array.isArray(array) && Number.isInteger(index) && index >= 0 && index < array.length;
};
