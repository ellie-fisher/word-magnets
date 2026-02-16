/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { AppView } from "./state.js";
import { Title } from "../title/title.js";
import { Room } from "../room/room.js";
import { createSingletonView, $, $get, $replace } from "../framework.js";
import { $message, $error } from "../message.js";

export const App = createSingletonView(() => {
	const element = $get("main");

	let child = "";

	AppView.addHook((value, payload = {}) => {
		child = $error({ title: "Error: ", message: `Unknown view "${value}" (Ask a nerd what this means.)` });

		switch (value) {
			case "loading": {
				child = $message($("strong", "Word Magnets"), " is loading...");
				break;
			}

			case "error": {
				child = $error(payload);
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

		$replace(element, child);
	});

	return element;
});
