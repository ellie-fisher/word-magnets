import { PacketType } from "./PacketType";

import { AnyObject } from "./../util";
import { PacketConverter, RawPacket } from "./types";

import { ClientID } from "./ClientID";
import { CreateRoom } from "./CreateRoom";
import { JoinRoom } from "./JoinRoom";
import { SubmitSentence } from "./SubmitSentence";
import { SubmitVote } from "./SubmitVote";
import { RemoveClient } from "./RemoveClient";
import { CreateRoomRejected } from "./CreateRoomRejected";
import { JoinRoomRejected } from "./JoinRoomRejected";

const SimplePacket = (type: PacketType) =>
({
	fromArray: (_: RawPacket): AnyObject => ({}),
	toArray: (_: AnyObject): RawPacket => [type],
});

const typeToField = new Map<PacketType, PacketConverter>(
[
	[PacketType.Invalid, SimplePacket(PacketType.Invalid)],
	[PacketType.ClientID, ClientID],
	[PacketType.CreateRoom, CreateRoom],
	[PacketType.JoinRoom, JoinRoom],
	[PacketType.LeaveRoom, SimplePacket(PacketType.LeaveRoom)],
	[PacketType.DestroyRoom, SimplePacket(PacketType.DestroyRoom)],
	[PacketType.StartGame, SimplePacket(PacketType.StartGame)],
	[PacketType.SubmitSentence, SubmitSentence],
	[PacketType.SubmitVote, SubmitVote],
	[PacketType.RemoveClient, RemoveClient],
	[PacketType.CreateRoomRejected, CreateRoomRejected],
	[PacketType.JoinRoomRejected, JoinRoomRejected],
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
