/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
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
	"word-magnets/words"
)

type Room struct {
	ID      string
	Owner   *clients.Client
	Clients []*clients.Client

	State     StateMachine     // TODO: State
	Wordbanks []words.Wordbank // TODO: Wordbanks
	Sentences []words.Sentence // TODO: Sentences

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
		if client.ID == id {
			return client
		}
	}

	return nil
}

// IsOwner checks if id is the room owner's ID.
func (room *Room) IsOwner(id string) bool {
	return room.Owner.ID == id
}

// Rooms are stored by ID=>Room
var rooms = make(map[string]*Room)

const newRoomAttempts = 20
const roomIDLength = 10

// Only letters and numbers that can't be mistaken for each other.
const roomIDChars = "ACDEFGHJKLMNPQRTVWXY379"

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
func NewRoom(owner *clients.Client, data *CreateRoomData) *Room {
	var room *Room

	for range newRoomAttempts {
		id := generateID()

		if _, has := rooms[id]; !has {
			owner.Name = data.OwnerName
			room = &Room{
				ID:          id,
				Owner:       owner,
				Clients:     []*clients.Client{},
				TimeLimit:   data.TimeLimit,
				RoundLimit:  data.RoundLimit,
				ClientLimit: data.ClientLimit,
			}

			rooms[id] = room
			break
		}
	}

	return room
}

// DestroyRoom sends a packet to all clients that the room was destroyed and deletes the room.
func DestroyRoom(room *Room) {
	SendRoomDestroyed(room, "The room was shut down.")
	delete(rooms, room.ID)

	for _, client := range room.Clients {
		client.RoomID = ""
	}
}

// GetRoom attempts to get room from id, returning nil otherwise.
func GetRoom(id string) *Room {
	if room, has := rooms[id]; has {
		return room
	} else {
		return nil
	}
}

// AddClient adds client to room, then retransmits the client list to all clients, room data, words (if applicable),
// and sentences (if applicable).
func AddClient(room *Room, client *clients.Client) {
	room.Clients = append(room.Clients, client)
	SendRoomClients(room, room.Clients)

	SendRoomData(client, room)
	SendRoomWords(client, room.Wordbanks)
	SendRoomSentences(client, room.Sentences)
}

// RemoveClient removes client from room, destroying room if client is the owner.
func RemoveClient(room *Room, client *clients.Client) {
	index := slices.IndexFunc(room.Clients, func(check *clients.Client) bool {
		return check.ID == client.ID
	})

	if index >= 0 {
		if client.ID == room.Owner.ID {
			DestroyRoom(room)
		} else {
			room.Clients = slices.Delete(room.Clients, index, index+1)
			client.RoomID = ""
			SendRoomClients(room, room.Clients)
		}
	}
}
