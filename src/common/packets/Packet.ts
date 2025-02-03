import { PacketType } from "./PacketType";
import { PacketConverter, UnpackedPacket } from "./types";
import { AnyObject, getObjectValue } from "../util";
import { PacketBuffer, PacketField } from "./PacketBuffer";
import { RoomFields } from "../fields/fields";

import { CreateRoom } from "./CreateRoom";
import { SubmitSentence } from "./SubmitSentence";
import { RoomWords } from "./RoomWords";
import { RoomSentences } from "./RoomSentences";

export const DEFAULT_CREATE_ROOM_ERROR = "Could not create room.";
export const DEFAULT_JOIN_ROOM_ERROR = "Could not join room.";

const { fields: roomFields } = RoomFields;

/**
 * Overengineered function for creating packet converters that have simple structures.
 */
const SimpleConverter = (type: PacketType, ...fields: [string, string, PacketField][]): [PacketType, PacketConverter] =>
{
	const { length } = fields;

	return [
		type,
		length <= 0
			? {
				pack(): PacketBuffer { return PacketBuffer.from(type); },
				unpack(): UnpackedPacket { return { type }; },
			}
			: {
				pack(unpacked: UnpackedPacket): PacketBuffer
				{
					return PacketBuffer.from(type, ...fields.map(([, key, defaultValue]) => getObjectValue(unpacked.data ?? {}, key, defaultValue)));
				},

				unpack(buffer: PacketBuffer): UnpackedPacket
				{
					const unpacked: UnpackedPacket = { type: buffer.readU8(), data: {} };

					for (let i = 0; i < length; i++)
					{
						(unpacked.data as AnyObject)[fields[i][1]] = buffer.read(fields[i][0]);
					}

					return unpacked;
				},
			},
	];
};

// Wrapper function just to have consistency.
const AdvancedConverter = (type: PacketType, converter: PacketConverter): [PacketType, PacketConverter] => [type, converter];

const typeToConverter = new Map<PacketType, PacketConverter>(
[
	SimpleConverter(PacketType.Invalid),
	SimpleConverter(PacketType.ClientID, ["string", "id", ""]),
	SimpleConverter(PacketType.JoinRoom, ["string", "id", ""], ["string", "name", ""]),
	SimpleConverter(PacketType.LeaveRoom),
	SimpleConverter(PacketType.DestroyRoom),
	SimpleConverter(PacketType.StartGame),
	SimpleConverter(PacketType.SubmitVote, ["string", "id", ""]),
	SimpleConverter(PacketType.RemoveClient, ["string", "id", ""]),
	SimpleConverter(PacketType.CreateRoomRejected, ["string", "message", DEFAULT_CREATE_ROOM_ERROR]),
	SimpleConverter(PacketType.JoinRoomRejected, ["string", "message", DEFAULT_JOIN_ROOM_ERROR]),
	SimpleConverter(PacketType.ClientJoin, ["string", "id", ""]),
	SimpleConverter(PacketType.ClientLeave, ["string", "id", ""]),
	SimpleConverter(PacketType.RoomDestroyed),
	SimpleConverter(
		PacketType.RoomData,
		["number", "timeLeft", roomFields.timeLimit.default as number],
		["number", "timeLimit", roomFields.timeLimit.default as number],
		["number", "currentRound", 1],
		["number", "maxRounds", roomFields.maxRounds.default as number],
		["number", "maxPlayers", roomFields.maxPlayers.default as number],
	),

	AdvancedConverter(PacketType.CreateRoom, CreateRoom),
	AdvancedConverter(PacketType.SubmitSentence, SubmitSentence),
	AdvancedConverter(PacketType.RoomWords, RoomWords),
	AdvancedConverter(PacketType.RoomSentences, RoomSentences),
]);

export const Packet =
{
	pack(unpacked: UnpackedPacket): PacketBuffer | null
	{
		return typeToConverter.get(unpacked.type)?.pack(unpacked) ?? null;
	},

	unpack(buffer: PacketBuffer): UnpackedPacket | null
	{
		const unpacked = buffer.length > 0 ? typeToConverter.get(buffer.peekU8())?.unpack(buffer) ?? null : null;

		buffer.rewind();

		return unpacked;
	},
};
