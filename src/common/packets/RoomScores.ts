import { PacketBuffer } from "./PacketBuffer";
import { PacketType } from "./PacketType";
import { AnyObject } from "../util";
import { UnpackedPacket } from "./types";

export interface UnpackedRoomScores extends UnpackedPacket
{
	data: { [key: string]: number };
};

export const RoomScores =
{
	pack(unpacked: UnpackedRoomScores): PacketBuffer
	{
		return PacketBuffer.from(PacketType.RoomScores, ...Object.keys(unpacked.data ?? {}).flatMap(key => [key, unpacked.data[key]]));
	},

	unpack(buffer: PacketBuffer): UnpackedRoomScores
	{
		const scores: AnyObject = {};
		const unpacked = { type: buffer.readU8(), data: scores };

		while (!buffer.isAtEnd)
		{
			scores[buffer.readString()] = buffer.readU8();
		}

		return unpacked;
	},
};
