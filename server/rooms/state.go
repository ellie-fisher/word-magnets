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

const defaultTime = uint8(0)
const startGameTime = uint8(5)
const createSubmitTime = uint8(5)
const voteBaseTime = uint8(5)
const voteTimeMult = uint8(10)
const voteSubmitTime = uint8(5)
const resultsBaseTime = uint8(5)
const resultsTimeMult = uint8(5)
const endTime = uint8(15)

type stateTag = uint8

const (
	lobbyTag stateTag = iota
	startGameTag
	createTag
	createSubmitTag
	voteTag
	voteSubmitTag
	resultsTag
	endTag
)

type stateMachine struct {
	state *state
	room  *Room
}

type state struct {
	tag           stateTag
	doesTick      bool
	getStartTime  func(*Room) uint8
	onEnter       func(*Room, *clients.Client)
	next          func(*Room) *state
	receivePacket func(*stateMachine, *clients.Client, *packets.PacketReader)
}

func (roomState *state) enter(room *Room, client *clients.Client) {
	if client == nil {
		room.timeLeft = roomState.getStartTime(room)
	}

	room.sendRoomData(client, roomDataFlagAll)
	roomState.onEnter(room, client)
}

func (roomState *state) tick(room *Room) {
	if roomState.doesTick {
		if room.timeLeft <= 0 {
			room.state.next()
		} else {
			room.timeLeft--
			room.sendRoomData(nil, roomDataFlagTimeLeft)
		}
	}
}

func newStateWithDefaults(tag stateTag, doesTick bool, next *state) state {
	return state{
		tag:           tag,
		doesTick:      doesTick,
		getStartTime:  func(*Room) uint8 { return 0 },
		onEnter:       func(*Room, *clients.Client) {},
		next:          func(*Room) *state { return next },
		receivePacket: func(*stateMachine, *clients.Client, *packets.PacketReader) {},
	}
}

var lobbyState state = newStateWithDefaults(lobbyTag, false, &startGameState)
var startGameState state = newStateWithDefaults(startGameTag, true, &createState)
var createState state = newStateWithDefaults(createTag, true, &createSubmitState)
var createSubmitState state = newStateWithDefaults(createSubmitTag, true, nil)
var voteState state = newStateWithDefaults(voteTag, true, &voteSubmitState)
var voteSubmitState state = newStateWithDefaults(voteSubmitTag, true, &resultsState)
var resultsState state = newStateWithDefaults(resultsTag, true, nil)
var endState state = newStateWithDefaults(endTag, true, &lobbyState)

func init() {
	/* Overwrite state defaults with any fields that differ. */

	/* lobbyState */

	lobbyState.receivePacket = func(machine *stateMachine, client *clients.Client, reader *packets.PacketReader) {
		if reader.ReadStartGame() && machine.room.owner == client && client != nil {
			machine.next()
		}
	}

	/* startGameState */

	startGameState.getStartTime = func(*Room) uint8 {
		return startGameTime
	}

	startGameState.receivePacket = func(machine *stateMachine, client *clients.Client, reader *packets.PacketReader) {
		if reader.ReadCancelStartGame() && machine.room.owner == client && client != nil {
			machine.reset()
		}
	}

	/* createState */

	createState.getStartTime = func(room *Room) uint8 {
		return room.timeLimit
	}

	createState.onEnter = func(room *Room, client *clients.Client) {
		if client == nil {
			room.selectWords()
		}

		room.sendWords(client)
	}

	/* createSubmitState */

	createSubmitState.getStartTime = func(*Room) uint8 {
		return createSubmitTime
	}

	createSubmitState.next = func(room *Room) *state {
		if len(room.sentences) <= 0 {
			return &resultsState
		} else {
			return &voteState
		}
	}

	createSubmitState.receivePacket = func(machine *stateMachine, client *clients.Client, reader *packets.PacketReader) {
		if matched, sentence := reader.ReadSubmitSentence(client.ID(), machine.room.wordbanks); matched && client != nil {
			machine.room.addSentence(sentence)
		}
	}

	/* voteState */

	voteState.getStartTime = func(room *Room) uint8 {
		return voteBaseTime + voteTimeMult*uint8(len(room.sentences))
	}

	voteState.onEnter = func(room *Room, client *clients.Client) {
		room.sendSentences(client, true)
	}

	/* voteSubmitState */

	voteSubmitState.getStartTime = func(room *Room) uint8 {
		return voteSubmitTime
	}

	voteSubmitState.receivePacket = func(machine *stateMachine, client *clients.Client, reader *packets.PacketReader) {
		// TODO: Tally votes
	}

	/* resultsState */

	resultsState.getStartTime = func(room *Room) uint8 {
		return resultsBaseTime + resultsTimeMult*uint8(len(room.sentences))
	}

	resultsState.onEnter = func(room *Room, client *clients.Client) {
		room.sendSentences(client, false)
	}

	resultsState.next = func(room *Room) *state {
		if room.round < room.roundLimit {
			room.round++
			return &createState
		} else {
			return &endState
		}
	}

	/* endState */

	endState.getStartTime = func(*Room) uint8 { return endTime }
}

func (machine *stateMachine) tag() stateTag                { return machine.state.tag }
func (machine *stateMachine) enter(client *clients.Client) { machine.state.enter(machine.room, client) }

func (machine *stateMachine) next() {
	machine.state = machine.state.next(machine.room)
	machine.enter(nil)
}

func (machine *stateMachine) reset() {
	machine.state = &lobbyState
	machine.enter(nil)
}

func (machine *stateMachine) tick() { machine.state.tick(machine.room) }

func (machine *stateMachine) receivePacket(client *clients.Client, reader *packets.PacketReader) {
	machine.state.receivePacket(machine, client, reader)
}

func NewStateMachine(room *Room) *stateMachine {
	return &stateMachine{state: &lobbyState, room: room}
}
