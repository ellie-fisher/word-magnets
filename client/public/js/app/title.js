/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createButton, combineElements } from "../framework.js";
import { CreateRoomView } from "../title/createRoom.js";
import { JoinRoomView } from "../title/joinRoom.js";

export const TitleView = (data = {}) => {
	const updateTabs = showCreate => {
		elements[0].disabled = showCreate;
		elements[1].disabled = !showCreate;
		elements[2].hidden = !showCreate;
		elements[3].hidden = showCreate;
	};

	const elements = [
		createButton("Create", "tab", () => updateTabs(true)),
		createButton("Join", "tab", () => updateTabs(false)),
		CreateRoomView(data),
		JoinRoomView(data),
	];

	updateTabs(true);

	return combineElements("article", ...elements);
};
