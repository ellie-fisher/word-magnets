/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createEffect, createSignal, createElement, getElement } from "./framework.js";
import { createMessage, createErrorMessage } from "./message.js";

import { Title } from "./title/title.js";
import { Room } from "./room/room.js";

const [view, setView] = createSignal("loading");

export const App = () => {
	const element = getElement("main");

	let child = "";

	createEffect((payload = {}) => {
		child = createErrorMessage("Error: ", "Unknown view! (Ask a nerd what this means.)");

		switch (view()) {
			case "loading": {
				child = createMessage(createElement("strong", "Word Magnets"), " is loading...");
				break;
			}

			case "error": {
				child = createErrorMessage(payload.title, payload.message);
				break;
			}

			case "title": {
				child = Title(payload);
				break;
			}

			case "room": {
				child = Room(payload);
				break;
			}

			default:
				break;
		}

		element.replaceChildren(child);
	});

	return element;
};

export const setAppView = setView;
