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
)

const defaultTime = uint8(0)
const createSubmitTime = uint8(5)
const voteTimeMult = uint8(5)
const voteSubmitTime = uint8(5)
const resultsBaseTime = uint8(5)
const resultsTimeMult = uint8(3)
const endTime = uint8(15)

type StateTag = uint8

const (
	LobbyTag StateTag = iota
	CreateTag
	CreateSubmitTag
	VoteTag
	VoteSubmitTag
	ResultsTag
	EndTag
)

type StateMachine struct {
	room  *Room
	state StateTag
}

func (machine *StateMachine) State() StateTag {
	return machine.state
}

func (machine *StateMachine) Enter() {
	switch machine.state {
	case CreateTag:
		machine.room.TimeLeft = machine.room.TimeLimit
		machine.room.SelectWords()
	case CreateSubmitTag:
		machine.room.TimeLeft = createSubmitTime
	case VoteTag:
		machine.room.TimeLeft = voteTimeMult * uint8(len(machine.room.Sentences))
	case VoteSubmitTag:
		machine.room.TimeLeft = voteSubmitTime
	case ResultsTag:
		machine.room.TimeLeft = resultsBaseTime + resultsTimeMult*uint8(len(machine.room.Sentences))
	case EndTag:
		machine.state = endTime
	case LobbyTag:
		fallthrough
	default:
		machine.state = defaultTime
	}

	SendRoomData(machine.room, machine.room)
}

func (machine *StateMachine) Leave() {
	switch machine.state {
	case ResultsTag:
		machine.room.Round++
	default:
	}
}

func (machine *StateMachine) Next() {
	machine.Leave()

	switch machine.state {
	case LobbyTag:
		machine.state = CreateTag
	case CreateTag:
		machine.state = CreateSubmitTag
	case CreateSubmitTag:
		machine.state = VoteTag
	case VoteTag:
		machine.state = VoteSubmitTag
	case VoteSubmitTag:
		machine.state = ResultsTag
	case ResultsTag:
		if machine.room.Round < machine.room.RoundLimit {
			machine.state = CreateTag
		} else {
			machine.state = EndTag
		}
	case EndTag:
		machine.state = LobbyTag
	default:
		machine.state = LobbyTag
	}

	machine.Enter()
}

func (machine *StateMachine) Tick() {
	if machine.state != LobbyTag {
		if machine.room.TimeLeft <= 0 {
			machine.Next()
		} else {
			machine.room.TimeLeft--
			SendRoomData(machine.room, machine.room)
		}
	}
}

func (machine *StateMachine) ReceivePacket(client *clients.Client, reader *util.ByteReader, packetType PacketType) {
	switch machine.state {
	case LobbyTag:
		if packetType == StartGamePacket && machine.room.IsOwner(client.ID()) {
			machine.Next()
		}

	default:
	}
}

func NewStateMachine(room *Room) *StateMachine {
	return &StateMachine{room: room, state: LobbyTag}
}
