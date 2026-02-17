/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { AppView, ClientID } from "./app/state.js";
import { PacketTypes, PacketReader } from "./packets/io.js";

import {
	readClientInfo,
	readServerInfo,
	readRoomConnectError,
	readRoomData,
	readRoomClients,
	readRoomWords,
	readRoomDestroyed,
	readRoomSentences,
} from "./packets/receive.js";

import { applyRoomData, RoomClients, RoomWords, RoomSentences } from "./room/state.js";

const PROTOCOL_APP = "word-magnets";
const PROTOCOL_BRANCH = "vanilla";
const PROTOCOL_NAME = `${PROTOCOL_APP}.${PROTOCOL_BRANCH}`;
const PROTOCOL_VERSION = 1;

let url = `${window.location.hostname}${window.location.pathname === "/" ? "" : window.location.pathname}:4000`;

if (window.location.protocol === "https:") {
	url = `wss://${url}`;
} else {
	url = `ws://${url}`;
}

let wasConnected = false;

const socket = new WebSocket(url, [`${PROTOCOL_NAME}#${PROTOCOL_VERSION}`]);

socket.onopen = () => {
	wasConnected = true;
	AppView.set("title");
};

socket.onclose = event => {
	let message = wasConnected
		? "Lost connection to the main server. Please refresh the page or try again later."
		: "Could not connect to the main server.";

	const { reason } = event;

	if (typeof reason === "string" && reason !== "") {
		message = reason;
	}

	AppView.set("error", { title: "Socket Error: ", message });
};

socket.onerror = socket.onclose;

socket.onmessage = async event => {
	const packet = new Uint8Array(await event.data.arrayBuffer());
	const reader = new PacketReader(packet);

	console.log(packet);

	switch (reader.readU8()) {
		case PacketTypes.ClientInfoPacket: {
			const { clientID = "" } = readClientInfo(reader);
			ClientID.set(clientID);
			break;
		}

		case PacketTypes.ServerInfoPacket: {
			console.log("Server Info:", readServerInfo(reader));
			break;
		}

		case PacketTypes.RoomConnectErrorPacket: {
			const { wasCreating, message } = readRoomConnectError(reader);
			AppView.set("error", { title: wasCreating ? "Could not create room: " : "Could not join room: ", message });
			break;
		}

		case PacketTypes.RoomDestroyedPacket: {
			AppView.set("error", { title: "Disconnected: ", message: readRoomDestroyed(reader) });
			break;
		}

		case PacketTypes.RoomDataPacket: {
			AppView.set("room");
			applyRoomData(readRoomData(reader));
			break;
		}

		case PacketTypes.RoomClientsPacket: {
			RoomClients.set(readRoomClients(reader));
			break;
		}

		case PacketTypes.RoomWordsPacket: {
			RoomWords.set(readRoomWords(reader));
			break;
		}

		case PacketTypes.RoomSentencesPacket: {
			RoomSentences.set(readRoomSentences(reader));
			break;
		}

		default: {
			break;
		}
	}
};

export { socket };
