import { Packet } from "./Packet";
import { PacketType } from "./PacketType";
import { ClientFieldsValues, RoomFieldsValues, RoomFields } from "../fields/fields";
import { getArrayValue } from "../util";

export class CreateRoom extends Packet
{
	#clientData: ClientFieldsValues;
	#roomData: RoomFieldsValues;

	constructor()
	{
		super(PacketType.CreateRoom);

		this.#clientData = { name: "" };
		this.#roomData =
		{
			timeLimit: RoomFields.fields.timeLimit.default as number,
			maxRounds: RoomFields.fields.maxRounds.default as number,
			maxPlayers: RoomFields.fields.maxPlayers.default as number,
		};
	}

	public get clientData(): ClientFieldsValues { return { name: this.#clientData.name }; }

	public get roomData(): RoomFieldsValues
	{
		return {
			timeLimit: this.#roomData.timeLimit,
			maxRounds: this.#roomData.maxRounds,
			maxPlayers: this.#roomData.maxPlayers,
		};
	}

	public toArray(): [PacketType, string, number, number, number]
	{
		const { clientData, roomData } = this;

		return [this.type, clientData.name, roomData.timeLimit, roomData.maxRounds, roomData.maxPlayers];
	}

	public fromArray(data: [PacketType, ...any]): void
	{
		super.fromArray(data);

		const { fields: roomFields } = RoomFields;

		this.#clientData.name = getArrayValue(data, 1, "");
		this.#roomData.timeLimit = getArrayValue(data, 2, roomFields.timeLimit.default);
		this.#roomData.maxRounds = getArrayValue(data, 3, roomFields.maxRounds.default);
		this.#roomData.maxPlayers = getArrayValue(data, 4, roomFields.maxPlayers.default);
	}
};
