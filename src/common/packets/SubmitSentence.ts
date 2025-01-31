import { PacketBuffer } from "./PacketBuffer";
import { PacketType } from "./PacketType";
import { Sentence } from "../words/Sentence";
import { AnyObject, getObjectValue } from "../util";

export const SubmitSentence =
{
	pack(object: AnyObject): PacketBuffer
	{
		return PacketBuffer.from(PacketType.SubmitSentence, ...(getObjectValue(object, "words", []) as any[]).flat(Infinity));
	},

	unpack(buffer: PacketBuffer): AnyObject
	{
		const words: [number, number][] = [];

		if (buffer.length % 2 === 1)
		{
			for (let i = 0; i < Sentence.MAX_LENGTH && !buffer.isAtEnd; i++)
			{
				words.push([buffer.readU8(), buffer.readU8()]);
			}
		}

		return { words };
	},
};
