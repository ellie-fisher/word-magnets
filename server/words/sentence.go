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

type WordEntry struct {
	BankIndex uint8
	WordIndex uint8
}

type Sentence struct {
	AuthorID string
	Value    string
}

const maxLength = 120

func NewSentence(authorID string, words []WordEntry, wordbanks []*Wordbank) *Sentence {
	str := ""
	prev := ""
	length := 0

	for i := 0; i < len(words) && i < maxLength; i++ {
		entry := words[i]

		if !util.HasIndex(wordbanks, int(entry.BankIndex)) {
			return nil
		}

		words := wordbanks[entry.BankIndex].words

		if !util.HasIndex(words, int(entry.WordIndex)) {
			return nil
		}

		word := words[entry.WordIndex]

		if i > 0 && prev[len(prev)-1] != '-' && word[0] != '-' {
			str += " "
			length++
		}

		// We don't want players to be able to hack around the sentence length limit by setting
		// their name to a hyphen, so we must account for that.
		if word == "-" || word == "--" {
			length += len(word)
		}

		prev = word

		if word[0] == '-' {
			word = word[1:]
		}

		if word[len(word)-1] == '-' {
			word = word[:len(word)-1]
		}

		if length+len(word) > maxLength {
			break
		}

		str += word
		length += len(word)
	}

	if length > maxLength {
		str = str[:maxLength]
	}

	return &Sentence{authorID, str}
}
