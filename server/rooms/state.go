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
const createSubmitTime = uint8(5)
const voteBaseTime = uint8(5)
const voteTimeMult = uint8(5)
const voteSubmitTime = uint8(5)
const resultsBaseTime = uint8(5)
const resultsTimeMult = uint8(3)
const endTime = uint8(15)

type stateTag = uint8

const (
	lobbyTag stateTag = iota
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
	tag           func() stateTag
	enter         func(room *Room)
	leave         func(room *Room)
	next          func(room *Room) *state
	tick          func(room *Room)
	onAddClient   func(room *Room, client *clients.Client)
	receivePacket func(*stateMachine, *clients.Client, *packets.PacketReader)
}

var lobbyState = state{
	tag:         func() stateTag { return lobbyTag },
	enter:       func(*Room) {},
	leave:       func(*Room) {},
	next:        func(*Room) *state { return &createState },
	tick:        func(*Room) {},
	onAddClient: func(*Room, *clients.Client) {},

	receivePacket: func(machine *stateMachine, client *clients.Client, reader *packets.PacketReader) {
		if reader.PeekU8() == packets.StartGamePacket && machine.room.Owner == client && client != nil {
			reader.ReadStartGame()
			machine.next()
		}
	},
}

var createState = state{
	tag: func() stateTag { return createTag },

	enter: func(room *Room) {
		room.TimeLeft = room.TimeLimit
		room.selectWords()
		room.sendRoomData(nil)
	},

	leave: func(*Room) {},
	next:  func(*Room) *state { return &createSubmitState },
	tick:  defaultTick,

	onAddClient: func(room *Room, client *clients.Client) {
		room.sendWords(client)
	},

	receivePacket: func(*stateMachine, *clients.Client, *packets.PacketReader) {},
}

var createSubmitState = state{
	tag: func() stateTag { return createSubmitTag },

	enter: func(room *Room) {
		room.TimeLeft = createSubmitTime
		room.sendRoomData(nil)
	},

	leave:       func(*Room) {},
	next:        func(*Room) *state { return &voteState },
	tick:        defaultTick,
	onAddClient: func(*Room, *clients.Client) {},

	receivePacket: func(machine *stateMachine, client *clients.Client, reader *packets.PacketReader) {
		if reader.PeekU8() == packets.StartGamePacket && client != nil {
			machine.room.addSentence(reader.ReadSubmitSentence(client.ID(), machine.room.Wordbanks))
		}
	},
}

var voteState = state{
	tag: func() stateTag { return voteTag },

	enter: func(room *Room) {
		room.TimeLeft = voteBaseTime + voteTimeMult*uint8(len(room.Sentences))
		room.sendRoomData(nil)
		room.sendSentences(nil, true)
	},

	leave: func(*Room) {},
	next:  func(*Room) *state { return &voteSubmitState },
	tick:  defaultTick,

	onAddClient: func(room *Room, client *clients.Client) {
		room.sendSentences(client, true)
	},

	receivePacket: func(*stateMachine, *clients.Client, *packets.PacketReader) {},
}

var voteSubmitState = state{
	tag: func() stateTag { return voteSubmitTag },

	enter: func(room *Room) {
		room.TimeLeft = voteSubmitTime
		room.sendRoomData(nil)
	},

	leave:         func(*Room) {},
	next:          func(*Room) *state { return &resultsState },
	tick:          defaultTick,
	onAddClient:   func(*Room, *clients.Client) {},
	receivePacket: func(*stateMachine, *clients.Client, *packets.PacketReader) {},
}

var resultsState = state{
	tag: func() stateTag { return resultsTag },

	enter: func(room *Room) {
		room.TimeLeft = resultsBaseTime + resultsTimeMult*uint8(len(room.Sentences))
		room.sendRoomData(nil)
		room.sendSentences(nil, false)
	},

	leave: func(*Room) {},
	next:  func(*Room) *state { return nil },
	tick:  defaultTick,

	onAddClient: func(room *Room, client *clients.Client) {
		room.sendSentences(client, false)
	},

	receivePacket: func(*stateMachine, *clients.Client, *packets.PacketReader) {},
}

var endState = state{
	tag: func() stateTag { return endTag },

	enter: func(room *Room) {
		room.TimeLeft = endTime
	},

	leave: func(room *Room) {
		room.Round++
	},

	next:          func(*Room) *state { return nil },
	tick:          defaultTick,
	onAddClient:   func(*Room, *clients.Client) {},
	receivePacket: func(*stateMachine, *clients.Client, *packets.PacketReader) {},
}

func defaultTick(room *Room) {
	if room.TimeLeft <= 0 {
		room.state.next()
	} else {
		room.TimeLeft--
		room.sendRoomData(nil)
	}
}

func (machine *stateMachine) tag() stateTag {
	return machine.state.tag()
}

func (machine *stateMachine) enter() {
	machine.state.enter(machine.room)
}

func (machine *stateMachine) leave() {
	machine.state.leave(machine.room)
}

func (machine *stateMachine) next() {
	machine.leave()
	machine.state = machine.state.next(machine.room)
	machine.enter()
}

func (machine *stateMachine) tick() {
	machine.state.tick(machine.room)
}

func (machine *stateMachine) onAddClient(client *clients.Client) {
	machine.state.onAddClient(machine.room, client)
}

func (machine *stateMachine) receivePacket(client *clients.Client, reader *packets.PacketReader) {
	machine.state.receivePacket(machine, client, reader)
}

func NewStateMachine(room *Room) *stateMachine {
	return &stateMachine{state: &lobbyState, room: room}
}
