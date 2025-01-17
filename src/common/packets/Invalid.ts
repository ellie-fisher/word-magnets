import { Packet } from "./Packet";
import { PacketType } from "./PacketType";

export class Invalid extends Packet
{
	constructor()
	{
		super(PacketType.Invalid);
	}

	public toArray(): [PacketType]
	{
		return [super.toArray()[0]];
	}

	public fromArray(_: [PacketType, ...any]): void {}
};
