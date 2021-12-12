import RoomModel from "./RoomModel";

import PacketCommand from "../../common/packets/PacketCommand";
import packetManager from "../packets/packetManager";

import has from "../../common/util/has";


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

	hasClient ( clientID ): boolean
	{
		return has (RoomModel.clients, clientID);
	},

	getClient ( clientID )
	{
		return this.hasClient (clientID) ? RoomModel.clients[clientID] : null;
	},

	getClientName ( clientID ): string
	{
		const client = this.getClient (clientID);

		return (client === null ? "" : client.name);
	},
};


export default RoomController;
