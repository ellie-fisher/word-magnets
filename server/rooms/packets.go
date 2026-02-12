/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package rooms

import (
	"word-magnets/clients"
	"word-magnets/packets"
	"word-magnets/util"
)

func (room *Room) sendRoomDestroyed(reason string) error {
	writer := packets.NewPacketWriter(0)

	if err := writer.Write(packets.RoomDestroyedPacket, reason); err != nil {
		return err
	} else {
		return room.Send(writer.Bytes())
	}
}

func (room *Room) sendRoomData(client *clients.Client) error {
	writer := packets.NewPacketWriter(0)

	err := writer.Write(
		packets.RoomDataPacket,
		room.ID,
		room.state.tag(),
		room.TimeLeft,
		room.TimeLimit,
		room.Round,
		room.RoundLimit,
		room.ClientLimit,
	)

	if err != nil {
		return err
	}

	if client == nil {
		return room.Send(writer.Bytes())
	} else {
		return client.Send(writer.Bytes())
	}
}

func (room *Room) sendClients() error {
	writer := packets.NewPacketWriter(0)

	if err := writer.Write(packets.RoomClientsPacket, uint8(len(room.Clients))); err != nil {
		return err
	}

	for _, client := range room.Clients {
		writer.WriteString(client.ID())
		writer.WriteString(client.Name)
	}

	return room.Send(writer.Bytes())
}

// sendWords sends the room's words to either a specific client or the entire room if client is nil.
func (room *Room) sendWords(client *clients.Client) error {
	writer := packets.NewPacketWriter(0)

	if err := writer.Write(packets.RoomWordsPacket, uint8(len(room.Wordbanks))); err != nil {
		return err
	}

	for _, bank := range room.Wordbanks {
		writer.WriteU8(uint8(len(bank)))

		for _, word := range bank {
			writer.WriteString(word)
		}
	}

	if client == nil {
		return room.Send(writer.Bytes())
	} else {
		return client.Send(writer.Bytes())
	}
}

// sendSentences sends the sentences either to a specific client or the whole room. It's used
// during the various voting phases.
//
// The first time it's anonymized, which means that author IDs are *not* included, and the clients'
// own sentences aren't sent to them.
//
// The second time is during the voting results phase, which means that author IDs *are* included,
// as well as the numbers of votes.
func (room *Room) sendSentences(target *clients.Client, anonymous bool) {
	clients := []*clients.Client{}
	authors := util.NewSet[string]()

	if target == nil {
		clients = room.Clients
	} else {
		clients = append(clients, target)
	}

	for _, sentence := range room.Sentences {
		authors.Add(sentence.AuthorID)
	}

	for _, client := range clients {
		writer := packets.NewPacketWriter(0)
		length := uint8(len(room.Sentences))

		// We won't be writing the client's own sentence to them during the initial voting phase, so
		// we must modify the length we send out.
		if authors.Has(client.ID()) && anonymous && length > 0 {
			length--
		}

		if err := writer.Write(packets.RoomSentencesPacket, util.BoolToU8(!anonymous), length); err != nil {
			for _, sentence := range room.Sentences {
				if anonymous {
					// Don't write the client's own sentence if we're sending the voting options.
					if sentence.AuthorID == client.ID() {
						continue
					}
				} else {
					writer.WriteString(sentence.AuthorID)
				}

				writer.WriteString(sentence.Value)
			}

			client.Send(writer.Bytes())
		}
	}
}

func (room *Room) ReceivePacket(client *clients.Client, reader *packets.PacketReader) {
	room.state.receivePacket(client, reader)
}
