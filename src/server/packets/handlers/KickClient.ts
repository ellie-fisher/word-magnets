import Packet from "../../../common/packets/Packet";
import PacketHandler from "../../../common/packets/PacketHandler";

import Client from "../../clients/Client";
import ClientManager from "../../clients/ClientManager";

import RoomManager from "../../rooms/RoomManager";
import RoomError, { getRoomErrorMessage } from "../../rooms/RoomError";

import { ValidationData } from "../../../common/validation/types";


const kickClientHandler = new PacketHandler (
{
	handler ( packet: Packet, client: Client )
	{
		const target = ClientManager.get (packet.body);

		if ( target === null )
		{
			client.packets.sendRejectPacket (packet, "Player does not exist.");
			return;
		}

		const error: RoomError = RoomManager.kick (client, target);

		if ( error === RoomError.Ok )
		{
			client.packets.sendAcceptPacket (packet);
		}
		else
		{
			client.packets.sendRejectPacket (packet, getRoomErrorMessage (error));
		}
	},
});


export default kickClientHandler;
