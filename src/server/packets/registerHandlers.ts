import Client from "../clients/Client";

import Packet from "../../common/packets/Packet";
import PacketType from "../../common/packets/PacketType";
import PacketCommand from "../../common/packets/PacketCommand";

import registerInfoHandler from "./handlers/RegisterInfo";
import createRoomHandler from "./handlers/CreateRoom";
import joinRoomHandler from "./handlers/JoinRoom";
import leaveRoomHandler from "./handlers/LeaveRoom";
import phaseSpecificHandler from "./handlers/PhaseSpecific";


const handlers = new Map<PacketCommand, Function> (
[
	[PacketCommand.RegisterInfo, registerInfoHandler],
	[PacketCommand.CreateRoom, createRoomHandler],
	[PacketCommand.JoinRoom, joinRoomHandler],
	[PacketCommand.LeaveRoom, leaveRoomHandler],
	[PacketCommand.SendSentence, phaseSpecificHandler],
	[PacketCommand.CastVote, phaseSpecificHandler],
]);

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
	handlers.forEach (( handler, command ) => client.packets.on (command, handler));
};


export default registerHandlers;
