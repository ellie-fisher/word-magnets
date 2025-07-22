/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package clients

import (
	"strconv"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

const minNameLen = uint8(1)
const maxNameLen = uint8(16)

var nameLengthError = ""

type Client struct {
	ID     string
	Socket *websocket.Conn
	RoomID string
	Name   string
	Vote   string
	Score  uint8
}

func init() {
	// Cache error message so we're not calculating it every single time.
	nameLengthError = "Name must be " + strconv.Itoa(int(minNameLen)) + "-" + strconv.Itoa(int(maxNameLen)) + " character(s) long"
}

// Send transmits a binary packet to the client.
func (client *Client) Send(bytes []byte) error {
	return client.Socket.WriteMessage(websocket.BinaryMessage, bytes)
}

func NewClient(conn *websocket.Conn) (*Client, error) {
	if uuid, err := uuid.NewRandom(); err != nil {
		return nil, err
	} else {
		return &Client{ID: uuid.String(), Socket: conn}, nil
	}
}

func ValidateName(name string) (bool, string) {
	if len(name) < int(minNameLen) || len(name) > int(maxNameLen) {
		return false, nameLengthError
	}

	return true, ""
}
