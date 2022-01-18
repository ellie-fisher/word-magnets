import Packet from "../../../common/packets/Packet";
import PacketHandler from "../../../common/packets/PacketHandler";

import Client from "../../clients/Client";

import RoomManager from "../../rooms/RoomManager";
import RoomError, { getRoomErrorMessage } from "../../rooms/RoomError";

import { ValidationData } from "../../../common/validation/types";


const leaveRoomHandler = new PacketHandler (
{
	handler ( packet: Packet, client: Client )
	{
		RoomManager.leaveRoom (client);
	},
});


export default leaveRoomHandler;
