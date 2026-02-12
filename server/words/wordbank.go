/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package words

import "word-magnets/util"

type Wordbank []string
type WordType = uint8

// NOTE: Does not apply to pronouns or miscellaneous, which are fixed.
const maxWordsPerBank = 8

const (
	Noun WordType = iota
	Adjective
	Verb
	Pronoun
	Auxiliary
	Preposition
	Miscellaneous
)

var wordbanks = map[WordType]Wordbank{
	Noun:          nouns,
	Adjective:     adjectives,
	Verb:          verbs,
	Pronoun:       pronouns,
	Auxiliary:     auxiliaries,
	Preposition:   prepositions,
	Miscellaneous: miscellaneous,
}

func NewWordbank(wordType WordType) Wordbank {
	if bank := wordbanks[wordType]; bank == nil {
		return Wordbank{}
	} else {
		// Pick random words from the wordbank without repeats. Some wordbanks are fixed, so we won't be selecting
		// randomly from them.
		switch wordType {
		case Noun:
			fallthrough
		case Adjective:
			fallthrough
		case Verb:
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

		// Ignore any fixed wordbanks. These cases are just here for posterity.
		case Pronoun:
			fallthrough
		case Auxiliary:
			fallthrough
		case Preposition:
			fallthrough
		case Miscellaneous:
			fallthrough
		default:
		}

		return bank
	}
}
