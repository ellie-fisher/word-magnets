/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

/**
 * Views:
 *   - Loading
 *     - Error
 *   - Create room
 *     - Error
 *   - Join room
 *     - Error
 *   - Lobby
 *   - Create
 *   - Vote
 *   - Results
 *   - End
 *   - Disconnected from room
 */

import {
	ByteReader,
	PacketTypes,
	readRoomClients,
	readRoomConnectError,
	readRoomData,
	readRoomDestroyed,
	readRoomSentences,
	readRoomWords,
} from "./packets.js";

import { App, setAppView } from "./app.js";
import { setRoomData, setClients, setWords, setSentences } from "./room/state.js";

const PROTOCOL_APP = "word-magnets";
const PROTOCOL_BRANCH = "vanilla";
const PROTOCOL_NAME = `${PROTOCOL_APP}.${PROTOCOL_BRANCH}`;
const PROTOCOL_VERSION = 1;

document.addEventListener("DOMContentLoaded", () => {
	let url = `${window.location.hostname}${window.location.pathname === "/" ? "" : window.location.pathname}:4000`;

	if (window.location.protocol === "https:") {
		url = `wss://${url}`;
	} else {
		url = `ws://${url}`;
	}

	const socket = new WebSocket(url, [`${PROTOCOL_NAME}#${PROTOCOL_VERSION}`]);

	App();
	setAppView("loading");

	let openedOnce = false;

	socket.onopen = () => {
		openedOnce = true;
		setAppView("title", { socket });
	};

	socket.onclose = event => {
		let message = openedOnce
			? "Lost connection to the main server. Please refresh the page or try again later."
			: "Could not connect to the main server.";

		const { reason } = event;

		if (typeof reason === "string" && reason !== "") {
			message = reason;
		}

		setAppView("error", { title: "Socket Error: ", showButton: false, message, socket });
	};

	socket.onerror = socket.onclose;

	socket.onmessage = async event => {
		const packet = new Uint8Array(await event.data.arrayBuffer());
		const reader = new ByteReader(packet);

		console.log(packet);

		switch (reader.readU8()) {
			case PacketTypes.RoomConnectErrorPacket: {
				const { wasCreating, message } = readRoomConnectError(reader);

				setAppView("error", {
					title: wasCreating ? "Could not create room: " : "Could not join room: ",
					message,
					socket,
				});

				break;
			}

			case PacketTypes.RoomDestroyedPacket: {
				setAppView("error", { title: "Disconnected: ", message: readRoomDestroyed(reader), socket });
				break;
			}

			case PacketTypes.RoomDataPacket: {
				setAppView("room", { socket });
				setRoomData(readRoomData(reader));
				break;
			}

			case PacketTypes.RoomClientsPacket: {
				setClients(readRoomClients(reader));
				break;
			}

			case PacketTypes.RoomWordsPacket: {
				setWords(readRoomWords(reader));
				break;
			}

			case PacketTypes.RoomSentencesPacket: {
				setSentences(readRoomSentences(reader));
				break;
			}

			default: {
				break;
			}
		}
	};
});
