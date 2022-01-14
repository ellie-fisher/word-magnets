import Client from "../../clients/Client";
import Packet from "../../../common/packets/Packet";
import PacketCommand from "../../../common/packets/PacketCommand";

import RoomPhase from "./RoomPhase";
import IRoom from "../IRoom";

import RoomPhaseType from "../../../common/rooms/phases/RoomPhaseType";


class LobbyPhase extends RoomPhase
{
	constructor ( room: IRoom )
	{
		super (room);

		this._type = RoomPhaseType.Lobby;
		this.startTime = 0;
	}

	async _onPreStart ()
	{
		super._onPreStart ();
	}

	sendData ( recipient: Client )
	{
		super.sendData (recipient);
	}

	receivePacket ( packet: Packet, client: Client )
	{
		if ( packet.command !== PacketCommand.StartGame )
		{
			client.packets.sendRejectPacket (packet, "You cannot use that command right now.");
		}
		else if ( this._room.clients.isOwner (client) )
		{
			this._onEnd ();
		}
		else
		{
			client.packets.sendRejectPacket (packet, "Only the room owner can start the game.");
		}
	}

	async _onEnd ()
	{
		super._onEnd ();
		this._onEndCallback ();
	}
}


export default LobbyPhase;
