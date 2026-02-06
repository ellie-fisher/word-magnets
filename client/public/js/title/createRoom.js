/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { combineElements } from "../framework.js";
import { Fields } from "../fields.js";
import { sendCreateRoom } from "../packets.js";
import { RoomFieldsView } from "./roomFields.js";

export const CreateRoomView = (data = {}) => {
	const { socket } = data;

	const fields = structuredClone(Fields.createRoom);

	return combineElements(
		"section",
		RoomFieldsView({
			fields,
			socket,
			title: "Create a Room",
			buttonText: "Create Room",
			onButtonClick: sendCreateRoom,
		}),
	);
};
