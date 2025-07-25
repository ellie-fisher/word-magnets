/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package clients

import (
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type Client struct {
	id     string
	Socket *websocket.Conn
	RoomID string
	Name   string
	Vote   string
	Score  uint8
}

// Send transmits a binary packet to the client.
func (client *Client) Send(bytes []byte) error {
	return client.Socket.WriteMessage(websocket.BinaryMessage, bytes)
}

func (client *Client) ID() string {
	return client.id
}

// NewClient attempts to generate a UUID and then create a Client object, returning nil if it fails.
func NewClient(conn *websocket.Conn) (*Client, error) {
	if uuid, err := uuid.NewRandom(); err != nil {
		return nil, err
	} else {
		return &Client{id: uuid.String(), Socket: conn}, nil
	}
}
