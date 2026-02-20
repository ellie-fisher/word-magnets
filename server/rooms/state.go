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
	"slices"
	"word-magnets/clients"
	"word-magnets/packets"
	"word-magnets/words"
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
	onLeave       func(*Room, *clients.Client)
	next          func(*Room) *state
	receivePacket func(*stateMachine, *clients.Client, *packets.PacketReader)
}

func (roomState *state) enter(room *Room, client *clients.Client) {
	if client == nil {
		room.timeLeft = roomState.getStartTime(room)
	}

	roomState.onEnter(room, client)
	room.sendRoomData(client, roomDataFlagAll)
}

func (roomState *state) leave(room *Room, client *clients.Client) {
	roomState.onLeave(room, client)
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
		onLeave:       func(*Room, *clients.Client) {},
		next:          func(*Room) *state { return next },
		receivePacket: func(*stateMachine, *clients.Client, *packets.PacketReader) {},
	}
}

var lobbyState state = newStateWithDefaults(lobbyTag, false, &startGameState)
var startGameState state = newStateWithDefaults(startGameTag, true, &createState)
var createState state = newStateWithDefaults(createTag, true, &createSubmitState)
var createSubmitState state = newStateWithDefaults(createSubmitTag, true, nil)
var voteState state = newStateWithDefaults(voteTag, true, nil)
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
			room.sentences = []*words.Sentence{}

			for _, cl := range room.clients {
				cl.Vote = -1
			}

			if room.round < room.roundLimit {
				room.round++
			}
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
		if matched, sentence := reader.ReadSubmitSentence(client.ID(), client.Name, machine.room.wordbanks); matched && client != nil {
			if sentence.Value != "" {
				machine.room.addSentence(sentence)

				// No point in waiting around if we've already received everyone's sentences.
				if len(machine.room.sentences) >= len(machine.room.clients) {
					machine.next()
				}
			}
		}
	}

	/* voteState */

	voteState.getStartTime = func(room *Room) uint8 {
		return voteBaseTime + voteTimeMult*uint8(len(room.sentences))
	}

	voteState.onEnter = func(room *Room, client *clients.Client) {
		if client == nil {
			room.shuffleSentences()
		}

		room.sendSentences(client, true)
	}

	voteState.next = func(room *Room) *state {
		votes := 0

		for _, client := range room.clients {
			if client.Vote >= 0 && int(client.Vote) < len(room.sentences) {
				votes++
			}
		}

		// If we've already received all of the votes, we can just skip ahead to the results.
		if votes >= len(room.clients) {
			return &resultsState
		}

		return &voteSubmitState
	}

	voteState.receivePacket = func(machine *stateMachine, client *clients.Client, reader *packets.PacketReader) {
		if matched, vote := reader.ReadSubmitVote(); matched {
			if client.Vote < 0 && vote >= 0 && int(vote) < len(machine.room.sentences) {
				client.Vote = vote
				votes := 0

				for _, client := range machine.room.clients {
					if client.Vote >= 0 && int(client.Vote) < len(machine.room.sentences) {
						votes++
					}
				}

				// No point in waiting around if we've already received everyone's votes.
				if votes >= len(machine.room.clients) {
					machine.next()
				}
			}
		}
	}

	/* voteSubmitState */

	voteSubmitState.getStartTime = func(room *Room) uint8 {
		return voteSubmitTime
	}

	voteSubmitState.receivePacket = voteState.receivePacket

	/* resultsState */

	resultsState.getStartTime = func(room *Room) uint8 {
		return resultsBaseTime + resultsTimeMult*uint8(len(room.sentences))
	}

	resultsState.onEnter = func(room *Room, client *clients.Client) {
		if client == nil {
			// Tally votes.
			for _, client := range room.clients {
				if vote := client.Vote; vote >= 0 && int(vote) < len(room.sentences) {
					if sentence := room.sentences[vote]; sentence != nil && sentence.AuthorID != client.ID() {
						sentence.Votes++
					}
				}
			}

			// Update client scores.
			for _, sentence := range room.sentences {
				index := slices.IndexFunc(room.clients, func(client *clients.Client) bool { return client.ID() == sentence.AuthorID })

				if index >= 0 {
					room.clients[index].Score += sentence.Votes
				}
			}
		}

		room.sendSentences(client, false)
	}

	resultsState.next = func(room *Room) *state {
		if room.round < room.roundLimit {
			return &createState
		} else {
			return &endState
		}
	}

	/* endState */

	endState.getStartTime = func(*Room) uint8 { return endTime }

	endState.onEnter = func(room *Room, client *clients.Client) {
		if client == nil {
			room.sendClients()
		}
	}

	endState.onLeave = func(room *Room, client *clients.Client) {
		if client == nil {
			room.round = 0

			for _, cl := range room.clients {
				cl.Score = 0
			}
		}
	}
}

func (machine *stateMachine) tag() stateTag                { return machine.state.tag }
func (machine *stateMachine) enter(client *clients.Client) { machine.state.enter(machine.room, client) }
func (machine *stateMachine) leave(client *clients.Client) { machine.state.leave(machine.room, client) }

func (machine *stateMachine) next() {
	machine.leave(nil)
	machine.state = machine.state.next(machine.room)
	machine.enter(nil)
}

func (machine *stateMachine) reset() {
	machine.leave(nil)
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
