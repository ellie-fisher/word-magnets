import RoomPhase from "./RoomPhase";
import RoomPhaseType from "./RoomPhaseType";
import RoomInfo from "../RoomInfo";
import RoomClients from "../RoomClients";
import RoomWordbanks from "../RoomWordbanks";

import Client from "../../clients/Client";
import Packet from "../../packets/Packet";
import PacketCommand from "../../packets/PacketCommand";


const ON_END_WAIT_TIME = 5000;

class CreatePhase extends RoomPhase
{
	constructor ( info: RoomInfo, clients: RoomClients, wordbanks: RoomWordbanks )
	{
		super (info, clients, wordbanks);
		this.startTime = info.timeLimit;
		this._type = RoomPhaseType.Create;
	}

	async _onPreStart ()
	{
		this._clients.forEach (client =>
		{
			client.clearSentence ();
		});

		await this._wordbanks.fetchWords ();

		// TODO: Filter words
		this._clients.sendDataPacket (PacketCommand.Wordbanks, this._wordbanks.toJSON ());
	}

	receivePacket ( packet: Packet, client: Client )
	{
		if ( packet.command !== PacketCommand.SendSentence )
		{
			client.packets.sendRejectPacket (client.socket, packet, "You cannot use that command right now.");
			return;
		}

		if ( client.sentence.value.length > 0 )
		{
			client.packets.sendRejectPacket (client.socket, packet, "You already sent a sentence.");
			return;
		}

		const validation = this._wordbanks.validateSentence (packet.body, this._clients);

		if ( !validation[0] )
		{
			client.packets.sendRejectPacket (client.socket, packet, validation[1]);
			return;
		}

		client.sentence = { value: validation[1], votes: 0 };
		client.packets.sendAcceptPacket (client.socket, packet, validation[1]);
	}

	async _onEnd ( onEnd: Function )
	{
		super._onEnd (onEnd);
		setTimeout (onEnd, ON_END_WAIT_TIME);
	}
}


export default CreatePhase;

export { ON_END_WAIT_TIME };
