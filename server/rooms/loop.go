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
	"sync"
	"sync/atomic"
	"time"
)

type threadPool struct {
	index  int
	ticker *time.Ticker
	rooms  map[string]*Room
	done   chan bool
	mutex  sync.Mutex
}

const numThreadPools = 8

var threadPools []*threadPool
var currentThreadPool atomic.Uint32

func addRoomToPool(room *Room) {
	if room.threadIndex < 0 || room.threadIndex >= numThreadPools {
		index := int(currentThreadPool.Add(1) % uint32(numThreadPools))
		pool := threadPools[index]

		room.threadIndex = index

		pool.mutex.Lock()
		pool.rooms[room.ID] = room
		pool.mutex.Unlock()
	}
}

func removeRoomFromPool(room *Room) {
	if room.threadIndex >= 0 && room.threadIndex < numThreadPools {
		pool := threadPools[room.threadIndex]

		pool.mutex.Lock()
		delete(pool.rooms, room.ID)
		pool.mutex.Unlock()
	}
}

func init() {
	threadPools = make([]*threadPool, numThreadPools)

	for i := range numThreadPools {
		p := &threadPool{
			index:  i,
			ticker: time.NewTicker(time.Second),
			rooms:  make(map[string]*Room),
			done:   make(chan bool),
		}

		threadPools[i] = p

		go func(pool *threadPool) {
			for {
				select {
				case <-pool.done:
					pool.ticker.Stop()
					return
				case <-pool.ticker.C:
					pool.mutex.Lock()
					for _, room := range pool.rooms {
						room.Tick()
					}
					pool.mutex.Unlock()
				}
			}
		}(p)
	}
}
