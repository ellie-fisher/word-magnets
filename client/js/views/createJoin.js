/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

const CreateJoinView = (data = {}) => {
	const updateTabs = showCreate => {
		createView.hidden = !showCreate;
		createButton.disabled = showCreate;
		joinView.hidden = showCreate;
		joinButton.disabled = !showCreate;
	};

	const createView = CreateRoomView();
	const createButton = createElement("input", { type: "button", value: "Create", onclick() { updateTabs(true); }});
	const joinView = JoinRoomView();
	const joinButton = createElement("input", { type: "button", value: "Join", onclick() { updateTabs(false); }})

	updateTabs(true);

	return combineElements("section", createButton, joinButton, createElement("hr"), createView, joinView);
};
