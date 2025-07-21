/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package rooms

import "word-magnets/util"

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
 * TODO: Client-to-server packets
 */

type ClientPacket interface {
	Unpack(reader *util.ByteReader)
}

/**
 * Server-to-client packets
 */

type ServerPacket interface {
	Pack(writer *util.ByteWriter)
}

type RoomResponsePacket struct {
	Success bool
	Reason  string
}

type RoomDestroyedPacket struct {
	Reason string
}

type RoomDataPacket struct {
	Room *Room
}

type RoomClientsPacket struct {
	Room *Room
}

type RoomWordsPacket struct {
	Room *Room
}

type RoomSentencesPacket struct {
	Room *Room
}

func (packet *RoomResponsePacket) Pack(writer *util.ByteWriter) {
	writer.WriteU8(uint8(RoomResponse))
	writer.WriteBool(packet.Success)
	writer.WriteString(packet.Reason)
}

func (packet *RoomDestroyedPacket) Pack(writer *util.ByteWriter) {
	writer.WriteU8(uint8(RoomDestroyed))
	writer.WriteString(packet.Reason)
}

func (packet *RoomDataPacket) Pack(writer *util.ByteWriter) {
	room := packet.Room

	writer.WriteU8(uint8(RoomData))
	writer.WriteU8(uint8(room.State.State()))
	writer.WriteU16(room.TimeLeft)
	writer.WriteU16(room.TimeLimit)
	writer.WriteU8(room.ClientLimit)
	writer.WriteU8(room.Round)
	writer.WriteU8(room.RoundLimit)
}

func (packet *RoomClientsPacket) Pack(writer *util.ByteWriter) {
	clients := packet.Room.Clients

	writer.WriteU8(uint8(RoomClients))
	writer.WriteU8(uint8(len(clients)))

	for _, client := range clients {
		writer.WriteString(client.ID)
		writer.WriteString(client.Name)
	}
}

func (packet *RoomWordsPacket) Pack(writer *util.ByteWriter) {
	wordbanks := packet.Room.Wordbanks

	writer.WriteU8(uint8(RoomWords))
	writer.WriteU8(uint8(len(wordbanks)))

	for _, bank := range wordbanks {
		writer.WriteU8(uint8(len(bank)))

		for _, word := range bank {
			writer.WriteString(word)
		}
	}
}

func (packet *RoomSentencesPacket) Pack(writer *util.ByteWriter) {
	sentences := packet.Room.Sentences

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
