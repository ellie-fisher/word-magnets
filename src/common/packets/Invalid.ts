import { Packet } from "./Packet";
import { PacketType } from "./PacketType";

export class Invalid extends Packet
{
	constructor()
	{
		super(PacketType.Invalid);
	}

	public pack(): [PacketType]
	{
		return [super.pack()[0]];
	}

	public unpack(_: [PacketType, ...any]): void {}
};
