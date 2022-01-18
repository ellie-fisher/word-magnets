import AppModel from "../app/AppModel";
import JoinRoomModel from "./JoinRoomModel";

import PacketCommand from "../../common/packets/PacketCommand";
import packetManager from "../packets/packetManager";


const JoinRoomController =
{
	setToDefaults ()
	{
		JoinRoomModel.roomID = "";
		JoinRoomModel.error = "";
	},

	joinRoom ()
	{
		packetManager.sendRequestPacket (PacketCommand.JoinRoom,
		{
			roomID: JoinRoomModel.roomID,

			clientInfo:
			{
				name: AppModel.clientName,
			},
		});
	},
};


export default JoinRoomController;
