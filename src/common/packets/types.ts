import { PacketBuffer } from "./PacketBuffer";
import { AnyObject } from "../util";

export interface PacketConverter
{
	pack(object: AnyObject): PacketBuffer;
	unpack(buffer: PacketBuffer): AnyObject;
};
