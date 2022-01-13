import Client from "../../clients/Client";
import Packet from "../../../common/packets/Packet";
import PacketCommand from "../../../common/packets/PacketCommand";

import RoomPhase from "./RoomPhase";

import IRoom from "../IRoom";
import RoomInfo from "../RoomInfo";
import RoomClients from "../RoomClients";
import RoomWordbanks from "../RoomWordbanks";

import RoomPhaseType from "../../../common/rooms/phases/RoomPhaseType";


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

		this._room.sentences.addSentence ({ value: validation[1], votes: 0 }, client);
		// FIXME: Remove `validation[1]` since it's just for debug purposes.
		client.packets.sendAcceptPacket (packet, validation[1]);
	}

	async _onEnd ( onEnd: Function )
	{
		super._onEnd (onEnd);
		setTimeout (onEnd, CREATE_ON_END_WAIT);
	}
}


export default CreatePhase;

export { CREATE_ON_END_WAIT };
