import { PacketType } from "./PacketType";
import { RawPacket } from "./types";
import { AnyObject } from "../util";

export const DestroyRoom =
{
	fromArray(_: RawPacket): AnyObject
	{
		return {};
	},

	toArray(_: AnyObject): RawPacket
	{
		return [PacketType.DestroyRoom];
	}
};
