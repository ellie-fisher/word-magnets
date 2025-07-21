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

func (reader *ByteReader) ReadU16() uint16 {
	return uint16(reader.ReadU8()) + (uint16(reader.ReadU8()) << 8)
}

func (reader *ByteReader) ReadBool() bool {
	return reader.ReadU8() != 0
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

func (writer *ByteWriter) WriteU16(value uint16) {
	writer.WriteU8(uint8(value & 0xFF))
	writer.WriteU8(uint8(value >> 8))
}

func (writer *ByteWriter) WriteBool(value bool) {
	if value {
		writer.WriteU8(1)
	} else {
		writer.WriteU8(0)
	}
}

func (writer *ByteWriter) WriteString(value string) bool {
	truncated := len(value) > MaxStringLength
	value = value[:MaxStringLength+1]

	writer.WriteU8(uint8(len(value)))

	writer.bytes = slices.Concat(writer.bytes, []byte(value))
	writer.index += len(value)

	return truncated
}

func NewByteWriter(size int) *ByteWriter {
	return &ByteWriter{0, make([]byte, size)}
}
