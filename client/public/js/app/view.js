/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createElement, getElement, setChildren } from "../framework.js";
import { MessageView, ErrorMessageView } from "../title/message.js";
import { TitleView } from "./title.js";
import { RoomView } from "../room/room.js";

let initialized = false;

export const AppView = (data = {}) => {
	const { socket = null, state = null } = data;
	const main = getElement("main");

	if (state !== null && !initialized) {
		state.addSetHook((key, value, payload = {}) => {
			if (key !== "view") {
				return;
			}

			let view = "Unknown view! (Ask a nerd what this means.)";

			switch (value) {
				case "loading": {
					view = MessageView(
						null,
						createElement("strong", "Word Magnets"),
						" is loading...",
					);

					break;
				}

				case "error": {
					view = ErrorMessageView({ title: payload.title, message: payload.message });
					break;
				}

				case "title": {
					view = TitleView({ socket });
					break;
				}

				case "room": {
					view = RoomView();
					break;
				}

				default:
					break;
			}

			setChildren(main, view);
		});

		initialized = true;

		state.setValue("view", "loading");
	}

	return main;
};
