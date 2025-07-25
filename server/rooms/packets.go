/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package rooms

import (
	"strings"

	"word-magnets/clients"
	"word-magnets/util"
	"word-magnets/words"
)

type PacketType = uint8

const (
	InvalidPacket PacketType = iota

	/* Client=>Server */

	CreateRoomPacket
	JoinRoomPacket
	LeaveRoomPacket
	RemoveClientPacket
	StartGamePacket
	SubmitSentencePacket
	SubmitVotePacket

	/* Server=>Client */

	CreateJoinRoomErrorPacket
	RoomDestroyedPacket

	RoomDataPacket
	RoomClientsPacket
	RoomWordsPacket
	RoomSentencesPacket
)

// Transmitter is any struct that can send binary packets.
type Transmitter interface {
	Send(bytes []byte) error
}

/**
 * Client-to-server packets
 */

type UserRoomData struct {
	OwnerName   string
	TimeLimit   uint8
	RoundLimit  uint8
	ClientLimit uint8
}

func ReadCreateRoom(reader *util.ByteReader) *UserRoomData {
	return &UserRoomData{
		OwnerName:   strings.TrimSpace(reader.ReadString()),
		TimeLimit:   reader.ReadU8(),
		RoundLimit:  reader.ReadU8(),
		ClientLimit: reader.ReadU8(),
	}
}

func ReadJoinRoom(reader *util.ByteReader) (id string, clientName string) {
	return reader.ReadString(), strings.TrimSpace(reader.ReadString())
}

func ReadLeaveRoom(reader *util.ByteReader) {}

func ReadRemoveClient(reader *util.ByteReader) (id string) {
	return reader.ReadString()
}

func ReadStartGame(reader *util.ByteReader) {}

func ReadSubmitSentence(reader *util.ByteReader) words.Sentence {
	var sentence words.Sentence
	length := reader.ReadU8()

	for range length {
		sentence.Words = append(sentence.Words, &words.WordEntry{reader.ReadU8(), reader.ReadU8()})
	}

	return sentence
}

func ReadSubmitVote(reader *util.ByteReader) (index uint8) {
	return reader.ReadU8()
}

/**
 * Server-to-client packets
 */

func SendCreateJoinRoomError(trans Transmitter, message string) error {
	writer := util.NewByteWriter(0)

	if err := writer.Write(CreateJoinRoomErrorPacket, message); err != nil {
		return err
	} else {
		return trans.Send(writer.Bytes())
	}
}

func SendRoomDestroyed(trans Transmitter, reason string) error {
	writer := util.NewByteWriter(0)

	if err := writer.Write(RoomDestroyedPacket, reason); err != nil {
		return err
	} else {
		return trans.Send(writer.Bytes())
	}
}

func SendRoomData(trans Transmitter, room *Room) error {
	writer := util.NewByteWriter(0)

	err := writer.Write(
		RoomDataPacket,
		room.ID,
		room.State.State(),
		room.TimeLeft,
		room.TimeLimit,
		room.Round,
		room.RoundLimit,
		room.ClientLimit,
	)

	if err != nil {
		return err
	}

	return trans.Send(writer.Bytes())
}

func SendRoomClients(trans Transmitter, clients []*clients.Client) error {
	writer := util.NewByteWriter(0)

	err := writer.Write(
		RoomClientsPacket,
		uint8(len(clients)),
	)

	if err == nil {
		for _, client := range clients {
			writer.WriteString(client.ID())
			writer.WriteString(client.Name)
		}
	}

	if err != nil {
		return err
	}

	return trans.Send(writer.Bytes())
}

func SendRoomWords(trans Transmitter, wordbanks []words.Wordbank) error {
	writer := util.NewByteWriter(0)

	if err := writer.Write(RoomWordsPacket, uint8(len(wordbanks))); err != nil {
		return err
	}

	for _, bank := range wordbanks {
		writer.WriteU8(uint8(len(bank)))

		for _, word := range bank {
			writer.WriteString(word)
		}
	}

	return trans.Send(writer.Bytes())
}

func SendRoomSentences(trans Transmitter, sentences []words.Sentence) error {
	writer := util.NewByteWriter(0)

	err := writer.Write(
		RoomSentencesPacket,
		uint8(len(sentences)),
	)

	if err == nil {
		for _, sentence := range sentences {
			writer.WriteU8(uint8(len(sentence.Words)))

			for _, entry := range sentence.Words {
				if err = writer.Write(uint8(entry.BankIndex), uint8(entry.WordIndex)); err != nil {
					break
				}
			}
		}
	}

	if err != nil {
		return err
	}

	return trans.Send(writer.Bytes())
}
