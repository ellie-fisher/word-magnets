import RoomPhase from "./RoomPhase";
import RoomPhaseType from "../../../common/rooms/phases/RoomPhaseType";
import RoomInfo from "../RoomInfo";
import RoomClients from "../RoomClients";
import RoomWordbanks from "../RoomWordbanks";

import Client from "../../clients/Client";
import Packet from "../../../common/packets/Packet";
import PacketCommand from "../../../common/packets/PacketCommand";


const GAME_END_START_TIME = 20;

class GameEndPhase extends RoomPhase
{
	constructor ( info: RoomInfo, clients: RoomClients, wordbanks: RoomWordbanks )
	{
		super (info, clients, wordbanks);

		this._type = RoomPhaseType.GameEnd;
		this.startTime = GAME_END_START_TIME;
	}

	receivePacket ( packet: Packet, client: Client )
	{
		client.packets.sendRejectPacket (packet, "You cannot use that command right now.");
	}

	async _onEnd ( onEnd: Function )
	{
		super._onEnd (onEnd);

		this._info.currentRound = 0;
		this._clients.onNewGame ();

		onEnd ();
	}
}


export default GameEndPhase;
