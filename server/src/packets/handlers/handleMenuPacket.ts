import Client from "../../clients/Client";

import Packet from "../Packet";
import PacketType from "../PacketType";
import PacketCommand from "../PacketCommand";

import registerInfoHandler from "./menu/RegisterInfo";


const handleMenuPacket = ( packet: Packet, client: Client ) =>
{
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


export default handleMenuPacket;
