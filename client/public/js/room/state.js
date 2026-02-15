/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createSignal } from "../framework.js";
import { RoomStates } from "../packets.js";
import { deepFreeze } from "../util.js";

export const RoomData = { get: {}, set: {} };

const fields = [
	["id", ""],
	["state", RoomStates.Lobby],
	["timeLeft", 0],
	["timeLimit", 0],
	["round", 0],
	["roundLimit", 0],
	["clientLimit", 0],
];

Object.values(fields).forEach(([key, defaultValue]) => {
	[RoomData.get[key], RoomData.set[key]] = createSignal(defaultValue);
});

deepFreeze(RoomData);

export const applyRoomData = (data = {}) => {
	Object.keys(data).forEach(key => {
		if (Object.hasOwn(RoomData.set, key)) {
			RoomData.set[key](data[key]);
		}
	});
};

export const [getClients, setClients] = createSignal([]);
export const [getWords, setWords] = createSignal([]);
export const [getSentences, setSentences] = createSignal([]);
