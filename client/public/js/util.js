/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

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
		Object.keys(value).forEach(key => (value[key] = deepFreeze(value[key])));
	}

	return Object.freeze(value);
};

export const onPress = callback => {
	return { onmousedown: callback, ontouchstart: callback };
};

export const onRelease = callback => {
	return {
		onmouseup: callback,
		onmouseleave: callback,
		ontouchend: callback,
		ontouchcancel: callback,
	};
};
