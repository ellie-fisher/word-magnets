import AppModel from "../app/AppModel";
import RoomModel from "./RoomModel";

import ViewEnum from "../app/ViewEnum";

import PacketCommand from "../../common/packets/PacketCommand";
import packetManager from "../packets/packetManager";

import IRoomInfo from "../../common/rooms/IRoomInfo";
import RoomPhaseType from "../../common/rooms/phases/RoomPhaseType";
import RoomPhaseState from "../../common/rooms/phases/RoomPhaseState";

import has from "../../common/util/has";


const RoomController =
{
	resetToDefaults ()
	{
		RoomModel.info = {} as IRoomInfo;
		RoomModel.phaseType = RoomPhaseType.Create;
		RoomModel.phaseState = RoomPhaseState.Ready;
		RoomModel.clients = {};
	},

	addClient ( clientData )
	{
		RoomModel.clients[clientData.id] = { ...clientData };
	},

	removeClient ( clientID: string )
	{
		delete RoomModel.clients[clientID];
	},

	clearClients ()
	{
		RoomModel.clients = {};
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

	leaveRoom ()
	{
		this.resetToDefaults ();
		AppModel.view = ViewEnum.MainMenu;
		packetManager.sendDataPacket (PacketCommand.LeaveRoom);
	},
};


export default RoomController;
