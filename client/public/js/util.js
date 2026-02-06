/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

/**
 * enumerate makes an array able to be used as an enum by mapping its values to its indices.
 */
export const enumerate = arr => {
	arr.forEach((value, index) => {
		arr[value] = index;
	});

	return arr;
};

export const validateField = (field, value) => {
	switch (field.type) {
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

export const deepFreeze = (value, visited = new Set()) => {
	if (!visited.has(value) && typeof value === "object") {
		visited.add(value);
		Object.keys(value).forEach(key => (value[key] = deepFreeze(value[key])));
	}

	return Object.freeze(value);
};
