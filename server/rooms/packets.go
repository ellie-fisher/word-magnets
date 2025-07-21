/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package rooms

import (
	"github.com/gorilla/websocket"

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

// SendPacket sends a packet to a WebSocket connection.
func SendPacket(conn *websocket.Conn, writer *util.ByteWriter) error {
	return conn.WriteMessage(websocket.BinaryMessage, writer.Bytes())
}

/**
 * Client-to-server packets
 */

func ReadCreateRoom(reader *util.ByteReader) (timeLimit uint8, roundLimit uint8, clientLimit uint8) {
	return reader.ReadU8(), reader.ReadU8(), reader.ReadU8()
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

const (
	defaultRoomResponseSize  = 4
	defaultRoomDestroyedSize = 3
	defaultRoomDataSize      = 7
	defaultRoomClientsSize   = 2
	defaultRoomWordsSize     = 2
	defaultRoomSentencesSize = 2
)

func WriteRoomResponse(success bool, reason string) *util.ByteWriter {
	writer := util.NewByteWriter(defaultRoomResponseSize)

	writer.Write(
		uint8(RoomDestroyed),
		success,
		reason,
	)

	return writer
}

func WriteRoomDestroyed(reason string) *util.ByteWriter {
	writer := util.NewByteWriter(defaultRoomDestroyedSize)

	writer.Write(
		uint8(RoomDestroyed),
		reason,
	)

	return writer
}

func WriteRoomData(room *Room) *util.ByteWriter {
	writer := util.NewByteWriter(defaultRoomDataSize)

	writer.Write(
		uint8(RoomData),
		uint8(room.State.State()),
		room.TimeLeft,
		room.TimeLimit,
		room.ClientLimit,
		room.Round,
		room.RoundLimit,
	)

	return writer
}

func WriteRoomClients(clients []*clients.Client) *util.ByteWriter {
	writer := util.NewByteWriter(defaultRoomClientsSize)

	writer.Write(
		uint8(RoomClients),
		uint8(len(clients)),
	)

	for _, client := range clients {
		writer.Write(client.ID, client.Name)
	}

	return writer
}

func WriteRoomWords(wordbanks []words.Wordbank) *util.ByteWriter {
	writer := util.NewByteWriter(defaultRoomWordsSize)

	writer.Write(
		uint8(RoomWords),
		uint8(len(wordbanks)),
	)

	for _, bank := range wordbanks {
		writer.WriteU8(uint8(len(bank)))

		for _, word := range bank {
			writer.WriteString(word)
		}
	}

	return writer
}

func WriteRoomSentences(sentences []words.Sentence) *util.ByteWriter {
	writer := util.NewByteWriter(defaultRoomSentencesSize)

	writer.Write(
		uint8(RoomSentences),
		uint8(len(sentences)),
	)

	for _, sentence := range sentences {
		writer.WriteU8(uint8(len(sentence.Words)))

		for _, entry := range sentence.Words {
			writer.Write(
				uint8(entry.BankIndex),
				uint8(entry.WordIndex),
			)
		}
	}

	return writer
}
