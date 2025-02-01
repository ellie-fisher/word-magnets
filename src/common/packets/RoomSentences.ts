import { PacketBuffer } from "./PacketBuffer";
import { PacketType } from "./PacketType";
import { AnyObject } from "../util";
import { RoomFields } from "../fields/fields";

export const RoomSentences =
{
	pack(object: AnyObject): PacketBuffer
	{
		return PacketBuffer.from(PacketType.RoomSentences, ...Object.keys(object).flatMap(id => [id, object[id]]));
	},

	unpack(buffer: PacketBuffer): AnyObject
	{
		const unpacked: AnyObject = {};
		const { max } = RoomFields.fields.maxPlayers;

		for (let i = 0; i < max && !buffer.isAtEnd; i++)
		{
			unpacked[buffer.readString()] = buffer.readString();
		}

		return unpacked;
	},
};
