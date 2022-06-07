import Client from "../../clients/Client";
import Packet from "../../../common/packets/Packet";
import PacketCommand from "../../../common/packets/PacketCommand";

import RoomPhase from "./RoomPhase";

import IRoom from "../IRoom";
import RoomInfo from "../RoomInfo";
import RoomClients from "../RoomClients";
import RoomWordbanks from "../RoomWordbanks";

import RoomPhaseType from "../../../common/rooms/phases/RoomPhaseType";

import slurFilter from "../../config/slurFilter";
import { applyFilter } from "../../../common/util/wordFilters";


const CREATE_ON_END_WAIT = 5000;

class CreatePhase extends RoomPhase
{
	constructor ( room: IRoom )
	{
		super (room);

		this.startTime = room.info.timeLimit;
		this._type = RoomPhaseType.Create;
	}

	async _onPreStart ()
	{
		super._onPreStart ();

		this._room.wordbanks.selectWords ();
		this._room.clients.forEach (this.sendData.bind (this));
	}

	sendData ( recipient: Client )
	{
		super.sendData (recipient);
		recipient.packets.sendDataPacket (PacketCommand.Wordbanks, this._room.wordbanks.toJSON ());
	}

	receivePacket ( packet: Packet, client: Client )
	{
		if ( packet.command !== PacketCommand.SendSentence )
		{
			client.packets.sendRejectPacket (packet, "You cannot use that command right now.");
			return;
		}

		if ( this._room.sentences.hasSentence (client.id) )
		{
			client.packets.sendRejectPacket (packet, "You already sent a sentence.");
			return;
		}

		const validation = this._room.wordbanks.validateSentence (packet.body, this._room.clients);

		if ( !validation[0] )
		{
			client.packets.sendRejectPacket (packet, validation[1]);
			return;
		}

		// FIXME: Slur filter temporarily disabled until I write new ones that don't hang the server.
		const sentence = applyFilter (validation[1] as string, []/*slurFilter*/);

		this._room.sentences.addSentence ({ value: sentence, votes: 0 }, client);
		// FIXME: Remove `sentence` since it's just for debug purposes.
		client.packets.sendAcceptPacket (packet, sentence);
	}

	async _onEnd ()
	{
		super._onEnd ();
		setTimeout (this._onEndCallback, CREATE_ON_END_WAIT);
	}
}


export default CreatePhase;

export { CREATE_ON_END_WAIT };
