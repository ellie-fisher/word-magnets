/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package main

import (
	"log"
	"net"
	"net/http"
	"net/url"

	"github.com/gorilla/websocket"

	"word-magnets/clients"
	"word-magnets/rooms"
	"word-magnets/util"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     checkOrigin,
}

// checkOrigin validates the origin and request URLs to make sure they match. The hostnames must be the same, but the
// ports must match the configured port settings.
func checkOrigin(req *http.Request) bool {
	origin := req.Header["Origin"]

	if len(origin) == 0 {
		return true
	}

	originURL, err := url.Parse(origin[0])

	if err != nil {
		return false
	}

	reqHostname, reqPort, err := net.SplitHostPort(req.Host)

	if err != nil {
		return false
	}

	return util.EqualFold(reqHostname, originURL.Hostname()) && originURL.Port() == httpPort && reqPort == socketPort
}

func handlePacket(client *clients.Client, bytes []byte) {
	if len(bytes) <= 0 {
		return
	}

	reader := util.NewByteReader(bytes)
	packetType := rooms.PacketType(reader.ReadU8())

	switch packetType {
	case rooms.CreateRoomPacket:
		data := rooms.ReadCreateRoom(reader)

		if success, message := rooms.ValidateRoomData(data); !success {
			rooms.SendCreateJoinRoomError(client, message)
		} else if room := rooms.NewRoom(client, data); room == nil {
			rooms.SendCreateJoinRoomError(client, rooms.NewRoomErrorMessage)
		} else {
			rooms.AddClient(room, client, data.OwnerName)
		}

	case rooms.JoinRoomPacket:
		id, name := rooms.ReadJoinRoom(reader)

		if success, message := clients.ValidateName(name); !success {
			rooms.SendCreateJoinRoomError(client, message)
		} else if room := rooms.GetRoom(id); room == nil {
			rooms.SendCreateJoinRoomError(client, "Room not found.")
		} else if len(room.Clients) >= int(room.ClientLimit) {
			rooms.SendCreateJoinRoomError(client, "Room is full.")
		} else {
			rooms.AddClient(room, client, name)
		}

	case rooms.LeaveRoomPacket:
		rooms.ReadLeaveRoom(reader) // Not necessary at the moment -- just here for posterity.

		if room := rooms.GetRoom(client.RoomID); room != nil {
			rooms.RemoveClient(room, client)
		}

	case rooms.RemoveClientPacket:
		targetID := rooms.ReadRemoveClient(reader)

		if room := rooms.GetRoom(client.RoomID); room != nil {
			if room.IsOwner(client.ID()) && !room.IsOwner(targetID) {
				if target := room.GetClient(targetID); target != nil {
					rooms.RemoveClient(room, target)
				}
			}
		}

	case rooms.StartGamePacket:
		fallthrough
	case rooms.SubmitSentencePacket:
		fallthrough
	case rooms.SubmitVotePacket:
		fallthrough
	default:
		if room := rooms.GetRoom(client.RoomID); room != nil {
			room.State.ReceivePacket(client, reader, packetType)
		}
	}
}

func closeHandler(client *clients.Client, _ int, _ string) error {
	if room := rooms.GetRoom(client.RoomID); room != nil {
		rooms.RemoveClient(room, client)
	}

	log.Printf("Disconnected: %s", client.Socket.RemoteAddr())

	return nil
}

// socketHandler is a basic handler for socket connections.
func socketHandler(writer http.ResponseWriter, req *http.Request) {
	if conn, err := upgrader.Upgrade(writer, req, nil); err != nil {
		log.Printf("[Error] Failed to upgrade to WebSocket: %s", err)
	} else {
		log.Printf("New connection: %s", conn.RemoteAddr())

		if client, err := clients.NewClient(conn); err != nil {
			log.Printf("[Error] Failed to create client for socket: %s", err)
			conn.Close()
		} else {
			conn.SetCloseHandler(func(code int, text string) error { return closeHandler(client, code, text) })

			for {
				if msgType, message, err := conn.ReadMessage(); err != nil {
					if websocket.IsUnexpectedCloseError(err) {
						log.Printf("[Error] Socket error: %s", err)
					}

					break
				} else if msgType == websocket.BinaryMessage {
					handlePacket(client, message)
				}
			}
		}
	}
}
