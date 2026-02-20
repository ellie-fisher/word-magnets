/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createSingletonView, $, $replace } from "../framework.js";
import { RoomData, RoomClients } from "./state.js";
import { ClientInfo } from "../app/state.js";
import { Table } from "./table.js";

export const End = createSingletonView(() => {
	const scores = $("p");

	const hook = () => {
		const clients = structuredClone(RoomClients.get());
		let highestScore = 0;

		clients.sort((client1, client2) => {
			if (client1.score > highestScore) {
				highestScore = client1.score;
			}

			if (client2.score > highestScore) {
				highestScore = client2.score;
			}

			return client2.score - client1.score;
		});

		const rows = clients.map(client => {
			let className = "";

			if (client.id === ClientInfo.get().clientID) {
				className += " selected";
			}

			if (client.score >= highestScore) {
				className += " room-owner";
			}

			return className === "" ? [client.score, client.name] : [{ className }, [client.score, client.name]];
		});

		$replace(
			scores,
			Table(
				[
					["Score", "5%"],
					["Player", "95%"],
				],
				...rows,
			),
		);
	};

	RoomData.state.addHook(hook);
	RoomClients.addHook(hook);

	return $("section", $("p", $("strong", "Final Scores:"), scores));
});
