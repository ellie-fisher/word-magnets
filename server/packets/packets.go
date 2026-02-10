/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package packets

import (
	"strings"

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

	CreateRoomErrorPacket
	JoinRoomErrorPacket
	RoomDestroyedPacket

	RoomDataPacket
	RoomClientsPacket
	RoomWordsPacket
	RoomSentencesPacket
)

/**
 * Client-to-server packets
 */

type UserRoomData struct {
	OwnerName   string
	TimeLimit   uint8
	RoundLimit  uint8
	ClientLimit uint8
}

func (reader *PacketReader) ReadCreateRoom() *UserRoomData {
	if reader.ReadU8() != CreateRoomPacket {
		return nil
	}

	return &UserRoomData{
		OwnerName:   strings.TrimSpace(reader.ReadString()),
		TimeLimit:   reader.ReadU8(),
		RoundLimit:  reader.ReadU8(),
		ClientLimit: reader.ReadU8(),
	}
}

func (reader *PacketReader) ReadJoinRoom() (id string, clientName string) {
	if reader.ReadU8() != JoinRoomPacket {
		return "", ""
	}

	return reader.ReadString(), strings.TrimSpace(reader.ReadString())
}

func (reader *PacketReader) ReadLeaveRoom() {
	reader.ReadU8()
}

func (reader *PacketReader) ReadRemoveClient() (id string) {
	if reader.ReadU8() != RemoveClientPacket {
		return ""
	}

	return reader.ReadString()
}

func (reader *PacketReader) ReadStartGame() {
	reader.ReadU8()
}

func (reader *PacketReader) ReadSubmitSentence(authorID string, wordbanks []words.Wordbank) *words.Sentence {
	if reader.ReadU8() != SubmitSentencePacket {
		return nil
	}

	entries := []words.WordEntry{}
	length := reader.ReadU8()

	for range length {
		entries = append(entries, words.WordEntry{BankIndex: reader.ReadU8(), WordIndex: reader.ReadU8()})
	}

	return words.NewSentence(authorID, entries, wordbanks)
}

func (reader *PacketReader) ReadSubmitVote() (index uint8) {
	if reader.ReadU8() != SubmitVotePacket {
		return 0
	}

	return reader.ReadU8()
}
