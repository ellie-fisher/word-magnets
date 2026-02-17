/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createState, createSingletonView, $, $button } from "../framework.js";
import { copyText } from "../util.js";
import { RoomStates, RoomData } from "./state.js";

export const Header = createSingletonView(() => {
	const ShowRoomID = createState(false);

	const labels = { timeLeft: $("strong", "Time Left: "), round: $("strong", "Round: "), id: $("strong", "Code: ") };
	const fields = {
		timeLeft: $("span"),
		round: $("span"),
		roundLimit: $("span"),
		id: $button("", "room-id", () => ShowRoomID.set(!ShowRoomID.get())),
	};

	const copyButton = $button("Copy", async () => {
		if (!(await copyText(RoomData.id.get()))) {
			alert("Copying text is not supported by your browser at this time.");
		}
	});

	const containers = {
		time: $("div", labels.timeLeft, fields.timeLeft),
		round: $("div", labels.round, fields.round, " / ", fields.roundLimit),
		id: $("div", labels.id, $("small", fields.id, copyButton)),
	};

	Object.keys(RoomData).forEach(key => {
		switch (key) {
			case "id": {
				const hook = () => {
					fields.id.textContent = ShowRoomID.get()
						? RoomData.id.get()
						: RoomData.id.get().replaceAll(/./g, "•");
				};

				RoomData.id.addHook(hook);
				ShowRoomID.addHook(hook);

				break;
			}

			case "state": {
				RoomData.state.addHook(state => {
					const { time, round } = containers;

					if (state === RoomStates.Lobby || state === RoomStates.StartGame) {
						round.classList.add("hidden");
					} else {
						round.classList.remove("hidden");
					}

					if (state === RoomStates.Lobby) {
						time.classList.add("hidden");
					} else {
						time.classList.remove("hidden");
					}
				});

				break;
			}

			case "timeLeft": {
				const hook = () => {
					const state = RoomData.state.get();
					const timeLeft = RoomData.timeLeft.get();

					if (timeLeft <= 10 && (state === RoomStates.Create || state === RoomStates.Vote)) {
						labels.timeLeft.classList.add("danger");
						fields.timeLeft.classList.add("danger");
					} else {
						labels.timeLeft.classList.remove("danger");
						fields.timeLeft.classList.remove("danger");
					}

					labels.timeLeft.textContent = state === RoomStates.StartGame ? "Starting game in " : "Time Left: ";
					fields.timeLeft.textContent = `${timeLeft}`;
				};

				RoomData.state.addHook(hook);
				RoomData.timeLeft.addHook(hook);

				break;
			}

			default: {
				if (Object.hasOwn(fields, key)) {
					RoomData[key].addHook(value => {
						fields[key].textContent = `${value}`;
					});
				}

				break;
			}
		}
	});

	return $(
		"section",
		$button("« Exit", "tab warning"),
		$(
			"section",
			{ className: "container room-header" },
			$(
				"section",
				{ className: "room-data-fields" },

				containers.time,
				containers.round,
				containers.id,
			),
		),
	);
});
