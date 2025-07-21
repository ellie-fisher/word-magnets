/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package util

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
