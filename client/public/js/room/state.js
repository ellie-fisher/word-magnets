/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createState } from "../framework.js";
import { deepFreeze, enumerate, hasIndex } from "../util/util.js";

export const RoomStates = enumerate([
	"Lobby",
	"StartGame",
	"Create",
	"CreateSubmit",
	"Vote",
	"VoteSubmit",
	"Results",
	"End",
]);

export const RoomData = deepFreeze({
	id: createState(""),
	ownerID: createState(""),
	state: createState(RoomStates.Lobby),
	timeLeft: createState(0),
	timeLimit: createState(0),
	round: createState(0),
	roundLimit: createState(0),
	clientLimit: createState(0),
});

export const applyRoomData = (data = {}) => {
	Object.keys(data).forEach(key => {
		RoomData[key].set?.(data[key]);
	});
};

export const RoomClients = createState([]);
export const RoomWords = createState([]);

/**
 * Gets a word string from a bank index and word index. Returns an empty string if either indices are invalid.
 *
 * @param {number} bankIndex
 * @param {number} wordIndex
 *
 * @returns {string}
 */
export const getRoomWord = (bankIndex, wordIndex) => {
	let word = "";
	const banks = RoomWords.get();

	if (hasIndex(banks, bankIndex)) {
		const { words } = banks[bankIndex];

		if (hasIndex(words, wordIndex)) {
			word = words[wordIndex];
		}
	}

	return word;
};

export const RoomSentences = deepFreeze({
	sentences: createState([]),
	vote: createState(-1),
	voteSubmitted: createState(false),
});

export const clearRoomSentences = () => {
	RoomSentences.sentences.reset();
	RoomSentences.vote.reset();
	RoomSentences.voteSubmitted.reset();
};

export const ShowPopup = createState(false);
