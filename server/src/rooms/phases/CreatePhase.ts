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
		await this._wordbanks.fetchWords ();

		// TODO: Filter words
		this._clients.sendDataPacket (PacketCommand.Wordbanks, this._wordbanks.toJSON ());
	}

	receivePacket ( packet: Packet, client: Client )
	{
		// TODO:
		// If packet.command is `SendSentence`:
		//     If player has already sent a sentence:
		//         Send reject packet
		//     Else:
		//         Validate sentence
		//         If valid sentence:
		//             Set client's sentence
		//             Send accept packet
		//         Else:
		//             Send reject packet
		// Else:
		//     Send reject packet
	}

	async _onEnd ( onEnd: Function )
	{
		super._onEnd (onEnd);
		setTimeout (onEnd, ON_END_WAIT_TIME);
	}
}


export default CreatePhase;

export { ON_END_WAIT_TIME };
