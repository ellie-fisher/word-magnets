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

		// Send all sentences but the player's own.
		this._clients.forEach (recipient =>
		{
			const sentences = [];

			clients.forEach (( sentenceClient, voteID ) =>
			{
				if ( recipient !== sentenceClient && sentenceClient.sentence.value !== "" )
				{
					sentences.push ([sentenceClient.sentence.value, voteID]);
				}
			});

			recipient.packets.sendDataPacket (recipient.socket, PacketCommand.SentenceList, sentences);
		});
	}

	receivePacket ( packet: Packet, client: Client )
	{
		if ( packet.command !== PacketCommand.CastVote )
		{
			client.packets.sendRejectPacket (client.socket, packet, "You cannot use that command right now.");
			return;
		}

		if ( client.vote >= 0 )
		{
			client.packets.sendRejectPacket (client.socket, packet, "You already cast a vote.");
			return;
		}

		const voteID = packet.body;

		if ( !this._clients.isValidVoteID (voteID) )
		{
			client.packets.sendRejectPacket (client.socket, packet, "Invalid vote ID.");
			return;
		}

		if ( this._clients.getVoteClient (voteID) === client )
		{
			client.packets.sendRejectPacket (client.socket, packet, "You cannot vote for your own sentence.");
			return;
		}

		client.vote = voteID;
		client.packets.sendAcceptPacket (client.socket, packet);
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
