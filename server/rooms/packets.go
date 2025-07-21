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
	"word-magnets/util"
	"word-magnets/words"
)

type PacketType uint8

const (
	Invalid PacketType = iota

	/* Client=>Server */

	CreateRoom
	JoinRoom
	LeaveRoom
	RemoveClient
	SubmitSentence
	SubmitVote

	/* Server=>Client */

	RoomResponse // Response to attempting to create or join a room.
	RoomDestroyed

	RoomData
	RoomClients
	RoomWords
	RoomSentences
)

/**
 * Client-to-server packets
 */

func ReadCreateRoom(reader *util.ByteReader) (timeLimit uint16, clientLimit uint8, roundLimit uint8) {
	return reader.ReadU16(), reader.ReadU8(), reader.ReadU8()
}

func ReadJoinRoom(reader *util.ByteReader) (id string) {
	return reader.ReadString()
}

func ReadLeaveRoom(reader *util.ByteReader) {}

func ReadRemoveClient(reader *util.ByteReader) (id string) {
	return reader.ReadString()
}

func ReadSubmitSentence(reader *util.ByteReader) words.Sentence {
	var sentence words.Sentence
	length := reader.ReadU8()

	for range length {
		sentence.Words = append(sentence.Words, &words.WordEntry{int(reader.ReadU8()), int(reader.ReadU8())})
	}

	return sentence
}

func ReadSubmitVote(reader *util.ByteReader) (index uint8) {
	return reader.ReadU8()
}

/**
 * Server-to-client packets
 */

func WriteRoomResponse(writer *util.ByteWriter, success bool, reason string) {
	writer.WriteU8(uint8(RoomResponse))
	writer.WriteBool(success)
	writer.WriteString(reason)
}

func WriteRoomDestroyed(writer *util.ByteWriter, reason string) {
	writer.WriteU8(uint8(RoomDestroyed))
	writer.WriteString(reason)
}

func WriteRoomData(writer *util.ByteWriter, room *Room) {
	writer.WriteU8(uint8(RoomData))
	writer.WriteU8(uint8(room.State.State()))
	writer.WriteU16(room.TimeLeft)
	writer.WriteU16(room.TimeLimit)
	writer.WriteU8(room.ClientLimit)
	writer.WriteU8(room.Round)
	writer.WriteU8(room.RoundLimit)
}

func WriteRoomClients(writer *util.ByteWriter, clients []*clients.Client) {
	writer.WriteU8(uint8(RoomClients))
	writer.WriteU8(uint8(len(clients)))

	for _, client := range clients {
		writer.WriteString(client.ID)
		writer.WriteString(client.Name)
	}
}

func WriteRoomWords(writer *util.ByteWriter, wordbanks []words.Wordbank) {
	writer.WriteU8(uint8(RoomWords))
	writer.WriteU8(uint8(len(wordbanks)))

	for _, bank := range wordbanks {
		writer.WriteU8(uint8(len(bank)))

		for _, word := range bank {
			writer.WriteString(word)
		}
	}
}

func WriteRoomSentences(writer *util.ByteWriter, sentences []words.Sentence) {
	writer.WriteU8(uint8(RoomSentences))
	writer.WriteU8(uint8(len(sentences)))

	for _, sentence := range sentences {
		writer.WriteU8(uint8(len(sentence.Words)))

		for _, entry := range sentence.Words {
			writer.WriteU8(uint8(entry.BankIndex))
			writer.WriteU8(uint8(entry.WordIndex))
		}
	}
}
