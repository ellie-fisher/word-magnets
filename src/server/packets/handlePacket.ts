import Client from "../clients/Client";

import Packet from "./Packet";
import PacketType from "./PacketType";
import PacketCommand from "./PacketCommand";

import registerInfoHandler from "./handlers/RegisterInfo";
import createRoomHandler from "./handlers/CreateRoom";
import joinRoomHandler from "./handlers/JoinRoom";
import leaveRoomHandler from "./handlers/LeaveRoom";
import phaseSpecificHandler from "./handlers/PhaseSpecific";


const handlePacket = ( packet: Packet, client: Client ) =>
{
	if ( client.info.name === "" && packet.command !== PacketCommand.RegisterInfo )
	{
		client.packets.sendRejectPacket (client.socket, packet, "Please set your name first.");
		return;
	}

	switch ( packet.command )
	{
		case PacketCommand.RegisterInfo:
		{
			registerInfoHandler (packet, client);
			break;
		}

		case PacketCommand.CreateRoom:
		{
			createRoomHandler (packet, client);
			break;
		}

		case PacketCommand.JoinRoom:
		{
			joinRoomHandler (packet, client);
			break;
		}

		case PacketCommand.LeaveRoom:
		{
			leaveRoomHandler (packet, client);
			break;
		}

		case PacketCommand.SendSentence:
		case PacketCommand.CastVote:
		{
			phaseSpecificHandler (packet, client);
			break;
		}

		default:
		{
			client.packets.sendRejectPacket (client.socket, packet, "Unknown packet command");
			break;
		}
	}
};


export default handlePacket;
