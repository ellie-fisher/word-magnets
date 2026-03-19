/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createState } from "../../framework.js";
import { hasIndex } from "../../util/util.js";
import { RoomWords } from "../state.js";
import { MAX_LENGTH, sentenceToString } from "./sentenceToString.js";

export const UserSentence = createState({ words: [], string: "", length: 0 });

export const setSentence = sentence => {
	let success = false;
	const [string, length] = sentenceToString(sentence.words, RoomWords.get());

	if (length <= MAX_LENGTH) {
		success = true;

		sentence.string = string;
		sentence.length = length;

		UserSentence.set(sentence);
	}

	return success;
};

// Adds a word to the sentence. Infinity for the index means "at the end of the sentence".
export const addWord = (word, index = Infinity) => {
	const sentence = { ...UserSentence.get(), words: [...UserSentence.get().words] };

	if (index === Infinity) {
		sentence.words.push(word);
	} else if (hasIndex(sentence.words, index)) {
		sentence.words.splice(index, 0, word);
	}

	return setSentence(sentence);
};

// Move a word in a sentence. Infinity for either index means "at the end of the sentence".
export const moveWord = (fromIndex, toIndex) => {
	const sentence = { ...UserSentence.get(), words: [...UserSentence.get().words] };

	fromIndex = fromIndex === Infinity ? sentence.words.length - 1 : fromIndex;

	if (!hasIndex(sentence.words, fromIndex) || (!hasIndex(sentence.words, toIndex) && toIndex !== Infinity)) {
		return false;
	}

	if (fromIndex !== toIndex) {
		if (toIndex === Infinity) {
			sentence.words.push(sentence.words[fromIndex]);
		} else {
			sentence.words.splice(toIndex, 0, sentence.words[fromIndex]);
		}

		if (fromIndex > toIndex) {
			fromIndex++;
		}

		sentence.words.splice(fromIndex, 1);
	}

	return setSentence(sentence);
};

// Removes a word from the sentence.
export const removeWord = index => {
	const sentence = { ...UserSentence.get(), words: [...UserSentence.get().words] };

	sentence.words.splice(index, 1);

	return setSentence(sentence);
};
