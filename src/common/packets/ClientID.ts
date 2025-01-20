import { PacketType } from "./PacketType";
import { RawPacket } from "./types";
import { AnyObject, getArrayValue, getObjectValue } from "../util";

export const ClientID =
{
	fromArray(packet: RawPacket): AnyObject
	{
		return { id: getArrayValue(packet, 1, "") };
	},

	toArray(object: AnyObject): RawPacket
	{
		return [PacketType.ClientID, getObjectValue(object, "id", "")];
	},
};
