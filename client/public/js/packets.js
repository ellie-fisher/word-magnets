/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

const PacketTypes = enumerate([
	"InvalidPacket",

	/* Client=>Server */

	"CreateRoomPacket",
	"JoinRoomPacket",
	"LeaveRoomPacket",
	"RemoveClientPacket",
	"StartGamePacket",
	"SubmitSentencePacket",
	"SubmitVotePacket",

	/* Server=>Client */

	"CreateRoomErrorPacket",
	"JoinRoomErrorPacket",
	"RoomDestroyedPacket",
	"RoomDataPacket",
	"RoomClientsPacket",
	"RoomWordsPacket",
	"RoomSentencesPacket",
]);

const RoomStates = enumerate([
	"Lobby",
	"Create",
	"CreateSubmit",
	"Vote",
	"VoteSubmit",
	"Results",
	"End",
]);

const U8_MAX_VALUE = 255;
const MAX_STRING_LENGTH = 255;

/**
 * ByteReader is a class for reading Uint8Arrays.
 */
class ByteReader {
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

	readString() {
		let str = "";
		const length = this.readU8();

		for (let i = 0; i < length; i++) {
			str += String.fromCharCode(this.readU8());
		}

		return str;
	}
}

const readCreateRoomError = reader => {
	return reader.readString();
};

const readJoinRoomError = reader => {
	return reader.readString();
};

const readRoomDestroyed = reader => {
	return reader.readString();
};

const readRoomData = reader => {
	return {
		id: reader.readString(),
		state: reader.readU8(),
		timeLeft: reader.readU8(),
		timeLimit: reader.readU8(),
		round: reader.readU8(),
		roundLimit: reader.readU8(),
		clientLimit: reader.readU8(),
	};
};

const readRoomClients = reader => {
	const clients = [];
	const count = reader.readU8();

	for (let i = 0; i < count; i++) {
		clients.push({ id: reader.readString(), name: reader.readString() });
	}

	return clients;
};

const readRoomWords = reader => {
	const wordbanks = [];
	const bankCount = reader.readU8();

	for (let i = 0; i < bankCount; i++) {
		const wordCount = reader.readU8();
		const bank = [];

		for (let j = 0; j < wordCount; j++) {
			bank.push(reader.readString());
		}

		wordbanks.push(bank);
	}

	return wordbanks;
};

const readRoomSentences = reader => {
	const sentences = [];
	const sentenceCount = reader.readU8();

	for (let i = 0; i < sentenceCount; i++) {
		const wordCount = reader.readU8();
		const sentence = [];

		for (let j = 0; j < wordCount; j++) {
			sentence.push({ bankIndex: reader.readU8(), wordIndex: reader.readU8() });
		}

		sentences.push(sentence);
	}

	return sentences;
};

/**
 * ByteWriter is a class for writing Uint8Arrays.
 */
class ByteWriter {
	constructor() {
		this._array = [];
		this._index = 0;
	}

	bytes() {
		return new Uint8Array(this._array);
	}

	writeU8(value) {
		value %= U8_MAX_VALUE + 1;

		if (this._index < this._array.length) {
			this._array[this._index] = value;
		} else {
			this._array.push(value);
		}

		this._index++;
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

const sendCreateRoom = (socket, data) => {
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

const sendJoinRoom = (socket, data) => {
	const writer = new ByteWriter();

	writer.write(PacketTypes.JoinRoomPacket, String(data.roomID), String(data.clientName));
	socket.send(writer.bytes());
};
