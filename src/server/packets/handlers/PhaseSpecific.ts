import Packet from "../../../common/packets/Packet";
import PacketHandler from "../../../common/packets/PacketHandler";

import Client from "../../clients/Client";

import RoomManager from "../../rooms/RoomManager";

import { ValidationData } from "../../../common/validation/types";


// For phase-specific commands like `SendSentence`, `CastVote`, etc.
const phaseSpecificHandler = new PacketHandler (
{
	handler ( packet: Packet, client: Client )
	{
		if ( !client.isInRoom () )
		{
			client.packets.sendRejectPacket (packet, "You are not in a room.");
			return;
		}

		const room = RoomManager.get (client.roomID);

		if ( room === null )
		{
			throw new Error (`Client's room \`${client.roomID}\` does not exist!`);
		}

		room.receivePacket (packet, client);
	},
});


export default phaseSpecificHandler;
