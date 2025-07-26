/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

const JoinRoomView = (data = {}) => {
	const { onFieldChange = () => {} } = data;

	const fields = [
		{ id: "roomID", type: "string", label: "Room Code", min: 8, max: 8 },
		{ id: "name",   type: "string", label: "Your Name", min: 1, max: 16 },
	];

	const button = createElement("input", { type: "button", className: "primary", value: "Join Room", disabled: true });

	return combineElements("section",
		RoomFieldsFragment({
			fields,
			onFieldChange(field, oldValue) {
				button.disabled = !fields.every(validateField);
				onFieldChange(field, oldValue);
			},
		}, button),
	);
};
