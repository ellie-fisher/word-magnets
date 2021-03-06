import Client from "../clients/Client";

import Packet from "../../common/packets/Packet";
import PacketType from "../../common/packets/PacketType";
import PacketCommand from "../../common/packets/PacketCommand";
import PacketHandler from "../../common/packets/PacketHandler";

import createRoomHandler from "./handlers/CreateRoom";
import joinRoomHandler from "./handlers/JoinRoom";
import leaveRoomHandler from "./handlers/LeaveRoom";
import kickClientHandler from "./handlers/KickClient";
import phaseSpecificHandler from "./handlers/PhaseSpecific";


const handlers =
[
	[PacketType.Request, PacketCommand.CreateRoom, createRoomHandler],
	[PacketType.Request, PacketCommand.JoinRoom, joinRoomHandler],
	[PacketType.Data, PacketCommand.LeaveRoom, leaveRoomHandler],
	[PacketType.Request, PacketCommand.KickClient, kickClientHandler],
	[PacketType.Request, PacketCommand.StartGame, phaseSpecificHandler],
	[PacketType.Request, PacketCommand.SendSentence, phaseSpecificHandler],
	[PacketType.Request, PacketCommand.CastVote, phaseSpecificHandler],
];

/**
 * @private
 */
const _fallbackHandler = ( packet: Packet, client: Client ) =>
{
	client.packets.sendRejectPacket (packet, "Unknown packet command");
};

const registerHandlers = ( client: Client ) =>
{
	client.packets.setFallbackHandler (_fallbackHandler);

	handlers.forEach (([ type, command, handler ]) =>
	{
		client.packets.on (type as PacketType, command as PacketCommand, handler as PacketHandler);
	});
};


export default registerHandlers;
