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
	"strconv"

	"word-magnets/clients"
	"word-magnets/util"
)

var timeLimitValidator = util.FieldValidator{Min: 30, Max: 120}
var roundLimitValidator = util.FieldValidator{Min: 1, Max: 12}
var clientLimitValidator = util.FieldValidator{Min: 2, Max: 10}

func init() {
	/* Cache error messages so we're not calculating them every single time. */

	timeLimitValidator.MinError = "Time limit must be at least " + strconv.Itoa(int(timeLimitValidator.Min)) + " second"
	timeLimitValidator.MaxError = "Time limit cannot be more than " + strconv.Itoa(int(timeLimitValidator.Max)) + " second"

	if timeLimitValidator.Min != 1 {
		timeLimitValidator.MinError += "s"
	}

	if timeLimitValidator.Max != 1 {
		timeLimitValidator.MaxError += "s"
	}

	roundLimitValidator.MinError = "Round limit must be at least " + strconv.Itoa(int(roundLimitValidator.Min))
	roundLimitValidator.MaxError = "Round limit cannot be more than " + strconv.Itoa(int(roundLimitValidator.Max))

	clientLimitValidator.MinError = "Client limit must be at least " + strconv.Itoa(int(clientLimitValidator.Min))
	clientLimitValidator.MaxError = "Client limit cannot be more than " + strconv.Itoa(int(clientLimitValidator.Max))
}

func ValidateRoomData(data *UserRoomData) (success bool, message string) {
	if success, message := clients.ValidateName(data.OwnerName); !success {
		return success, message
	}

	if success, message := timeLimitValidator.ValidateU8(data.TimeLimit); !success {
		return success, message
	}

	if success, message := roundLimitValidator.ValidateU8(data.RoundLimit); !success {
		return success, message
	}

	if success, message := clientLimitValidator.ValidateU8(data.ClientLimit); !success {
		return success, message
	}

	return true, ""
}
