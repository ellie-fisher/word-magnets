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

type PacketType = uint8

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

func SendRoomResponse(conn *websocket.Conn, success bool, message string) error {
	writer := util.NewByteWriter(defaultRoomResponseSize)

	err := writer.Write(
		RoomDestroyed,
		success,
		message,
	)

	if err != nil {
		return err
	}

	return SendPacket(conn, writer)
}

func SendRoomDestroyed(conn *websocket.Conn, reason string) error {
	writer := util.NewByteWriter(defaultRoomDestroyedSize)

	if err := writer.Write(RoomDestroyed, reason); err != nil {
		return err
	}

	return SendPacket(conn, writer)
}

func SendRoomData(conn *websocket.Conn, room *Room) error {
	writer := util.NewByteWriter(defaultRoomDataSize)

	err := writer.Write(
		RoomData,
		room.State.State(),
		room.TimeLeft,
		room.TimeLimit,
		room.ClientLimit,
		room.Round,
		room.RoundLimit,
	)

	if err != nil {
		return err
	}

	return SendPacket(conn, writer)
}

func SendRoomClients(conn *websocket.Conn, clients []*clients.Client) error {
	writer := util.NewByteWriter(defaultRoomClientsSize)

	err := writer.Write(
		RoomClients,
		uint8(len(clients)),
	)

	if err == nil {
		for _, client := range clients {
			if err = writer.Write(client.ID, client.Name); err != nil {
				break
			}
		}
	}

	if err != nil {
		return err
	}

	return SendPacket(conn, writer)
}

func SendRoomWords(conn *websocket.Conn, wordbanks []words.Wordbank) error {
	writer := util.NewByteWriter(defaultRoomWordsSize)

	if err := writer.Write(RoomWords, uint8(len(wordbanks))); err != nil {
		return err
	}

	for _, bank := range wordbanks {
		writer.WriteU8(uint8(len(bank)))

		for _, word := range bank {
			writer.WriteString(word)
		}
	}

	return SendPacket(conn, writer)
}

func SendRoomSentences(conn *websocket.Conn, sentences []words.Sentence) error {
	writer := util.NewByteWriter(defaultRoomSentencesSize)

	err := writer.Write(
		RoomSentences,
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

	return SendPacket(conn, writer)
}
