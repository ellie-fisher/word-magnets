import { PacketBuffer } from "./PacketBuffer";
import { PacketType } from "./PacketType";
import { Sentence } from "../words/Sentence";
import { AnyObject } from "../util";

export const SubmitSentence =
{
	pack(object: AnyObject): PacketBuffer
	{
		return PacketBuffer.from(PacketType.SubmitSentence, ...(Array.isArray(object) ? object : []).flat(Infinity));
	},

	unpack(buffer: PacketBuffer): AnyObject
	{
		const unpacked: [number, number][] = [];

		if (buffer.length % 2 === 1)
		{
			for (let i = 0; i < Sentence.MAX_LENGTH && !buffer.isAtEnd; i++)
			{
				unpacked.push([buffer.readU8(), buffer.readU8()]);
			}
		}

		return unpacked;
	},
};
