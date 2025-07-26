/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

// enumerate makes an array able to be used as an enum by mapping its values to its indices.
const enumerate = arr => {
	arr.forEach((value, index) => {
		arr[value] = index;
	});

	return arr;
};
