/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { PacketTypes, PacketWriter, U8_MAX_VALUE } from "./io.js";
import { socket } from "../socket.js";

export const sendRequestServerInfo = () => {
	const writer = new PacketWriter();
	writer.write(PacketTypes.RequestServerInfoPacket);
	socket.send(writer.bytes());
};

/**
 * @param {object} data
 */
export const sendCreateRoom = data => {
	const writer = new PacketWriter();

	writer.write(
		PacketTypes.CreateRoomPacket,
		String(data.ownerName.trim()),
		parseInt(data.timeLimit),
		parseInt(data.roundLimit),
		parseInt(data.clientLimit),
	);

	socket.send(writer.bytes());
};

/**
 * @param {object} data
 */
export const sendJoinRoom = data => {
	const writer = new PacketWriter();

	writer.write(PacketTypes.JoinRoomPacket, String(data.roomID.trim()), String(data.clientName.trim()));
	socket.send(writer.bytes());
};

export const sendStartGame = () => {
	const writer = new PacketWriter();

	writer.write(PacketTypes.StartGamePacket);
	socket.send(writer.bytes());
};

export const sendCancelStartGame = () => {
	const writer = new PacketWriter();

	writer.write(PacketTypes.CancelStartGamePacket);
	socket.send(writer.bytes());
};

export const sendLeaveRoom = () => {
	const writer = new PacketWriter();

	writer.write(PacketTypes.LeaveRoomPacket);
	socket.send(writer.bytes());
};

export const sendSubmitSentence = ({ words }) => {
	const writer = new PacketWriter();
	const length = Math.min(words.length, U8_MAX_VALUE);

	writer.write(PacketTypes.SubmitSentencePacket, length);

	for (let i = 0; i < length; i++) {
		writer.write(words[i].bankIndex, words[i].wordIndex);
	}

	socket.send(writer.bytes());
};
