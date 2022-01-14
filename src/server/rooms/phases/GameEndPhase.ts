import Client from "../../clients/Client";
import Packet from "../../../common/packets/Packet";
import PacketCommand from "../../../common/packets/PacketCommand";

import RoomPhase from "./RoomPhase";

import IRoom from "../IRoom";
import RoomInfo from "../RoomInfo";
import RoomClients from "../RoomClients";
import RoomWordbanks from "../RoomWordbanks";

import RoomPhaseType from "../../../common/rooms/phases/RoomPhaseType";


const GAME_END_START_TIME = 20;

class GameEndPhase extends RoomPhase
{
	constructor ( room: IRoom )
	{
		super (room);

		this._type = RoomPhaseType.GameEnd;
		this.startTime = GAME_END_START_TIME;
	}

	async _onPreStart ()
	{
		super._onPreStart ();
		this._room.clients.forEach (this.sendData.bind (this));
	}

	sendData ( recipient: Client )
	{
		super.sendData (recipient);
		recipient.packets.sendDataPacket (PacketCommand.FinalScores, this.createFinalResults ());
	}

	receivePacket ( packet: Packet, client: Client )
	{
		client.packets.sendRejectPacket (packet, "You cannot use that command right now.");
	}

	createFinalResults ()
	{
		return this._room.clients.getAllCachedData ();
	}

	async _onEnd ()
	{
		super._onEnd ();
		this._onEndCallback ();
	}
}


export default GameEndPhase;
