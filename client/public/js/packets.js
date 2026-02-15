/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { clamp, enumerate } from "./util.js";

export const PacketTypes = enumerate([
	"InvalidPacket",

	/* Client=>Server */

	"CreateRoomPacket",
	"JoinRoomPacket",
	"LeaveRoomPacket",
	"RemoveClientPacket",
	"StartGamePacket",
	"CancelStartGamePacket",
	"SubmitSentencePacket",
	"SubmitVotePacket",

	/* Server=>Client */

	"ServerInfoPacket",
	"RoomConnectErrorPacket",
	"RoomDestroyedPacket",
	"RoomDataPacket",
	"RoomClientsPacket",
	"RoomWordsPacket",
	"RoomSentencesPacket",
]);

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

const U8_MAX_VALUE = 255;
const MAX_STRING_LENGTH = 255;

const roomDataFlagRoomID = 1 << 0;
const roomDataFlagOwnerID = 1 << 1;
const roomDataFlagState = 1 << 2;
const roomDataFlagTimeLeft = 1 << 3;
const roomDataFlagTimeLimit = 1 << 4;
const roomDataFlagRound = 1 << 5;
const roomDataFlagRoundLimit = 1 << 6;
const roomDataFlagClientLimit = 1 << 7;

/**
 * ByteReader is a class for reading Uint8Arrays.
 */
export class ByteReader {
	constructor(array) {
		this._array = array;
		this._index = 0;
	}

	isAtEnd() {
		return this._index >= this._array.length;
	}

	readU8() {
		return this.isAtEnd() ? 0 : this._array[this._index++];
	}

	readBool() {
		return this.readU8() != 0;
	}

	readString() {
		let str = "";
		const length = this.readU8();

		for (let i = 0; i < length; i++) {
			str += String.fromCharCode(this.readU8());
		}

		return str;
	}

	readU8Cond(outObject, key, test) {
		if (test) {
			outObject[key] = this.readU8();
		}
	}

	readStringCond(outObject, key, test) {
		if (test) {
			outObject[key] = this.readString();
		}
	}
}

export const readRoomConnectError = reader => {
	return { wasCreating: !!reader.readU8(), message: reader.readString() };
};

export const readRoomDestroyed = reader => {
	return reader.readString();
};

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

export const readRoomClients = reader => {
	const clients = [];
	const count = reader.readU8();

	for (let i = 0; i < count; i++) {
		clients.push({ id: reader.readString(), name: reader.readString() });
	}

	return clients;
};

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

export const readRoomSentences = reader => {
	const sentences = [];
	const anonymous = reader.readBool();
	const sentenceCount = reader.readU8();

	for (let i = 0; i < sentenceCount; i++) {
		sentences.push({ authorID: anonymous ? "" : reader.readString(), value: reader.readString() });
	}

	return sentences;
};

/**
 * ByteWriter is a class for writing Uint8Arrays.
 */
export class ByteWriter {
	constructor() {
		this._array = [];
		this._index = 0;
	}

	bytes() {
		return new Uint8Array(this._array);
	}

	writeU8(value) {
		value = clamp(value, 0, U8_MAX_VALUE);

		if (this._index < this._array.length) {
			this._array[this._index] = value;
		} else {
			this._array.push(value);
		}

		this._index++;
	}

	writeBool(value) {
		this.writeU8(value != 0);
	}

	writeString(value) {
		const truncated = value.length > MAX_STRING_LENGTH;

		if (truncated) {
			value = value.slice(0, MAX_STRING_LENGTH);
		}

		this.writeU8(value.length);

		for (const ch of value) {
			this.writeU8(ch.charCodeAt(0));
		}

		return truncated;
	}

	write(...values) {
		let success = true;

		for (const value of values) {
			switch (typeof value) {
				case "number":
					success = Number.isInteger(value) && value >= 0 && value <= U8_MAX_VALUE;

					if (success) {
						this.writeU8(value);
					}

					break;

				case "string":
					this.writeString(value);
					break;

				default:
					success = false;
					break;
			}

			if (!success) {
				break;
			}
		}

		return success;
	}
}

export const sendCreateRoom = (socket, data) => {
	const writer = new ByteWriter();

	writer.write(
		PacketTypes.CreateRoomPacket,
		String(data.ownerName.trim()),
		parseInt(data.timeLimit),
		parseInt(data.roundLimit),
		parseInt(data.clientLimit),
	);

	socket.send(writer.bytes());
};

export const sendJoinRoom = (socket, data) => {
	const writer = new ByteWriter();

	writer.write(PacketTypes.JoinRoomPacket, String(data.roomID.trim()), String(data.clientName.trim()));
	socket.send(writer.bytes());
};

export const sendStartGame = socket => {
	const writer = new ByteWriter();

	writer.write(PacketTypes.StartGamePacket);
	socket.send(writer.bytes());
};

export const sendCancelStartGame = socket => {
	const writer = new ByteWriter();

	writer.write(PacketTypes.CancelStartGamePacket);
	socket.send(writer.bytes());
};

export const sendLeaveRoom = socket => {
	const writer = new ByteWriter();

	writer.write(PacketTypes.LeaveRoomPacket);
	socket.send(writer.bytes());
};
