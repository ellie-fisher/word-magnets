/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

import { createState, createSingletonView, $ } from "../framework.js";
import { onPress, onRelease } from "../util.js";
import { RoomStates } from "./state.js";
import { RoomData } from "./state.js";

export const Header = createSingletonView(() => {
	const RoomID = createState(false);

	const labels = { id: $("strong", "Code: "), timeLeft: $("strong", "Time Left: "), round: $("strong", "Round: ") };
	const fields = {
		id: $("button", {
			className: "small room-id",
			...onPress(() => {
				RoomID.set(true);
			}),
			...onRelease(() => {
				RoomID.set(false);
			}),
			onmouseleave() {
				RoomID.set(false);
			},
		}),
		timeLeft: $("span"),
		round: $("span"),
		roundLimit: $("span"),
	};

	// We have this function reassignable so we can change it if its value changes.
	let copyRoomID = () => {};

	Object.keys(RoomData).forEach(key => {
		switch (key) {
			case "id": {
				const hook = () => {
					const id = RoomData.id.get();
					copyRoomID = () => navigator.clipboard.writeText(id);
					fields.id.textContent = RoomID.get() ? id : id.replaceAll(/./g, "•");
				};

				RoomData.id.addHook(hook);
				RoomID.addHook(hook);

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
		$("button", { className: "tab warning" }, "« Exit"),
		$(
			"section",
			{ className: "container room-header" },
			$(
				"section",
				{ className: "room-data-fields" },
				/* Time */
				$("div", labels.timeLeft, fields.timeLeft),

				/* Round */
				$("div", labels.round, fields.round, " / ", fields.roundLimit),
				/* Room ID */
				$(
					"div",
					labels.id,
					$(
						"small",
						fields.id,
						$(
							"button",
							{
								...onRelease(() => {
									copyRoomID();
								}),
							},
							"Copy",
						),
					),
				),
			),
		),
	);
});
