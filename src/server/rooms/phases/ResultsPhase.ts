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


class ResultsPhase extends RoomPhase
{
	constructor ( room: IRoom )
	{
		super (room);
		this._type = RoomPhaseType.Results;
	}

	async _onPreStart ()
	{
		super._onPreStart ();
		this._room.clients.forEach (this.sendData.bind (this));
	}

	sendData ( recipient: Client )
	{
		super.sendData (recipient);
		recipient.packets.sendDataPacket (PacketCommand.SentenceScores, this.createResults ());
	}

	receivePacket ( packet: Packet, client: Client )
	{
		client.packets.sendRejectPacket (packet, "You cannot use that command right now.");
	}

	createResults ()
	{
		const sentences = {};
		const nameCache = {};

		const room = this._room;

		room.sentences.forEach (( sentence: Sentence, clientID: string ) =>
		{
			sentences[clientID] = sentence;
			nameCache[clientID] = room.clients.getCachedName (clientID);
		});

		return { sentences, nameCache };
	}

	async _onEnd ()
	{
		super._onEnd ();
		this._onEndCallback ();
	}
}


export default ResultsPhase;
