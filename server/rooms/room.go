/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package rooms

import (
	"word-magnets/clients"
	"word-magnets/words"
)

type Room struct {
	ID      string
	Owner   *clients.Client
	Clients []*clients.Client

	State     StateMachine     // TODO: State
	Wordbanks []words.Wordbank // TODO: Wordbanks
	Sentences []words.Sentence // TODO: Sentences

	TimeLeft    uint16
	TimeLimit   uint16
	ClientLimit uint8
	Round       uint8
	RoundLimit  uint8
}
