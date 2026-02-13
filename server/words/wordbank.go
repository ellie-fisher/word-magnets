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

type Wordbank struct {
	isFixed bool
	words   []string
}

func (wordbank *Wordbank) IsFixed() bool {
	return wordbank.isFixed
}

func (wordbank *Wordbank) Words() []string {
	return wordbank.words[:]
}

var fixedPronouns Wordbank = Wordbank{isFixed: true, words: pronouns}
var fixedAuxiliaries Wordbank = Wordbank{isFixed: true, words: auxiliaries}
var fixedPrepositions Wordbank = Wordbank{isFixed: true, words: prepositions}
var fixedMiscellaneous Wordbank = Wordbank{isFixed: true, words: miscellaneous}

func NewWordbank(wordType WordType) *Wordbank {
	var wordbank *Wordbank = nil

	switch wordType {
	case Pronoun:
		wordbank = &fixedPronouns
	case Auxiliary:
		wordbank = &fixedAuxiliaries
	case Preposition:
		wordbank = &fixedPrepositions
	case Miscellaneous:
		wordbank = &fixedMiscellaneous
	case Noun:
		wordbank = &Wordbank{isFixed: false, words: nouns}
	case Adjective:
		wordbank = &Wordbank{isFixed: false, words: adjectives}
	case Verb:
		wordbank = &Wordbank{isFixed: false, words: verbs}
	default:
	}

	if wordbank != nil && !wordbank.isFixed {
		var selected []string = make([]string, maxWordsPerBank)
		length := len(wordbank.words)
		increments := length / maxWordsPerBank

		for i := range maxWordsPerBank {
			index := 0
			start := i * increments

			if i == maxWordsPerBank-1 {
				index = util.RandIntn(start, length)
			} else {
				index = util.RandIntn(start, start+increments)
			}

			selected[i] = wordbank.words[index]
		}

		wordbank.words = selected
	}

	return wordbank
}
