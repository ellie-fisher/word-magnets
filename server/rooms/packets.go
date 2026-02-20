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
)

type roomDataFlag = uint8

const (
	roomDataFlagRoomID roomDataFlag = 1 << iota
	roomDataFlagOwnerID
	roomDataFlagState
	roomDataFlagTimeLeft
	roomDataFlagTimeLimit
	roomDataFlagRound
	roomDataFlagRoundLimit
	roomDataFlagClientLimit
	roomDataFlagAll = roomDataFlagRoomID | roomDataFlagOwnerID | roomDataFlagState | roomDataFlagTimeLeft |
		roomDataFlagTimeLimit | roomDataFlagRound | roomDataFlagRoundLimit | roomDataFlagClientLimit
)

func (room *Room) sendRoomDestroyed(reason string) error {
	writer := packets.NewPacketWriter(0)

	if err := writer.Write(packets.RoomDestroyedPacket, reason); err != nil {
		return err
	} else {
		return room.Send(writer.Bytes())
	}
}

func (room *Room) sendRoomData(client *clients.Client, flags roomDataFlag) error {
	writer := packets.NewPacketWriter(0)

	if err := writer.Write(packets.RoomDataPacket, flags); err != nil {
		return err
	}

	writer.WriteStringCond(room.id, (flags&roomDataFlagRoomID) != 0)
	writer.WriteStringCond(room.owner.ID(), (flags&roomDataFlagOwnerID) != 0)
	writer.WriteU8Cond(room.state.tag(), (flags&roomDataFlagState) != 0)
	writer.WriteU8Cond(room.timeLeft, (flags&roomDataFlagTimeLeft) != 0)
	writer.WriteU8Cond(room.timeLimit, (flags&roomDataFlagTimeLimit) != 0)
	writer.WriteU8Cond(room.round, (flags&roomDataFlagRound) != 0)
	writer.WriteU8Cond(room.roundLimit, (flags&roomDataFlagRoundLimit) != 0)
	writer.WriteU8Cond(room.clientLimit, (flags&roomDataFlagClientLimit) != 0)

	if client == nil {
		return room.Send(writer.Bytes())
	} else {
		return client.Send(writer.Bytes())
	}
}

func (room *Room) sendClients() error {
	writer := packets.NewPacketWriter(0)

	if err := writer.Write(packets.RoomClientsPacket, uint8(len(room.Clients()))); err != nil {
		return err
	}

	for _, client := range room.Clients() {
		writer.WriteString(client.ID())
		writer.WriteString(client.Name)
		writer.WriteU8(client.Score)
	}

	return room.Send(writer.Bytes())
}

// sendWords sends the room's words to either a specific client or the entire room if client is nil.
func (room *Room) sendWords(client *clients.Client) error {
	writer := packets.NewPacketWriter(0)

	if err := writer.Write(packets.RoomWordsPacket, uint8(len(room.wordbanks))); err != nil {
		return err
	}

	for _, bank := range room.wordbanks {
		words := bank.Words()

		writer.WriteU8(bank.Flags())
		writer.WriteU8(uint8(len(words)))

		for _, word := range words {
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
// The first time it's anonymized, which means that authors are *not* included, and the clients' own
// sentences aren't sent to them.
//
// The second time is during the voting results phase, which means that authors *are* included, as
// well as the numbers of votes.
func (room *Room) sendSentences(target *clients.Client, anonymous bool) {
	clients := []*clients.Client{}

	if target == nil {
		clients = room.Clients()
	} else {
		clients = append(clients, target)
	}

	length := uint8(len(room.sentences))

	if anonymous {
		for _, client := range clients {
			writer := packets.NewPacketWriter(0)

			if err := writer.Write(packets.RoomSentencesPacket, anonymous, length); err == nil {
				for _, sentence := range room.sentences {
					// Don't write the client's own sentence if we're sending the voting options.
					if sentence.AuthorID == client.ID() {
						writer.WriteString("")
					} else {
						writer.WriteString(sentence.Value)
					}
				}

				client.Send(writer.Bytes())
			}
		}
	} else {
		writer := packets.NewPacketWriter(0)

		if err := writer.Write(packets.RoomSentencesPacket, anonymous, length); err == nil {
			for _, sentence := range room.sentences {
				writer.Write(sentence.AuthorName, sentence.Value, sentence.Votes)
			}

			room.Send(writer.Bytes())
		}
	}
}

func (room *Room) ReceivePacket(client *clients.Client, reader *packets.PacketReader) {
	room.state.receivePacket(client, reader)
}
