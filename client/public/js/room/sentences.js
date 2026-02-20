/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { hasIndex } from "../util.js";

export const MAX_LENGTH = 100;

export const sentenceToString = (sentence = [], wordbanks = []) => {
	let str = "";
	let prev = "";
	let length = 0;

	sentence.forEach((entry, index) => {
		if (!hasIndex(wordbanks, entry.bankIndex)) {
			return ["", 0];
		}

		const { words } = wordbanks[entry.bankIndex];

		if (!hasIndex(words, entry.wordIndex)) {
			return ["", 0];
		}

		let word = words[entry.wordIndex];

		// Account for hyphens and also not insert extra spaces for space tiles.
		if (word !== " " && index > 0 && prev.at(-1) !== "-" && word.at(0) !== "-") {
			str += " ";
			length++;
		}

		prev = word;

		if (word.at(0) === "-") {
			word = word.slice(1);
		}

		if (word.at(-1) === "-") {
			word = word.slice(0, word.length - 1);
		}

		str += word;
		length += Math.max(1, word.length);
	});

	return [str.trim(), length];
};
