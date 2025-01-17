import { PacketType } from "./PacketType";
import { getArrayValue } from "../util";

export abstract class Packet
{
	#type: PacketType = PacketType.Invalid;

	constructor(type: PacketType)
	{
		this.#type = type;
	}

	public get type(): PacketType { return this.#type; }

	public pack(): [PacketType, ...any]
	{
		return [this.#type];
	}

	public unpack(data: [PacketType, ...any]): void
	{
		this.#type = getArrayValue(data, 0, PacketType.Invalid);
	}
};
