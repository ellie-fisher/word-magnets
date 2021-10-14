import RoomPhase from "./RoomPhase";
import RoomPhaseType from "./RoomPhaseType";
import RoomInfo from "../RoomInfo";
import RoomClients from "../RoomClients";
import RoomWordbanks from "../RoomWordbanks";

import Client from "../../clients/Client";
import Packet from "../../packets/Packet";
import PacketCommand from "../../packets/PacketCommand";

import shuffle from "../../../../common/src/util/shuffle";


class VotePhase extends RoomPhase
{
	constructor ( info: RoomInfo, clients: RoomClients, wordbanks: RoomWordbanks )
	{
		super (info, clients, wordbanks);
		this._type = RoomPhaseType.Vote;
	}

	async _onPreStart ()
	{
		const clients = this._clients.assignVoteIDs ();
		const sentences = [];

		const { length } = clients;

		for ( let i = 0; i < length; i++ )
		{
			const sentence = clients[i].sentence.value;

			if ( sentence !== "" )
			{
				sentences.push ([i, sentence]);
			}
		}

		this._clients.forEach (client =>
		{
			// Send all sentences but the player's own.
			client.packets.sendDataPacket (
				client.socket,
				PacketCommand.SentenceList,
				sentences.filter (sentence => sentence[0] !== client.voteID),
			);
		});
	}

	receivePacket ( packet: Packet, client: Client )
	{
		// TODO:
		// If packet.command is `CastVote`:
		//     If player has already cast a vote:
		//         Send reject packet
		//     Else:
		//         Validate vote
		//         If valid vote:
		//             Set client's vote
		//             Send accept packet
		//         Else:
		//             Send reject packet
		// Else:
		//     Send reject packet
	}

	async _onEnd ()
	{
		// Wait 5 seconds
		// Tally up votes
		// Send new player scores to all players in the room
		// Let room know somehow that we're done
	}

	_tick ()
	{
		// If timer is 0:
		//     Stop timer
		//     Let room know somehow
		// Else:
		//     Decrement timer by 1
		//     Let room know somehow
		//     Call this function again in 1 second
	}
}


export default VotePhase;
