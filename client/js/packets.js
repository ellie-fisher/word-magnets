/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
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

	"CreateJoinRoomErrorPacket",
	"RoomDestroyedPacket",
	"RoomDataPacket",
	"RoomClientsPacket",
	"RoomWordsPacket",
	"RoomSentencesPacket",
]);

/**
 * ByteReader is a class for reading Uint8Arrays.
 */
class ByteReader {
	constructor(arr) {
		this._arr = arr;
		this._index = 0;
	}

	isAtEnd() {
		return this._index >= this._arr.length;
	}

	readU8() {
		return this.isAtEnd() ? 0 : this._arr[this._index++];
	}

	readString() {
		let str = "";
		const length = this.readU8();

		for (let i = 0; i < length; i++) {
			str += String.fromCharCode(this.readU8());
		}

		return str;
	}
};

const readCreateJoinRoomError = reader => {
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
}
