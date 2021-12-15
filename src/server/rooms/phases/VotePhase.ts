import RoomPhase from "./RoomPhase";
import RoomPhaseType from "../../../common/rooms/phases/RoomPhaseType";
import RoomInfo from "../RoomInfo";
import RoomClients from "../RoomClients";
import RoomWordbanks from "../RoomWordbanks";

import Client from "../../clients/Client";
import Packet from "../../../common/packets/Packet";
import PacketCommand from "../../../common/packets/PacketCommand";

import Sentence from "../../../common/wordbanks/Sentence";


const VOTE_START_TIME = 20;
const VOTE_ON_END_WAIT = 5000;

class VotePhase extends RoomPhase
{
	constructor ( info: RoomInfo, clients: RoomClients, wordbanks: RoomWordbanks )
	{
		super (info, clients, wordbanks);

		this._type = RoomPhaseType.Vote;
		this.startTime = VOTE_START_TIME;
	}

	async _onPreStart ()
	{
		super._onPreStart ();

		this._clients.assignVoteIDs ();

		// Send all sentences but the player's own.
		this._clients.forEach (this.sendData.bind (this));
	}

	sendData ( recipient: Client )
	{
		super.sendData (recipient);

		const sentences: Sentence[] = [];

		this._clients.forEach (( sentenceClient: Client ) =>
		{
			if ( recipient !== sentenceClient && sentenceClient.hasVoteID () )
			{
				const { sentence } = sentenceClient;

				sentences.push ({ value: sentence.value, voteID: sentence.voteID });
			}
		});

		recipient.packets.sendDataPacket (PacketCommand.SentenceList, sentences);
	}

	receivePacket ( packet: Packet, client: Client )
	{
		if ( packet.command !== PacketCommand.CastVote )
		{
			client.packets.sendRejectPacket (packet, "You cannot use that command right now.");
			return;
		}

		if ( client.vote >= 0 )
		{
			client.packets.sendRejectPacket (packet, "You already cast a vote.");
			return;
		}

		const vote = packet.body;

		if ( !this._clients.hasVoteID (vote) )
		{
			client.packets.sendRejectPacket (packet, "Invalid vote ID.");
			return;
		}

		if ( this._clients.getVoteClient (vote) === client )
		{
			client.packets.sendRejectPacket (packet, "You cannot vote for your own sentence.");
			return;
		}

		client.vote = vote;
		client.packets.sendAcceptPacket (packet);
	}

	async _onEnd ( onEnd: Function )
	{
		super._onEnd (onEnd);

		setTimeout (() =>
		{
			// Tally up the votes.
			this._clients.forEach (( client: Client ) =>
			{
				const { vote } = client;

				if ( this._clients.hasVoteID (vote) && this._clients.getVoteClient (vote) !== client )
				{
					const voteClient = this._clients.getVoteClient (vote);

					voteClient.sentence.votes++;
					voteClient.score++;
				}
			});

			onEnd ();
		}, VOTE_ON_END_WAIT);
	}
}


export default VotePhase;
