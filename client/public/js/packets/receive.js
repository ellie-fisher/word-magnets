/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

const roomDataFlagRoomID = 1 << 0;
const roomDataFlagOwnerID = 1 << 1;
const roomDataFlagState = 1 << 2;
const roomDataFlagTimeLeft = 1 << 3;
const roomDataFlagTimeLimit = 1 << 4;
const roomDataFlagRound = 1 << 5;
const roomDataFlagRoundLimit = 1 << 6;
const roomDataFlagClientLimit = 1 << 7;

/**
 * @param {PacketReader} reader
 * @returns {object}
 */
export const readRoomConnectError = reader => {
	return { wasCreating: !!reader.readU8(), message: reader.readString() };
};

/**
 * @param {PacketReader} reader
 * @returns {string}
 */
export const readRoomDestroyed = reader => {
	return reader.readString();
};

/**
 * @param {PacketReader} reader
 * @returns {object}
 */
export const readRoomData = reader => {
	const data = {};
	const flags = reader.readU8();

	reader.readStringCond(data, "id", flags & roomDataFlagRoomID);
	reader.readStringCond(data, "ownerID", flags & roomDataFlagOwnerID);
	reader.readU8Cond(data, "state", flags & roomDataFlagState);
	reader.readU8Cond(data, "timeLeft", flags & roomDataFlagTimeLeft);
	reader.readU8Cond(data, "timeLimit", flags & roomDataFlagTimeLimit);
	reader.readU8Cond(data, "round", flags & roomDataFlagRound);
	reader.readU8Cond(data, "roundLimit", flags & roomDataFlagRoundLimit);
	reader.readU8Cond(data, "clientLimit", flags & roomDataFlagClientLimit);

	return data;
};

/**
 * @param {PacketReader} reader
 * @returns {object[]}
 */
export const readRoomClients = reader => {
	const clients = [];
	const count = reader.readU8();

	for (let i = 0; i < count; i++) {
		clients.push({ id: reader.readString(), name: reader.readString() });
	}

	return clients;
};

/**
 * @param {PacketReader} reader
 * @returns {object[]}
 */
export const readRoomWords = reader => {
	const wordbanks = [];
	const bankCount = reader.readU8();

	for (let i = 0; i < bankCount; i++) {
		const flags = reader.readU8();
		const wordCount = reader.readU8();
		const words = [];

		for (let j = 0; j < wordCount; j++) {
			words.push(reader.readString());
		}

		wordbanks.push({ index: i, flags, words });
	}

	return wordbanks;
};

/**
 * @param {PacketReader} reader
 * @returns {object[]}
 */
export const readRoomSentences = reader => {
	const sentences = [];
	const anonymous = reader.readBool();
	const sentenceCount = reader.readU8();

	for (let i = 0; i < sentenceCount; i++) {
		sentences.push({ authorID: anonymous ? "" : reader.readString(), value: reader.readString() });
	}

	return sentences;
};
