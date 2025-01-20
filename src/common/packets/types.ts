import { AnyObject } from "../util";
import { PacketType } from "./PacketType";

export type RawPacket = [PacketType, ...any];

export interface PacketConverter
{
	fromArray(packet: RawPacket): AnyObject;
	toArray(packet: AnyObject): RawPacket;
};
