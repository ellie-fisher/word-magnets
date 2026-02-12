/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package rooms

import "time"

const numThreadPools = 8

type threadPool struct {
	index  int
	ticker *time.Ticker
	rooms  map[string]*Room
	done   chan bool
}

var threadPools []threadPool
var currentThreadPool = 0

func addRoomToPool(room *Room) {
	if room.threadIndex < 0 || room.threadIndex >= numThreadPools {
		room.threadIndex = currentThreadPool
		threadPools[room.threadIndex].rooms[room.ID] = room
		currentThreadPool = (currentThreadPool + 1) % numThreadPools
	}
}

func removeRoomFromPool(room *Room) {
	if room.threadIndex >= 0 || room.threadIndex < numThreadPools {
		delete(threadPools[room.threadIndex].rooms, room.ID)
	}
}

func init() {
	threadPools = make([]threadPool, numThreadPools)

	for i := range numThreadPools {
		pool := &threadPools[i]
		pool.index = i
		pool.ticker = time.NewTicker(time.Second)
		pool.rooms = make(map[string]*Room)
		pool.done = make(chan bool)

		go func() {
			for {
				select {
				case <-pool.done:
					return
				case <-pool.ticker.C:
					for _, room := range pool.rooms {
						room.Tick()
					}
				}
			}
		}()
	}
}
