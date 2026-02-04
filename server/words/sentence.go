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
	Words    []*WordEntry
}

const maxLength = 100

func (sentence Sentence) String(wordbanks []Wordbank) string {
	str := ""
	prevHyphen := false

	for i := 0; i < len(wordbanks) && i < maxLength; i++ {
		entry := sentence.Words[i]

		if !util.HasIndex(wordbanks, int(entry.BankIndex)) {
			return ""
		}

		bank := wordbanks[entry.BankIndex]

		if !util.HasIndex(bank, int(entry.WordIndex)) {
			return ""
		}

		word := bank[entry.WordIndex]

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

		str += word[start:end]

		if len(str) > maxLength {
			break
		}
	}

	if len(str) > maxLength {
		str = str[:maxLength]
	}

	return str
}
