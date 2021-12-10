import RoomModel from "./RoomModel";

import PacketCommand from "../../common/packets/PacketCommand";
import packetManager from "../packets/packetManager";


const RoomController =
{
	addClient ( clientData )
	{
		RoomModel.clients[clientData.id] = { ...clientData };
	},

	setClients ( clients: any[] )
	{
		clients.forEach (clientData =>
		{
			RoomModel.clients[clientData.id] = { ...clientData };
		});
	},
};


export default RoomController;
