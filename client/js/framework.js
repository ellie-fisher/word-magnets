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

const getElement = id => document.getElementById(id);

const combineElements = (parentTag, ...elements) => {
	const parent = createElement(parentTag);
	parent.append(...elements);
	return parent;
};
