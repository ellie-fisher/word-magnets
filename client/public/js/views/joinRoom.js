/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

const JoinRoomView = (data = {}) => {
	const { socket } = data;

	const fields = [
		{ id: "roomID", type: "string", label: "Room Code", min: 8, max: 8, default: "" },
		{ id: "clientName", type: "string", label: "Your Name", min: 1, max: 16, default: "" },
	];

	return combineElements(
		"section",
		RoomFieldsFragment({
			fields,
			socket,
			title: "Join a Room",
			buttonText: "Join Room",
			onButtonClick: sendJoinRoom,
		}),
	);
};
