import { PacketBuffer, PacketField } from "./PacketBuffer";
import { PacketType } from "./PacketType";
import { UnpackedPacket } from "./types";

export const RoomWords =
{
	pack(unpacked: UnpackedPacket): PacketBuffer
	{
		const values: PacketField[] = [];

		if (Array.isArray(unpacked.data))
		{
			for (let i = 0; i < unpacked.data.length; i++)
			{
				const words = unpacked.data[i];

				values.push(words.length);

				for (let j = 0; j < words.length; j++)
				{
					values.push(words[j]);
				}
			}
		}

		return PacketBuffer.from(PacketType.RoomWords, ...values);
	},

	unpack(buffer: PacketBuffer): UnpackedPacket
	{
		const wordbanks: string[][] = [];
		const unpacked = { type: buffer.readU8(), data: wordbanks };

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

		return unpacked;
	},
};
