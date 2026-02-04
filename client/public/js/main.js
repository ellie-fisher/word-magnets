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

document.addEventListener("DOMContentLoaded", () => {
	const main = getElement("main");

	let url = `${window.location.hostname}${window.location.pathname === "/" ? "" : window.location.pathname}:4000`;

	if (window.location.protocol === "https:") {
		url = `wss://${url}`;
	} else {
		url = `ws://${url}`;
	}

	const socket = new WebSocket(url);

	let openedOnce = false;

	socket.onopen = () => {
		openedOnce = true;
		setChildren(main, createElement("h1", "Word Magnets"), CreateJoinView({ socket }));
	};

	socket.onclose = () => {
		setChildren(
			main,
			ErrorMessageView({
				title: "Socket Error: ",
				message: openedOnce
					? "Lost connection to the main server. Please refresh the page or try again later."
					: "Could not connect to the main server.",
			}),
		);
	};

	socket.onerror = socket.onclose;

	socket.onmessage = async event => {
		const packet = new Uint8Array(await event.data.arrayBuffer());
		const reader = new ByteReader(packet);

		console.log(packet);

		switch (reader.readU8()) {
			case PacketTypes.CreateRoomErrorPacket: {
				setChildren(
					main,
					ErrorMessageView({
						title: "Could not create room: ",
						message: readCreateRoomError(reader),
					}),
				);
				break;
			}
			case PacketTypes.JoinRoomErrorPacket: {
				setChildren(
					main,
					ErrorMessageView({
						title: "Could not join room: ",
						message: readJoinRoomError(reader),
					}),
				);
				break;
			}

			case PacketTypes.RoomDestroyedPacket: {
				break;
			}

			case PacketTypes.RoomDataPacket: {
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

	main.append(MessageView(null, createElement("strong", "Word Magnets"), " is loading..."));
});
