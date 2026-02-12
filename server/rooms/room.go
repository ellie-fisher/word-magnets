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
	"log"
	"math/rand"
	"slices"
	"strconv"

	"word-magnets/clients"
	"word-magnets/packets"
	"word-magnets/words"
)

type Room struct {
	ID          string
	threadIndex int
	Owner       *clients.Client
	Clients     []*clients.Client

	state     stateMachine      // TODO: State
	Wordbanks []words.Wordbank  // TODO: Wordbanks
	Sentences []*words.Sentence // TODO: Sentences

	TimeLeft    uint8
	TimeLimit   uint8
	Round       uint8
	RoundLimit  uint8
	ClientLimit uint8
}

// Send transmits a binary packet to all clients in the room.
func (room *Room) Send(bytes []byte) error {
	for _, client := range room.Clients {
		if err := client.Send(bytes); err != nil {
			log.Printf("[Error] Failed to send packet to client: %s", err)
		}
	}

	return nil
}

// GetClient attempts to get the client with the ID of id, returning nil if not found.
func (room *Room) GetClient(id string) *clients.Client {
	for _, client := range room.Clients {
		if client.ID() == id {
			return client
		}
	}

	return nil
}

// IsOwner checks if id is the room owner's ID.
func (room *Room) IsOwner(id string) bool {
	return room.Owner.ID() == id
}

// AddClient adds client to room, retransmits the client list to all clients, then transmits room
// data, words (if applicable), and sentences (if applicable) to the new client.
func (room *Room) AddClient(client *clients.Client, name string) {
	if oldRoom := GetRoom(client.RoomID); oldRoom != nil {
		oldRoom.RemoveClient(client)
	}

	client.RoomID = room.ID
	client.Name = name

	room.Clients = append(room.Clients, client)
	room.sendClients()
	room.sendRoomData(client)
	room.state.clientEnter(client)
}

// RemoveClient removes client from room, destroying room if client is the owner.
func (room *Room) RemoveClient(client *clients.Client) {
	index := slices.IndexFunc(room.Clients, func(check *clients.Client) bool {
		return check.ID() == client.ID()
	})

	if index >= 0 {
		if client.ID() == room.Owner.ID() {
			DestroyRoom(room)
		} else {
			room.Clients = slices.Delete(room.Clients, index, index+1)
			client.RoomID = ""
			room.sendClients()
		}
	}
}

func (room *Room) Tick() {
	room.state.tick()
}

// selectWords clears all player sentences, randomly selects words from wordbanks (except for fixed ones).
func (room *Room) selectWords() {
	room.Sentences = []*words.Sentence{}
	room.Wordbanks = []words.Wordbank{
		words.NewWordbank(words.Noun),
		words.NewWordbank(words.Adjective),
		words.NewWordbank(words.Verb),
		words.NewWordbank(words.Pronoun),
		words.NewWordbank(words.Auxiliary),
		words.NewWordbank(words.Preposition),
		words.NewWordbank(words.Miscellaneous),
	}
}

func (room *Room) addSentence(sentence *words.Sentence) {
	index := slices.IndexFunc(room.Sentences, func(item *words.Sentence) bool {
		return item.AuthorID == sentence.AuthorID
	})

	if index >= 0 {
		room.Sentences[index] = sentence
	} else {
		room.Sentences = append(room.Sentences, sentence)
	}
}

// Rooms are stored by ID=>Room
var rooms = make(map[string]*Room)

const newRoomAttempts = 20
const roomIDLength = 8

// Only letters and numbers that can't be mistaken for each other.
const roomIDChars = "ACDEHJKLMNPQRTVWXY379"

var NewRoomErrorMessage = ""

func init() {
	/* Cache error message so we're not calculating it every single time. */

	NewRoomErrorMessage = "Failed to create a room with a unique code after " + strconv.Itoa(newRoomAttempts) + " attempt"

	if newRoomAttempts != 1 {
		NewRoomErrorMessage += "s"
	}
}

// generateID generates a random room ID based on roomIDChars.
func generateID() string {
	id := ""
	charsLen := len(roomIDChars)

	for range roomIDLength {
		id += string(roomIDChars[rand.Intn(charsLen)])
	}

	return id
}

// NewRoom attempts to create a new room, returning nil if it can't generate a unique ID.
func NewRoom(owner *clients.Client, data *packets.UserRoomData) *Room {
	var room *Room

	for range newRoomAttempts {
		id := generateID()

		if _, has := rooms[id]; !has {
			room = &Room{
				ID:          id,
				threadIndex: -1,
				Owner:       owner,
				Clients:     []*clients.Client{},
				Wordbanks:   []words.Wordbank{},
				Sentences:   []*words.Sentence{},
				TimeLeft:    data.TimeLimit,
				TimeLimit:   data.TimeLimit,
				Round:       1,
				RoundLimit:  data.RoundLimit,
				ClientLimit: data.ClientLimit,
			}

			room.state = *NewStateMachine(room)
			rooms[id] = room

			addRoomToPool(room)

			break
		}
	}

	return room
}

// DestroyRoom sends a packet to all clients that the room was destroyed and deletes the room.
func DestroyRoom(room *Room) {
	room.sendRoomDestroyed("The room was shut down.")

	for _, client := range room.Clients {
		client.RoomID = ""
	}

	delete(rooms, room.ID)
	removeRoomFromPool(room)

	room.ID = ""
	room.Owner = nil
}

// GetRoom attempts to get room from id, returning nil otherwise.
func GetRoom(id string) *Room {
	if room, has := rooms[id]; has {
		return room
	} else {
		return nil
	}
}
