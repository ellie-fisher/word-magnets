/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { hasIndex } from "../util.js";

export const MAX_LENGTH = 150;

export const sentenceToString = (sentence = [], wordbanks = []) => {
	let str = "";
	let prev = "";
	let singleHyphens = 0;

	for (let i = 0; i < sentence.length; i++) {
		const entry = sentence[i];

		if (!hasIndex(wordbanks, entry.bankIndex)) {
			return [false, "", 0];
		}

		const { words } = wordbanks[entry.bankIndex];

		if (!hasIndex(words, entry.wordIndex)) {
			return [false, "", 0];
		}

		let word = words[entry.wordIndex];

		if (i > 0 && prev.at(-1) !== "-" && word.at(0) !== "-") {
			str += " ";
		}

		// We don't want players to be able to hack around the sentence length limit by setting
		// their name to a hyphen, so we must account for that.
		if (word === "-") {
			singleHyphens++;
		}

		prev = word;

		if (word.at(0) === "-") {
			word = word.slice(1);
		}

		if (word.at(-1) === "-") {
			word = word.slice(0, word.length - 1);
		}

		str += word;
	}

	return [str.length + singleHyphens <= MAX_LENGTH, str, singleHyphens];
};
