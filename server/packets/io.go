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
	"bytes"
	"encoding/binary"
	"math"
	"strconv"
	"strings"

	"word-magnets/util"
)

/**
 * PacketReader
 */

type PacketReader struct {
	buffer bytes.Buffer
}

func (reader *PacketReader) IsAtEnd() bool {
	return reader.buffer.Len() <= 0
}

func (reader *PacketReader) PeekU8() uint8 {
	var value uint8

	if !reader.IsAtEnd() {
		value = reader.buffer.Bytes()[0]
	}

	return value
}

func (reader *PacketReader) ReadU8() uint8 {
	var value uint8

	if !reader.IsAtEnd() {
		value, _ = reader.buffer.ReadByte()
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

func NewPacketReader(packet []byte) *PacketReader {
	return &PacketReader{*bytes.NewBuffer(packet)}
}

/**
 * PacketWriter
 */

var truncateErrMessage string = "String was truncated to " + strconv.Itoa(math.MaxUint8) + "character(s)"

type PacketWriterErr struct {
	message string
}

func (err *PacketWriterErr) Error() string {
	if err.message != "" {
		return err.message
	} else {
		return "Failed to write one or more value(s)"
	}
}

type PacketWriter struct {
	buffer bytes.Buffer
}

func (writer *PacketWriter) Bytes() []byte {
	return writer.buffer.Bytes()
}

func (writer *PacketWriter) WriteU8(value uint8) error {
	return writer.buffer.WriteByte(value)
}

func (writer *PacketWriter) WriteU32(value uint32) error {
	return binary.Write(&writer.buffer, binary.LittleEndian, value)
}

func (writer *PacketWriter) WriteBool(value bool) {
	writer.WriteU8(util.BoolToU8(value))
}

func (writer *PacketWriter) WriteString(value string) bool {
	bytes := []byte(value)
	success := len(bytes) <= math.MaxUint8

	if !success {
		bytes = bytes[:math.MaxUint8+1]
	}

	writer.WriteU8(uint8(len(bytes)))
	writer.buffer.Write(bytes)

	return success
}

func (writer *PacketWriter) WriteU8Cond(value uint8, cond bool) {
	if cond {
		writer.WriteU8(value)
	}
}

func (writer *PacketWriter) WriteStringCond(value string, cond bool) {
	if cond {
		writer.WriteString(value)
	}
}

func (writer *PacketWriter) Write(values ...any) error {
	for _, value := range values {
		switch cast := value.(type) {
		case uint8:
			writer.WriteU8(cast)
		case uint32:
			writer.WriteU32(cast)
		case bool:
			writer.WriteBool(cast)
		case string:
			if !writer.WriteString(cast) {
				return &PacketWriterErr{message: truncateErrMessage}
			}
		default:
			return &PacketWriterErr{}
		}
	}

	return nil
}

func NewPacketWriter(size int) *PacketWriter {
	return &PacketWriter{}
}
