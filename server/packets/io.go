/**
 * Copyright (C) 2026 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General
 * Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package packets

import (
	"slices"
	"strings"
	"word-magnets/util"
)

const MaxStringLength = 255

/**
 * PacketReader
 */

type PacketReader struct {
	index int
	bytes []byte
}

func (reader *PacketReader) IsAtEnd() bool {
	return reader.index >= len(reader.bytes)
}

func (reader *PacketReader) PeekU8() uint8 {
	var value uint8

	if !reader.IsAtEnd() {
		value = reader.bytes[reader.index]
	}

	return value
}

func (reader *PacketReader) ReadU8() uint8 {
	var value uint8

	if !reader.IsAtEnd() {
		value = reader.bytes[reader.index]
		reader.index++
	}

	return value
}

func (reader *PacketReader) ReadBool() bool {
	return reader.ReadU8() != 0
}

func (reader *PacketReader) ReadString() string {
	length := reader.ReadU8()

	var str strings.Builder
	str.Grow(int(length))

	for i := 0; i < int(length) && !reader.IsAtEnd(); i++ {
		str.WriteByte(reader.ReadU8())
	}

	return str.String()
}

func (reader *PacketReader) MatchU8(value uint8) bool {
	matches := reader.PeekU8() == value

	if matches {
		reader.ReadU8()
	}

	return matches
}

func NewPacketReader(bytes []byte) *PacketReader {
	return &PacketReader{0, bytes}
}

/**
 * PacketWriter
 */

type PacketWriterErr struct{}

func (err *PacketWriterErr) Error() string {
	return "Failed to write one or more value(s)"
}

type PacketWriter struct {
	index int
	bytes []byte
}

func (writer *PacketWriter) Bytes() []byte {
	return writer.bytes
}

func (writer *PacketWriter) WriteU8(value uint8) {
	if writer.index < len(writer.bytes) {
		writer.bytes[writer.index] = value
	} else {
		writer.bytes = append(writer.bytes, value)
	}

	writer.index++
}

func (writer *PacketWriter) WriteBool(value bool) {
	writer.WriteU8(util.BoolToU8(value))
}

func (writer *PacketWriter) WriteString(value string) bool {
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

func (writer *PacketWriter) Write(values ...any) error {
	for _, value := range values {
		switch cast := value.(type) {
		case uint8:
			writer.WriteU8(cast)
		case bool:
			writer.WriteBool(cast)
		case string:
			writer.WriteString(cast)
		default:
			return &PacketWriterErr{}
		}
	}

	return nil
}

func NewPacketWriter(size int) *PacketWriter {
	return &PacketWriter{0, make([]byte, size)}
}
