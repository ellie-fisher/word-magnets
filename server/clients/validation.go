/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package clients

import (
	"strconv"
	"word-magnets/util"
)

var nameValidator = util.FieldValidator{Min: 1, Max: 16}

func init() {
	nameValidator.MinError = "Name must be at least " + strconv.Itoa(int(nameValidator.Min)) + " character"
	nameValidator.MaxError = "Name cannot be longer than " + strconv.Itoa(int(nameValidator.Max)) + " character"

	if nameValidator.Min != 1 {
		nameValidator.MinError += "s"
	}

	if nameValidator.Max != 1 {
		nameValidator.MaxError += "s"
	}
}

func ValidateName(name string) (bool, string) {
	return nameValidator.ValidateString(name)
}
