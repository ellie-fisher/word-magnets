/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package words

import "word-magnets/util"

type Wordbank []string
type WordType = uint8

// NOTE: Does not apply to pronouns or miscellaneous, which are fixed.
const maxWordsPerBank = 12

const (
	Noun WordType = iota
	Adjective
	Verb
	Pronoun
	Miscellaneous
)

func NewWordbank(wordType WordType) Wordbank {
	var bank Wordbank

	switch wordType {
	case Noun:
		bank = nouns
	case Adjective:
		bank = adjectives
	case Verb:
		bank = verbs
	case Pronoun:
		bank = pronouns
	case Miscellaneous:
		bank = miscellaneous
	default:
	}

	// Pick random words from the wordbank without repeats. Pronoun and Miscellaneous wordbanks are fixed, so we are
	// not going to pick randomly from them.
	if wordType != Pronoun && wordType != Miscellaneous {
		var selected Wordbank

		length := len(bank)
		increments := length / maxWordsPerBank

		for i := range maxWordsPerBank {
			index := 0
			start := i * increments

			if i == maxWordsPerBank-1 {
				index = util.RandIntn(start, length)
			} else {
				index = util.RandIntn(start, start+increments)
			}

			selected = append(selected, bank[index])
		}

		bank = selected
	}

	return bank
}
