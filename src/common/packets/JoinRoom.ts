import { PacketType } from "./PacketType";
import { RawPacket } from "./types";
import { AnyObject, getArrayValue, getObjectValue } from "../util";

export const JoinRoom =
{
	fromArray(packet: RawPacket): AnyObject
	{
		return {
			id: getArrayValue(packet, 1, ""),
			name: getArrayValue(packet, 2, ""),
		};
	},

	toArray(object: AnyObject): RawPacket
	{
		return [
			PacketType.JoinRoom,
			getObjectValue(object, "id", ""),
			getObjectValue(object, "name", ""),
		];
	},
};
