import { PacketBuffer, PacketField } from "./PacketBuffer";
import { PacketType } from "./PacketType";
import { AnyObject } from "../util";

export const RoomWords =
{
	pack(object: AnyObject): PacketBuffer
	{
		const values: PacketField[] = [];

		if (Array.isArray(object))
		{
			for (let i = 0; i < object.length; i++)
			{
				const words = object[i];

				values.push(words.length);

				for (let j = 0; j < words.length; j++)
				{
					values.push(words[j]);
				}
			}
		}

		return PacketBuffer.from(PacketType.RoomWords, ...values);
	},

	unpack(buffer: PacketBuffer): AnyObject
	{
		const wordbanks: string[][] = [];

		while (!buffer.isAtEnd)
		{
			const length = buffer.readU8();
			const words = [];

			for (let i = 0; i < length && !buffer.isAtEnd; i++)
			{
				words.push(buffer.readString());
			}

			wordbanks.push(words);
		}

		return wordbanks;
	},
};
