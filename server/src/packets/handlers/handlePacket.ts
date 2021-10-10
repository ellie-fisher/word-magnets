import Client from "../../clients/Client";
import Packet from "../Packet";

import handleMenuPacket from "./handleMenuPacket";


const handlePacket = ( packet: Packet, client: Client ) =>
{
	if ( client.roomID === "" )
	{
		handleMenuPacket (packet, client);
	}
}


export default handlePacket;

