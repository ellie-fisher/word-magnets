import { PacketBuffer } from "./PacketBuffer";
import { PacketType } from "./PacketType";
import { Sentence } from "../words/Sentence";
import { UnpackedPacket } from "./types";

export const SubmitSentence =
{
	pack(unpacked: UnpackedPacket): PacketBuffer
	{
		return PacketBuffer.from(PacketType.SubmitSentence, ...(Array.isArray(unpacked.data) ? unpacked.data : []).flat(Infinity));
	},

	unpack(buffer: PacketBuffer): UnpackedPacket
	{
		const sentence: [number, number][] = [];
		const unpacked = { type: buffer.readU8(), data: sentence };

		if (buffer.length % 2 === 1)
		{
			for (let i = 0; i < Sentence.MAX_LENGTH && !buffer.isAtEnd; i++)
			{
				sentence.push([buffer.readU8(), buffer.readU8()]);
			}
		}

		return unpacked;
	},
};
