import Client from "../clients/Client";

import Packet from "./Packet";
import PacketType from "./PacketType";
import PacketCommand from "./PacketCommand";

import registerInfoHandler from "./handlers/RegisterInfo";


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

		default:
		{
			client.packets.sendRejectPacket (client.socket, packet, "Unknown packet command");
			break;
		}
	}
};


export default handlePacket;
