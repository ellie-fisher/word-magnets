import { PacketType } from "./PacketType";

import { AnyObject, getArrayValue, getObjectValue } from "./../util";
import { PacketConverter, RawPacket } from "./types";

import { CreateRoom } from "./CreateRoom";
import { SubmitSentence } from "./SubmitSentence";

export const DEFAULT_CREATE_ROOM_ERROR = "Could not create room.";
export const DEFAULT_JOIN_ROOM_ERROR = "Could not join room.";

/**
 * Overengineered function for creating packet converters that have simple structures.
 */
const SimplePacket = (type: PacketType, ...keyDefaultValuePairs: [string, any][]): [PacketType, PacketConverter] =>
{
	const { length } = keyDefaultValuePairs;

	return [
		type,
		length <= 0
			? {
				fromArray: (_: RawPacket): AnyObject => ({}),
				toArray: (_: AnyObject): RawPacket => [type],
			}
			: {
				fromArray: (raw: RawPacket): AnyObject =>
				{
					const packet: AnyObject = {};

					for (let i = 0; i < length; i++)
					{
						packet[keyDefaultValuePairs[i][0]] = getArrayValue(raw, i + 1, keyDefaultValuePairs[i][1]);
					}

					return packet;
				},

				toArray: (packet: AnyObject): RawPacket =>
				{
					const raw: RawPacket = [type];

					for (let i = 0; i < length; i++)
					{
						raw.push(getObjectValue(packet, keyDefaultValuePairs[i][0], keyDefaultValuePairs[i][1]));
					}

					return raw;
				},
			},
	];
};

// Wrapper function just to have consistency.
const AdvancedPacket = (type: PacketType, converter: PacketConverter): [PacketType, PacketConverter] => [type, converter];

const typeToField = new Map<PacketType, PacketConverter>(
[
	SimplePacket(PacketType.Invalid),
	SimplePacket(PacketType.ClientID, ["id", ""]),
	SimplePacket(PacketType.JoinRoom, ["id", ""], ["name", ""]),
	SimplePacket(PacketType.LeaveRoom),
	SimplePacket(PacketType.DestroyRoom),
	SimplePacket(PacketType.StartGame),
	SimplePacket(PacketType.SubmitVote, ["id", ""]),
	SimplePacket(PacketType.RemoveClient, ["id", ""]),
	SimplePacket(PacketType.CreateRoomRejected, ["message", DEFAULT_CREATE_ROOM_ERROR]),
	SimplePacket(PacketType.JoinRoomRejected, ["message", DEFAULT_JOIN_ROOM_ERROR]),
	SimplePacket(PacketType.ClientJoin, ["id", ""]),
	SimplePacket(PacketType.ClientLeave, ["id", ""]),

	AdvancedPacket(PacketType.CreateRoom, CreateRoom),
	AdvancedPacket(PacketType.SubmitSentence, SubmitSentence),
]);

export const Packet =
{
	fromArray(packet: RawPacket): AnyObject | null
	{
		return packet.length > 0 ? typeToField.get(packet[0])?.fromArray(packet) ?? null : null;
	},

	toArray(type: PacketType, object: AnyObject): RawPacket | null
	{
		return typeToField.get(type)?.toArray(object) ?? null;
	},
};
