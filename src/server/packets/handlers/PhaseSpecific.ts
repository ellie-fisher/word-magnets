import Packet from "../../../common/packets/Packet";
import Client from "../../clients/Client";

import RoomManager from "../../rooms/RoomManager";


// For phase-specific commands like `SendSentence`, `CastVote`, etc.
const phaseSpecificHandler = ( packet: Packet, client: Client ) =>
{
	if ( client.roomID === "" )
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
};


export default phaseSpecificHandler;
