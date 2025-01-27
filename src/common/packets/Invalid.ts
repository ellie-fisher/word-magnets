import { PacketType } from "./PacketType";
import { RawPacket } from "./types";
import { AnyObject } from "../util";

export const Invalid =
{
	fromArray(_: RawPacket): AnyObject
	{
		return {};
	},

	toArray(_: AnyObject): RawPacket
	{
		return [PacketType.Invalid];
	},
};
