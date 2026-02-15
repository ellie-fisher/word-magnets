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

const maxLength = 100

func NewSentence(authorID string, words []WordEntry, wordbanks []*Wordbank) *Sentence {
	str := ""
	length := len(str)
	prevHyphen := false

	for i := 0; i < len(wordbanks) && i < maxLength && length < maxLength; i++ {
		entry := words[i]

		if !util.HasIndex(wordbanks, int(entry.BankIndex)) {
			return nil
		}

		words := wordbanks[entry.BankIndex].words

		if !util.HasIndex(words, int(entry.WordIndex)) {
			return nil
		}

		word := words[entry.WordIndex]

		if word[0] != '-' && !prevHyphen {
			str += " "
		}

		start := 0
		end := len(word)
		prevHyphen = false

		if word[0] == '-' {
			start++
		}

		if word[len(word)-1] == '-' {
			end--
			prevHyphen = true
		}

		wordSlice := word[start:end]
		sliceLen := len(wordSlice)

		// We don't want players to be able to hack around the sentence length limit by setting
		// their name to a hyphen, so we must account for that.
		if sliceLen <= 0 {
			sliceLen = 1
		}

		if length+sliceLen > maxLength {
			break
		}

		str += wordSlice
		length += sliceLen
	}

	if length > maxLength {
		str = str[:maxLength]
	}

	return &Sentence{authorID, str}
}
