import { PacketType } from "./PacketType";
import { RoomFields } from "../fields/fields";
import { RawPacket } from "./types";
import { AnyObject, getArrayValue, getObjectValue } from "../util";

const { fields: roomFields } = RoomFields;

export const CreateRoom =
{
	fromArray(packet: RawPacket)
	{
		return {
			clientData:
			{
				name: getArrayValue(packet, 1, ""),
			},

			roomData:
			{
				timeLimit: getArrayValue(packet, 2, roomFields.timeLimit.default),
				maxRounds: getArrayValue(packet, 3, roomFields.maxRounds.default),
				maxPlayers: getArrayValue(packet, 4, roomFields.maxPlayers.default),
			},
		};
	},

	toArray(object: AnyObject): RawPacket
	{
		const { clientData = {}, roomData = {} } = object;

		return [
			PacketType.CreateRoom,
			getObjectValue(clientData, "name", ""),
			getObjectValue(roomData, "timeLimit", roomFields.timeLimit.default),
			getObjectValue(roomData, "maxRounds", roomFields.maxRounds.default),
			getObjectValue(roomData, "maxPlayers", roomFields.maxPlayers.default),
		];
	},
};
