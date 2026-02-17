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

	RequestServerInfoPacket
	CreateRoomPacket
	JoinRoomPacket
	LeaveRoomPacket
	RemoveClientPacket
	StartGamePacket
	CancelStartGamePacket
	SubmitSentencePacket
	SubmitVotePacket

	/* Server=>Client */

	ClientInfoPacket
	ServerInfoPacket
	RoomConnectErrorPacket
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

func (reader *PacketReader) ReadRequestServerInfo() bool {
	return reader.MatchU8(RequestServerInfoPacket)
}

func (reader *PacketReader) ReadCreateRoom() (bool, *UserRoomData) {
	if reader.MatchU8(CreateRoomPacket) {
		return true, &UserRoomData{
			OwnerName:   strings.TrimSpace(reader.ReadString()),
			TimeLimit:   reader.ReadU8(),
			RoundLimit:  reader.ReadU8(),
			ClientLimit: reader.ReadU8(),
		}
	}

	return false, nil
}

func (reader *PacketReader) ReadJoinRoom() (matched bool, id string, clientName string) {
	if reader.MatchU8(JoinRoomPacket) {
		return true, reader.ReadString(), strings.TrimSpace(reader.ReadString())
	}

	return false, "", ""
}

func (reader *PacketReader) ReadLeaveRoom() bool {
	return reader.MatchU8(LeaveRoomPacket)
}

func (reader *PacketReader) ReadRemoveClient() (matched bool, id string) {
	if reader.MatchU8(RemoveClientPacket) {
		return true, reader.ReadString()
	}

	return false, ""
}

func (reader *PacketReader) ReadStartGame() bool {
	return reader.MatchU8(StartGamePacket)
}

func (reader *PacketReader) ReadCancelStartGame() bool {
	return reader.MatchU8(CancelStartGamePacket)
}

func (reader *PacketReader) ReadSubmitSentence(authorID string, wordbanks []*words.Wordbank) (bool, *words.Sentence) {
	if reader.MatchU8(SubmitSentencePacket) {
		entries := []words.WordEntry{}
		length := reader.ReadU8()

		for range length {
			entries = append(entries, words.WordEntry{BankIndex: reader.ReadU8(), WordIndex: reader.ReadU8()})
		}

		return true, words.NewSentence(authorID, entries, wordbanks)
	}

	return false, nil
}

func (reader *PacketReader) ReadSubmitVote() (bool, uint8) {
	if reader.MatchU8(SubmitVotePacket) {
		return true, reader.ReadU8()
	}

	return false, 0
}
