import { PacketBuffer } from "./PacketBuffer";
import { PacketType } from "./PacketType";
import { AnyObject } from "../util";

export interface PacketConverter
{
	pack(object: UnpackedPacket): PacketBuffer;
	unpack(buffer: PacketBuffer): UnpackedPacket;
};

export interface UnpackedPacket
{
	type: PacketType,
	data?: AnyObject,
};
