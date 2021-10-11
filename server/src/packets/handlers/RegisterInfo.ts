import Packet from "../../packets/Packet";
import Client from "../../clients/Client";
import ClientNames from "../../clients/ClientNames";

import validateFields from "../../validation/validateFields";
import clientInfoFields from "../../validation/fields/clientInfo";


const registerInfoHandler = ( packet: Packet, client: Client ) =>
{
	if ( client.roomID !== "" )
	{
		client.packets.sendRejectPacket (client.socket, packet, "You cannot change your info while in a room.");
		return;
	}

	const validation = validateFields (packet.body, clientInfoFields);

	if ( validation.length > 0 )
	{
		client.packets.sendRejectPacket (client.socket, packet, validation);
		return;
	}

	if ( ClientNames.isDuplicateName (packet.body.name, client) )
	{
		client.packets.sendRejectPacket (client.socket, packet, "A player with that name already exists.");
		return;
	}

	if ( packet.body.name !== client.info.name )
	{
		const prevName = client.info.name;

		client.info.name = packet.body.name;

		ClientNames.addClient (client);
		ClientNames.delete (prevName);
	}

	client.packets.sendAcceptPacket (client.socket, packet);
};


export default registerInfoHandler;
