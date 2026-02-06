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

import { AppView } from "./app/view.js";
import { AppState } from "./app/state.js";
import { ByteReader, PacketTypes, readCreateRoomError, readJoinRoomError } from "./packets.js";

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
	const appView = AppView({ socket, state: AppState });

	let openedOnce = false;

	socket.onopen = () => {
		openedOnce = true;
		AppState.setValue("view", "title");
	};

	socket.onclose = event => {
		let message = openedOnce
			? "Lost connection to the main server. Please refresh the page or try again later."
			: "Could not connect to the main server.";

		if (event.reason != "") {
			message = event.reason;
		}

		AppState.setValue("view", "error", { title: "Socket Error: ", message });
	};

	socket.onerror = socket.onclose;

	socket.onmessage = async event => {
		const packet = new Uint8Array(await event.data.arrayBuffer());
		const reader = new ByteReader(packet);

		console.log(packet);

		switch (reader.readU8()) {
			case PacketTypes.CreateRoomErrorPacket: {
				AppState.setValue("view", "error", {
					title: "Could not create room: ",
					message: readCreateRoomError(reader),
				});

				break;
			}

			case PacketTypes.JoinRoomErrorPacket: {
				AppState.setValue("view", "error", {
					title: "Could not join room: ",
					message: readJoinRoomError(reader),
				});

				break;
			}

			case PacketTypes.RoomDestroyedPacket: {
				break;
			}

			case PacketTypes.RoomDataPacket: {
				AppState.setValue("view", "room");
				/*const roomData = readRoomData(reader);

				RoomState.updateValues(roomData);
				setChildren(main, RoomLobbyView());*/
				break;
			}

			case PacketTypes.RoomClientsPacket: {
				break;
			}

			case PacketTypes.RoomWordsPacket: {
				break;
			}

			case PacketTypes.RoomSentencesPacket: {
				break;
			}

			default: {
				break;
			}
		}
	};
});
