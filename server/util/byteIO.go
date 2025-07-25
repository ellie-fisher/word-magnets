/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package util

import "slices"

const MaxStringLength = 255

/**
 * ByteReader
 */

type ByteReader struct {
	index int
	bytes []byte
}

func (reader *ByteReader) IsAtEnd() bool {
	return reader.index >= len(reader.bytes)
}

func (reader *ByteReader) ReadU8() uint8 {
	var value uint8

	if !reader.IsAtEnd() {
		value = reader.bytes[reader.index]
		reader.index++
	}

	return value
}

func (reader *ByteReader) ReadString() string {
	length := reader.ReadU8()
	str := ""

	for i := 0; i < int(length) && !reader.IsAtEnd(); i++ {
		str += string(reader.ReadU8())
	}

	return str
}

func NewByteReader(bytes []byte) *ByteReader {
	return &ByteReader{0, bytes}
}

/**
 * ByteWriter
 */

type ByteWriterErr struct{}

func (err *ByteWriterErr) Error() string {
	return "Failed to write one or more value(s)"
}

type ByteWriter struct {
	index int
	bytes []byte
}

func (writer *ByteWriter) Bytes() []byte {
	return writer.bytes
}

func (writer *ByteWriter) WriteU8(value uint8) {
	if writer.index < len(writer.bytes) {
		writer.bytes[writer.index] = value
	} else {
		writer.bytes = append(writer.bytes, value)
	}

	writer.index++
}

func (writer *ByteWriter) WriteString(value string) bool {
	bytes := []byte(value)
	truncated := len(bytes) > MaxStringLength

	if truncated {
		bytes = bytes[:MaxStringLength+1]
	}

	writer.WriteU8(uint8(len(bytes)))

	writer.bytes = slices.Concat(writer.bytes, bytes)
	writer.index += len(bytes)

	return truncated
}

func (writer *ByteWriter) Write(values ...any) error {
	for _, value := range values {
		switch cast := value.(type) {
		case uint8:
			writer.WriteU8(cast)
		case string:
			writer.WriteString(cast)
		default:
			return &ByteWriterErr{}
		}
	}

	return nil
}

func NewByteWriter(size int) *ByteWriter {
	return &ByteWriter{0, make([]byte, size)}
}
