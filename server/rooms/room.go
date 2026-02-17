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
	"strings"

	"word-magnets/clients"
	"word-magnets/packets"
	"word-magnets/words"
)

type Room struct {
	id          string
	threadIndex int
	owner       *clients.Client
	clients     []*clients.Client

	state     stateMachine
	wordbanks []*words.Wordbank
	sentences []*words.Sentence

	timeLeft    uint8
	timeLimit   uint8
	round       uint8
	roundLimit  uint8
	clientLimit uint8
}

func (room *Room) Clients() []*clients.Client {
	return room.clients[:]
}

func (room *Room) ClientLimit() uint8 {
	return room.clientLimit
}

// Send transmits a binary packet to all clients in the room.
func (room *Room) Send(bytes []byte) error {
	for _, client := range room.clients {
		if err := client.Send(bytes); err != nil {
			log.Printf("[Error] Failed to send packet to client: %s", err)
		}
	}

	return nil
}

// GetClient attempts to get the client with the ID of id, returning nil if not found.
func (room *Room) GetClient(id string) *clients.Client {
	for _, client := range room.clients {
		if client.ID() == id {
			return client
		}
	}

	return nil
}

// IsOwner checks if id is the room owner's ID.
func (room *Room) IsOwner(id string) bool {
	return room.owner.ID() == id
}

// AddClient adds client to room and retransmits the client list to everyone in the room.
func (room *Room) AddClient(client *clients.Client, name string) {
	if oldRoom := GetRoom(client.RoomID); oldRoom != nil {
		oldRoom.RemoveClient(client)
	}

	client.RoomID = room.id
	client.Name = name

	room.clients = append(room.clients, client)
	room.sendClients()
	room.state.enter(client)
}

// RemoveClient removes client from room, destroying room if client is the owner.
func (room *Room) RemoveClient(client *clients.Client) {
	index := slices.IndexFunc(room.clients, func(check *clients.Client) bool {
		return check.ID() == client.ID()
	})

	if index >= 0 {
		if client.ID() == room.owner.ID() {
			DestroyRoom(room)
		} else {
			room.clients = slices.Delete(room.clients, index, index+1)
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
	names := make([]string, len(room.clients))

	for i, client := range room.clients {
		names[i] = client.Name
	}

	room.sentences = []*words.Sentence{}
	room.wordbanks = []*words.Wordbank{
		words.NewWordbank(words.Noun),
		words.NewWordbank(words.Adjective),
		words.NewWordbank(words.Verb),
		words.NewPlayerWordbank(names),
		words.NewWordbank(words.Pronoun),
		words.NewWordbank(words.Auxiliary),
		words.NewWordbank(words.Preposition),
		words.NewWordbank(words.Miscellaneous),
	}
}

func (room *Room) addSentence(sentence *words.Sentence) {
	index := slices.IndexFunc(room.sentences, func(item *words.Sentence) bool {
		return item.AuthorID == sentence.AuthorID
	})

	if index >= 0 {
		room.sentences[index] = sentence
	} else {
		room.sentences = append(room.sentences, sentence)
	}
}

func (room *Room) shuffleSentences() {
	rand.Shuffle(len(room.sentences), func(i int, j int) {
		room.sentences[i], room.sentences[j] = room.sentences[j], room.sentences[i]
	})
}

// Rooms are stored by ID=>Room
var rooms = make(map[string]*Room)

const newRoomAttempts = 20
const roomIDLength = 8

// Only letters and numbers that can't be easily mistaken for each other.
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
	var id strings.Builder
	charsLen := len(roomIDChars)
	id.Grow(charsLen)

	for range roomIDLength {
		id.WriteString(string(roomIDChars[rand.Intn(charsLen)]))
	}

	return id.String()
}

// NewRoom attempts to create a new room, returning nil if it can't generate a unique ID.
func NewRoom(owner *clients.Client, data *packets.UserRoomData) *Room {
	var room *Room

	for range newRoomAttempts {
		id := generateID()

		if _, has := rooms[id]; !has {
			room = &Room{
				id:          id,
				threadIndex: -1,
				owner:       owner,
				clients:     []*clients.Client{},
				wordbanks:   []*words.Wordbank{},
				sentences:   []*words.Sentence{},
				timeLeft:    data.TimeLimit,
				timeLimit:   data.TimeLimit,
				round:       1,
				roundLimit:  data.RoundLimit,
				clientLimit: data.ClientLimit,
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

	for _, client := range room.clients {
		client.RoomID = ""
	}

	delete(rooms, room.id)
	removeRoomFromPool(room)

	room.id = ""
	room.owner = nil
}

// GetRoom attempts to get room from id, returning nil otherwise.
func GetRoom(id string) *Room {
	if room, has := rooms[id]; has {
		return room
	} else {
		return nil
	}
}

func RoomCount() int {
	return len(rooms)
}
