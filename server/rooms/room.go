/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package rooms

import (
	"log"
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

	TimeLeft    uint8
	TimeLimit   uint8
	Round       uint8
	RoundLimit  uint8
	ClientLimit uint8
}

// Send transmits a binary packet to all clients in the room.
func (room *Room) Send(bytes []byte) error {
	for _, client := range room.Clients {
		if err := client.Send(bytes); err != nil {
			log.Printf("[Error] Failed to send packet to client: %s", err)
		}
	}

	return nil
}
