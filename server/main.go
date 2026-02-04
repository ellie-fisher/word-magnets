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
	"sync"
)

const httpPort = "3000"
const socketPort = "4000"

// listen starts a server on the hostname and port specified.
func listen(hostPort string, handler http.HandlerFunc, waitGroup *sync.WaitGroup) {
	defer waitGroup.Done()

	mux := http.NewServeMux()
	mux.HandleFunc("/", handler)

	if listener, err := net.Listen("tcp", hostPort); err != nil {
		log.Fatalf("Failed to start HTTP server: %s", err)
	} else {
		log.Printf("HTTP server started on %s", hostPort)

		if err := http.Serve(listener, mux); err != nil {
			log.Fatalf("HTTP server error: %s", err)
		}
	}
}

func main() {
	var waitGroup sync.WaitGroup

	waitGroup.Add(2)

	go listen("localhost:"+httpPort, httpHandler, &waitGroup)
	go listen("localhost:"+socketPort, socketHandler, &waitGroup)

	waitGroup.Wait()
}
