import { PacketType } from "./PacketType";
import { RawPacket } from "./types";
import { AnyObject, getObjectValue } from "../util";

export const SubmitSentence =
{
	fromArray(packet: RawPacket): AnyObject
	{
		const words: [number, number][] = [];
		const { length } = packet;

		if (length % 2 === 1)
		{
			for (let i = 1; i < length; i += 2)
			{
				words.push([packet[i], packet[i + 1]]);
			}
		}

		return { words };
	},

	toArray(object: AnyObject): RawPacket
	{
		return [
			PacketType.SubmitSentence,
			...(getObjectValue(object, "words", []) as any[]).flat(Infinity),
		];
	},
};
