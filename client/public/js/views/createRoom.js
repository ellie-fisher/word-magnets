/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

const CreateRoomView = (data = {}) => {
	const { onFieldChange = () => {}, socket } = data;

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

	let waiting = false;

	const button = createElement("input", {
		type: "button",
		className: "primary",
		value: "Create Room",
		disabled: true,
		onclick() {
			waiting = true;
			button.disabled = true;

			const userData = {};

			fields.forEach(field => (userData[field.id] = field.value));

			sendCreateRoom(socket, userData);
		},
	});

	return combineElements(
		"section",
		RoomFieldsFragment(
			{
				fields,
				title: "Create a Room",
				onFieldChange(field, oldValue) {
					button.disabled = waiting || !fields.every(validateField);
					onFieldChange(field, oldValue);
				},
			},
			button,
		),
	);
};
