/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

/**
 * Views:
 *   - Create room
 *     - Error
 *   - Join room
 *     - Error
 *   - Lobby
 *   - Create
 *   - Vote
 *   - Results
 *   - End
 *   - Disconnected from room
 */

getElement("main").append(combineElements("div", createElement("h1", "Word Magnets"), CreateJoinView()));
