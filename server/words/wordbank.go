/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package words

import (
	"word-magnets/util"
)

type WordType = uint8

const (
	Noun WordType = iota
	Adjective
	Verb
	Pronoun
	Auxiliary
	Preposition
	Miscellaneous
)

type WordbankFlag = uint8

const flagFixed WordbankFlag = 1 << 0
const flagPlayer WordbankFlag = 1 << 1

// NOTE: Only applies to nouns, adjectives, and verbs.
const maxWordsPerBank = 8

type Wordbank struct {
	flags WordbankFlag
	words []string
}

func (wordbank *Wordbank) IsFixed() bool {
	return (wordbank.flags & flagFixed) != 0
}

func (wordbank *Wordbank) IsPlayer() bool {
	return (wordbank.flags & flagPlayer) != 0
}

func (wordbank *Wordbank) Flags() WordbankFlag {
	return wordbank.flags
}

func (wordbank *Wordbank) Words() []string {
	return wordbank.words[:]
}

var fixedPronouns Wordbank = Wordbank{flags: flagFixed, words: pronouns}
var fixedAuxiliaries Wordbank = Wordbank{flags: flagFixed, words: auxiliaries}
var fixedPrepositions Wordbank = Wordbank{flags: flagFixed, words: prepositions}
var fixedMiscellaneous Wordbank = Wordbank{flags: flagFixed, words: miscellaneous}

func NewPlayerWordbank(names []string) *Wordbank {
	return &Wordbank{flags: flagPlayer, words: names}
}

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
		wordbank = &Wordbank{flags: 0, words: nouns}
	case Adjective:
		wordbank = &Wordbank{flags: 0, words: adjectives}
	case Verb:
		wordbank = &Wordbank{flags: 0, words: verbs}
	default:
	}

	if wordbank != nil && !wordbank.IsFixed() {
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
