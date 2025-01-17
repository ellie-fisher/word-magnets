import { Packet } from "./Packet";
import { PacketType } from "./PacketType";

export class Invalid extends Packet
{
	constructor()
	{
		super(PacketType.Invalid);
	}
};
