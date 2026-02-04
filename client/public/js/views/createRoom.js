/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

const CreateRoomView = (data = {}) => {
	const { socket } = data;

	const fields = [
		{
			id: "timeLimit",
			type: "int",
			label: "Time Limit (seconds)",
			min: 30,
			max: 120,
			default: 60,
			increments: 10,
		},
		{ id: "roundLimit", type: "int", label: "Rounds", min: 1, max: 12, default: 8 },
		{ id: "clientLimit", type: "int", label: "Player Limit", min: 2, max: 10, default: 6 },
		{ id: "ownerName", type: "string", label: "Your Name", min: 1, max: 16, default: "" },
	];

	return combineElements(
		"section",
		RoomFieldsFragment({
			fields,
			socket,
			title: "Create a Room",
			buttonText: "Create Room",
			onButtonClick: sendCreateRoom,
		}),
	);
};
