/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package main

import (
	"log"
	"net"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/gorilla/websocket"

	"word-magnets/clients"
	"word-magnets/packets"
	"word-magnets/rooms"
	"word-magnets/util"
)

const PROTOCOL_APP = "word-magnets"
const PROTOCOL_BRANCH = "vanilla"
const PROTOCOL_NAME = PROTOCOL_APP + "." + PROTOCOL_BRANCH
const PROTOCOL_VERSION = 1

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     checkOrigin,
	Subprotocols:    []string{PROTOCOL_NAME + "#" + strconv.Itoa(PROTOCOL_VERSION)},
}

// checkOrigin validates the origin and request URLs to make sure they match. The hostnames must be
// the same, but the ports must match the configured port settings.
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

	reader := packets.NewPacketReader(bytes)

	switch reader.PeekU8() {
	case packets.CreateRoomPacket:
		if matched, data := reader.ReadCreateRoom(); matched {
			if success, message := rooms.ValidateRoomData(data); !success {
				client.SendRoomConnectError(true, message)
			} else if room := rooms.NewRoom(client, data); room == nil {
				client.SendRoomConnectError(true, rooms.NewRoomErrorMessage)
			} else {
				room.AddClient(client, data.OwnerName)
			}
		}

	case packets.JoinRoomPacket:
		if matched, id, name := reader.ReadJoinRoom(); matched {
			if success, message := clients.ValidateName(name); !success {
				client.SendRoomConnectError(false, message)
			} else if room := rooms.GetRoom(id); room == nil {
				client.SendRoomConnectError(false, "Room not found.")
			} else if len(room.Clients) >= int(room.ClientLimit) {
				client.SendRoomConnectError(false, "The room is full.")
			} else {
				room.AddClient(client, name)
			}
		}

	case packets.LeaveRoomPacket:
		if reader.ReadLeaveRoom() {
			if room := rooms.GetRoom(client.RoomID); room != nil {
				room.RemoveClient(client)
			}
		}

	case packets.RemoveClientPacket:
		if matched, targetID := reader.ReadRemoveClient(); matched {
			if room := rooms.GetRoom(client.RoomID); room != nil {
				if room.IsOwner(client.ID()) && !room.IsOwner(targetID) {
					if target := room.GetClient(targetID); target != nil {
						room.RemoveClient(target)
					}
				}
			}
		}

	case packets.StartGamePacket:
		fallthrough
	case packets.CancelStartGamePacket:
		fallthrough
	case packets.SubmitSentencePacket:
		fallthrough
	case packets.SubmitVotePacket:
		fallthrough
	default:
		if room := rooms.GetRoom(client.RoomID); room != nil {
			room.ReceivePacket(client, reader)
		}
	}
}

func closeHandler(client *clients.Client, _ int, _ string) error {
	if room := rooms.GetRoom(client.RoomID); room != nil {
		room.RemoveClient(client)
	}

	log.Printf("Disconnected: %s", client.Socket.RemoteAddr())

	return nil
}

// socketHandler is a basic handler for socket connections.
func socketHandler(writer http.ResponseWriter, req *http.Request) {
	if conn, err := upgrader.Upgrade(writer, req, nil); err != nil {
		log.Printf("[Error] Failed to upgrade to WebSocket: %s", err)
	} else if subprotocol := conn.Subprotocol(); subprotocol != upgrader.Subprotocols[0] {
		closeMessage := "Invalid subprotocol. (Ask a nerd what this means.)"

		if reqProtocols := websocket.Subprotocols(req); subprotocol == "" && len(reqProtocols) > 0 {
			subprotocol = reqProtocols[0]
		}

		if index := strings.IndexByte(subprotocol, '#'); index >= 0 {
			name := subprotocol[:index]
			version, err := strconv.ParseInt(subprotocol[index+1:], 10, 32)

			if name != PROTOCOL_NAME {
				closeMessage = "You are using a different application from the server you are trying to connect to."
			} else if err == nil {
				if version < PROTOCOL_VERSION {
					closeMessage = "You are using an older version of the application than the server you are trying to connect to."
				} else if version > PROTOCOL_VERSION {
					closeMessage = "You are using a newer version of the application than the server you are trying to connect to."
				}
			}
		}

		conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseProtocolError, closeMessage))
		conn.Close()
	} else {
		log.Printf("New connection: %s (%s)", conn.RemoteAddr(), conn.Subprotocol())

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
