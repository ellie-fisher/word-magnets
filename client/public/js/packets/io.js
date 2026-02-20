/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { clamp, enumerate } from "../util.js";

export const PacketTypes = enumerate([
	"InvalidPacket",

	/* Client=>Server */

	"RequestServerInfoPacket",
	"CreateRoomPacket",
	"JoinRoomPacket",
	"LeaveRoomPacket",
	"RemoveClientPacket",
	"StartGamePacket",
	"CancelStartGamePacket",
	"SubmitSentencePacket",
	"SubmitVotePacket",

	/* Server=>Client */

	"ClientInfoPacket",
	"ServerInfoPacket",
	"RoomConnectErrorPacket",
	"RoomDestroyedPacket",
	"RoomDataPacket",
	"RoomClientsPacket",
	"RoomWordsPacket",
	"RoomSentencesPacket",
]);

export const U8_MAX_VALUE = 255;

export const I8_MIN_VALUE = -128;
export const I8_MAX_VALUE = 127;

export const MAX_STRING_LENGTH = U8_MAX_VALUE;

/**
 * PacketReader is a class for reading Uint8Arrays.
 */
export class PacketReader {
	constructor(array) {
		this._array = array;
		this._view = new DataView(this._array.buffer);
		this._index = 0;
	}

	isAtEnd() {
		return this._index >= this._array.length;
	}

	readU8() {
		return this.isAtEnd() ? 0 : this._view.getUint8(this._index++);
	}

	readU32() {
		let value = 0;

		try {
			value = this._view.getUint32(this._index, true);
			this._index += 4;
		} catch {}

		return value;
	}

	readI8() {
		return this.isAtEnd() ? 0 : this._view.getInt8(this._index++);
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

/**
 * PacketWriter is a class for writing Uint8Arrays.
 */
export class PacketWriter {
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

	writeI8(value) {
		value = clamp(value, I8_MIN_VALUE, I8_MAX_VALUE);

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
