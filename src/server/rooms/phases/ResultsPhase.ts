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

	createResults (): object
	{
		const scores = {};
		const nameCache = {};

		const { clients, sentences } = this._room;

		sentences.forEach (( sentence: Sentence, clientID: string ) =>
		{
			scores[clientID] = sentence;
			nameCache[clientID] = clients.getCachedName (clientID);
		});

		return { scores, nameCache };
	}

	async _onEnd ( onEnd: Function )
	{
		super._onEnd (onEnd);
		this._room.clients.sendClientList ();
		onEnd ();
	}
}


export default ResultsPhase;
