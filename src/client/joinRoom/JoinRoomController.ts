import JoinRoomModel from "./JoinRoomModel";

import PacketCommand from "../../common/packets/PacketCommand";
import packetManager from "../packets/packetManager";


const JoinRoomController =
{
	joinRoom ()
	{
		packetManager.sendRequestPacket (PacketCommand.JoinRoom, JoinRoomModel.roomID);
	},
};


export default JoinRoomController;
