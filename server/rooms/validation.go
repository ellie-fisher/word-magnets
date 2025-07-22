/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package rooms

import (
	"strconv"
	"word-magnets/clients"
)

const minTimeLimit = uint8(30)
const minRoundLimit = uint8(1)
const minClientLimit = uint8(2)

const maxTimeLimit = uint8(120)
const maxRoundLimit = uint8(12)
const maxClientLimit = uint8(12)

var timeLimitError = ""
var roundLimitError = ""
var clientLimitError = ""

func init() {
	/* Cache error messages so we're not calculating them every single time. */

	timeLimitError = "Time limit must be in range " + strconv.Itoa(int(minTimeLimit)) + "-" + strconv.Itoa(int(maxTimeLimit))
	roundLimitError = "Round limit must be in range " + strconv.Itoa(int(minRoundLimit)) + "-" + strconv.Itoa(int(maxRoundLimit))
	clientLimitError = "Client limit must be in range " + strconv.Itoa(int(minClientLimit)) + "-" + strconv.Itoa(int(maxClientLimit))
}

func ValidateRoomData(data *CreateRoomData) (success bool, message string) {
	if success, message := clients.ValidateName(data.OwnerName); !success {
		return success, message
	}

	if data.TimeLimit < minTimeLimit || data.TimeLimit > maxTimeLimit {
		return false, timeLimitError
	}

	if data.RoundLimit < minRoundLimit || data.RoundLimit > maxRoundLimit {
		return false, roundLimitError
	}

	if data.ClientLimit < minClientLimit || data.ClientLimit > maxClientLimit {
		return false, clientLimitError
	}

	return true, ""
}
