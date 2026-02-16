/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createState } from "../framework.js";
import { deepFreeze, enumerate } from "../util.js";
import { MAX_LENGTH, sentenceToString } from "./sentences.js";

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

export const RoomData = {
	id: createState(""),
	ownerID: createState(""),
	state: createState(RoomStates.Lobby),
	timeLeft: createState(0),
	timeLimit: createState(0),
	round: createState(0),
	roundLimit: createState(0),
	clientLimit: createState(0),
};

deepFreeze(RoomData);

export const applyRoomData = (data = {}) => {
	Object.keys(data).forEach(key => {
		if (Object.hasOwn(RoomData, key)) {
			RoomData[key].set(data[key]);
		}
	});
};

export const RoomClients = createState([]);
export const RoomWords = createState([]);
export const Sentence = createState({ words: [], string: "", length: 0 });

export const setSentence = sentence => {
	let success = false;
	const [string, length] = sentenceToString(sentence.words, RoomWords.get());

	if (length <= MAX_LENGTH) {
		success = true;

		sentence.string = string;
		sentence.length = length;

		Sentence.set(sentence);
	}

	return success;
};

export const clearSentence = () => setSentence({ words: [], string: "", length: 0 });
