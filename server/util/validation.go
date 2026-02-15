/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package util

import (
	"regexp"
	"strings"
)

type FieldValidator struct {
	Min        uint8
	Max        uint8
	MinError   string
	MaxError   string
	SpaceError string
	CharError  string
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
	if len(strings.TrimSpace(value)) != len(value) {
		return false, validator.SpaceError
	}

	if matched, err := regexp.MatchString("[^ -)+-~]", value); matched || err != nil {
		return false, validator.CharError
	}

	return validator.ValidateU8(uint8(len(value)))
}
