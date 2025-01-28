import { PacketType } from "./PacketType";
import { RawPacket } from "./types";
import { AnyObject, getArrayValue, getObjectValue } from "../util";

export const DEFAULT_ERROR = "Could not create room.";

export const CreateRoomRejected =
{
	fromArray(packet: RawPacket): AnyObject
	{
		return { message: getArrayValue(packet, 1, DEFAULT_ERROR) };
	},

	toArray(object: AnyObject): RawPacket
	{
		return [PacketType.CreateRoomRejected, getObjectValue(object, "message", DEFAULT_ERROR)];
	},
};
