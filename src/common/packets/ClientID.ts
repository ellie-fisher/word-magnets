import { Packet } from "./Packet";
import { PacketType } from "./PacketType";
import { getArrayValue } from "../util";

export class ClientID extends Packet
{
	#id: string = "";

	constructor()
	{
		super(PacketType.ClientID);
	}

	public get id(): string { return this.#id; }

	public toArray(): [PacketType, string]
	{
		return [this.type, this.#id];
	}

	public fromArray(data: [PacketType, ...any]): void
	{
		super.fromArray(data);

		this.#id = getArrayValue(data, 1, "");
	}
};
