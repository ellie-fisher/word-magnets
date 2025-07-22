/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package rooms

type StateTag = uint8

const (
	LobbyTag StateTag = iota
	CreateTag
	VoteTag
	ResultsTag
	EndTag
)

type StateMachine struct {
	room  *Room
	state StateTag
}

func (machine *StateMachine) State() StateTag {
	return machine.state
}
