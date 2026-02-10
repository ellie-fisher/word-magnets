/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package util

import "math/rand"

type Number interface {
	~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64 |
		~int | ~int8 | ~int16 | ~int32 | ~int64 |
		~float32 | ~float64
}

// RandIntn is a wrapper for rand.Intn with min and max parameters.
func RandIntn(min int, max int) int {
	return rand.Intn(max-min) + min
}

// HasIndex checks if index is a valid index of slice.
func HasIndex[T any](slice []T, index int) bool {
	return index >= 0 && index < len(slice)
}

// EqualFold is [strings.EqualFold], ASCII only. It reports whether s and t are equal, ASCII-case-insensitively.
// (Taken from the "net" module.)
func EqualFold(s, t string) bool {
	if len(s) != len(t) {
		return false
	}

	for i := 0; i < len(s); i++ {
		if lower(s[i]) != lower(t[i]) {
			return false
		}
	}

	return true
}

// lower returns the ASCII lowercase version of b.
// (Taken from the "net" module.)
func lower(b byte) byte {
	if b >= 'A' && b <= 'Z' {
		return b + ('a' - 'A')
	}
	return b
}

// Go doesn't have sets natively, so we just use a map with the smallest possible value as a hack.
type Set[T Number | string] struct {
	values map[T]bool
}

func (set *Set[T]) Add(value T) {
	set.values[value] = true
}

func (set *Set[T]) Delete(value T) {
	delete(set.values, value)
}

func (set *Set[T]) Has(value T) bool {
	_, has := set.values[value]
	return has
}

func NewSet[T Number | string](values ...T) *Set[T] {
	set := &Set[T]{map[T]bool{}}

	for _, value := range values {
		set.values[value] = true
	}

	return set
}
