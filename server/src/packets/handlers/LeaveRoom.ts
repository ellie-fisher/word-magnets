import Packet from "../../packets/Packet";
import Client from "../../clients/Client";

import RoomManager from "../../rooms/RoomManager";
import RoomError, { getRoomErrorMessage } from "../../rooms/RoomError";


const leaveRoomHandler = ( packet: Packet, client: Client ) =>
{
	RoomManager.leaveRoom (client);
};


export default leaveRoomHandler;
