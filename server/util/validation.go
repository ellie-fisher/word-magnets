/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package util

import (
	"regexp"
	"strings"
)

type FieldValidator struct {
	Min                   uint8
	Max                   uint8
	MinError              string
	MaxError              string
	TrailingSpaceError    string
	ConsecutiveSpaceError string
	CharError             string
	FilterError           string
}

// Regex filters for offensive words.
var WordFilters []*regexp.Regexp

func init() {
	filterStrings := []string{
		// N-Word filters:
		"\bn+\\s*[i1]\\s*[g]\\s*(\b|[^h])",
		"n\\s*[il1]\\s*[g6]+\\s*[e3a4]+\\s*r",

		// R-Word filters:
		"r\\s*[e3]+\\s*[t7]+\\s*[a4]+\\s*r+\\s*d",

		// F-Slur filters:
		"f\\s*[a4]+\\s*[g]",
		"f\\s*[a4]+\\s*[g6]+\\s*[o0]+\\s*[t7]",

		// T-Slur filters:
		"[t7]+\\s*r+\\s*[a4]+\\s*n+\\s*y",
	}

	for _, str := range filterStrings {
		if reg, err := regexp.Compile("(?i)" + str); err != nil {
			panic(err)
		} else {
			WordFilters = append(WordFilters, reg)
		}
	}
}

func (validator *FieldValidator) ValidateU8(value uint8) (bool, string) {
	if value < validator.Min {
		return false, validator.MinError
	}

	if value > validator.Max {
		return false, validator.MaxError
	}

	return true, ""
}

func (validator *FieldValidator) ValidateString(value string) (bool, string) {
	// This is the most we can do here. Trailing spaces should be trimmed by the client first.
	if len(strings.TrimSpace(value)) != len(value) {
		return false, validator.TrailingSpaceError
	}

	// This is the most we can do here. Consecutive spaces should be trimmed by the client first.
	if matched, err := regexp.MatchString("\\s\\s", value); matched || err != nil {
		return false, validator.ConsecutiveSpaceError
	}

	// Detect illegal characters (ASCII characters 32 to 126 are allowed, except for asterisks).
	if matched, err := regexp.MatchString("[^ -)+-~]", value); matched || err != nil {
		return false, validator.CharError
	}

	for _, reg := range WordFilters {
		if reg.MatchString(value) {
			return false, validator.FilterError
		}
	}

	return validator.ValidateU8(uint8(len(value)))
}
