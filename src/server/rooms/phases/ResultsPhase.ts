import RoomPhase from "./RoomPhase";
import RoomPhaseType from "../../../common/rooms/phases/RoomPhaseType";
import RoomInfo from "../RoomInfo";
import RoomClients from "../RoomClients";
import RoomWordbanks from "../RoomWordbanks";

import Client from "../../clients/Client";
import Packet from "../../../common/packets/Packet";
import PacketCommand from "../../../common/packets/PacketCommand";


class ResultsPhase extends RoomPhase
{
	constructor ( info: RoomInfo, clients: RoomClients, wordbanks: RoomWordbanks )
	{
		super (info, clients, wordbanks);
		this._type = RoomPhaseType.Results;
	}

	async _onPreStart ()
	{
		const scores = {};

		this._clients.forEach (( client: Client ) =>
		{
			if ( client.voteID >= 0 )
			{
				scores[client.id] =
				{
					voteID: client.voteID,
					votes: client.sentence.votes,
					score: client.score,
				};
			}
		});

		this._clients.sendDataPacket (PacketCommand.SentenceScores, scores);
	}

	receivePacket ( packet: Packet, client: Client )
	{
		client.packets.sendRejectPacket (packet, "You cannot use that command right now.");
	}

	async _onEnd ( onEnd: Function )
	{
		super._onEnd (onEnd);  // Send `EndPhase` packet.

		if ( this._info.currentRound < this._info.maxRounds )
		{
			this._info.currentRound++;
		}

		onEnd ();
	}
}


export default ResultsPhase;
