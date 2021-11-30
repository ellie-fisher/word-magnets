import Packet from "../../../common/packets/Packet";
import Client from "../../clients/Client";
import ClientNames from "../../clients/ClientNames";

import validateFields from "../../validation/validateFields";
import clientInfoFields from "../../../common/validation/fields/clientInfo";


// TODO: Filter names.
// TODO: Remove repeat and trailing spaces from names.
// TODO: Add checks for invalid characters.
// TODO: Add checks for similar-looking characters to prevent impersonation.
const registerInfoHandler = ( packet: Packet, client: Client ) =>
{
	if ( client.roomID !== "" )
	{
		client.packets.sendRejectPacket (packet, "You cannot change your info while in a room.");
		return;
	}

	const validation = validateFields (packet.body, clientInfoFields);

	if ( validation.length > 0 )
	{
		client.packets.sendRejectPacket (packet, validation);
		return;
	}

	if ( ClientNames.isDuplicateName (packet.body.name, client) )
	{
		client.packets.sendRejectPacket (packet, "A player with that name already exists.");
		return;
	}

	if ( packet.body.name !== client.info.name )
	{
		const prevName = client.info.name;

		client.info.name = packet.body.name;

		ClientNames.addClient (client);
		ClientNames.delete (prevName);
	}

	client.packets.sendAcceptPacket (packet, client.id);
};


export default registerInfoHandler;
