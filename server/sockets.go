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

// socketHandler is a basic handler for socket connections.
func socketHandler(writer http.ResponseWriter, req *http.Request) {
	if conn, err := upgrader.Upgrade(writer, req, nil); err != nil {
		log.Printf("[Error] Failed to upgrade to WebSocket: %s", err)
	} else {
		log.Printf("New connection: %s", conn.RemoteAddr())

		for {
			msgType, message, err := conn.ReadMessage()

			if err != nil {
				if websocket.IsUnexpectedCloseError(err) {
					log.Printf("[Error] Socket error: %s", err)
				}

				break
			}

			if msgType == websocket.BinaryMessage {
				log.Printf("Message received (%d): %X", msgType, message)
			} else {
				log.Printf("Message received (%d): %s", msgType, message)
			}
		}
	}
}
