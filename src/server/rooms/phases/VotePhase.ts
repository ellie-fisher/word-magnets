import Client from "../../clients/Client";
import Packet from "../../../common/packets/Packet";
import PacketCommand from "../../../common/packets/PacketCommand";

import RoomPhase from "./RoomPhase";

import IRoom from "../IRoom";
import RoomInfo from "../RoomInfo";
import RoomClients from "../RoomClients";
import RoomWordbanks from "../RoomWordbanks";

import RoomPhaseType from "../../../common/rooms/phases/RoomPhaseType";

import Sentence from "../../../common/wordbanks/Sentence";


const VOTE_START_TIME = 20;
const VOTE_ON_END_WAIT = 5000;

class VotePhase extends RoomPhase
{
	constructor ( room: IRoom )
	{
		super (room);

		this._type = RoomPhaseType.Vote;
		this.startTime = VOTE_START_TIME;
	}

	async _onPreStart ()
	{
		super._onPreStart ();

		this._room.sentences.assignVoteIDs ();

		// Send all sentences but the player's own.
		this._room.clients.forEach (this.sendData.bind (this));
	}

	sendData ( recipient: Client )
	{
		super.sendData (recipient);
		recipient.packets.sendDataPacket (PacketCommand.SentenceList, this.createSentenceList (recipient));
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
		const { sentences } = this._room;

		if ( !sentences.isValidVoteID (vote) )
		{
			client.packets.sendRejectPacket (packet, "Invalid vote ID.");
			return;
		}

		if ( sentences.testVoteID (vote, client.id) )
		{
			client.packets.sendRejectPacket (packet, "You cannot vote for your own sentence.");
			return;
		}

		client.vote = vote;
		client.packets.sendAcceptPacket (packet);
	}

	createSentenceList ( recipient: Client ): Sentence[]
	{
		const packetSentences: Sentence[] = [];
		const { sentences } = this._room;

		this._room.clients.forEach (( sentenceClient: Client ) =>
		{
			if ( recipient !== sentenceClient && sentences.hasSentence (sentenceClient.id) )
			{
				const sentence = sentences.getSentence (sentenceClient.id);

				packetSentences.push ({ value: sentence.value, voteID: sentence.voteID });
			}
		});

		return packetSentences;
	}

	tallyVotes ()
	{
		const { sentences, clients } = this._room;

		clients.forEach (( client: Client ) =>
		{
			const { vote } = client;

			if ( sentences.isValidVoteID (vote) && !sentences.testVoteID (vote, client.id) )
			{
				const voteClientID = sentences.getClientID (vote);
				const sentence = sentences.getSentence (voteClientID);

				if ( clients.hasClient (voteClientID) )
				{
					clients.getClient (voteClientID).score++;
				}

				if ( sentence !== null )
				{
					sentence.votes++;
				}
			}
		});
	}

	async _onEnd ( onEnd: Function )
	{
		super._onEnd (onEnd);

		setTimeout (() =>
		{
			this.tallyVotes ();
			this._room.clients.sendClientList ();  // Send updated scores.
			onEnd ();
		}, VOTE_ON_END_WAIT);
	}
}


export default VotePhase;
