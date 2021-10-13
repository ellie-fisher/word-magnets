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
	constructor ( startTime: number )
	{
		super ();
		this.startTime = startTime;
		this._type = RoomPhaseType.Create;
	}

	async _onPreStart ( info: RoomInfo, clients: RoomClients, wordbanks: RoomWordbanks )
	{
		await wordbanks.fetchWords ();

		// TODO: Filter words
		clients.sendDataPacket (PacketCommand.Wordbanks, wordbanks.toJSON ());
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

	async _onEnd ( info: RoomInfo, clients: RoomClients, wordbanks: RoomWordbanks, onEnd: Function )
	{
		super._onEnd (info, clients, wordbanks, onEnd);
		setTimeout (onEnd, ON_END_WAIT_TIME);
	}
}


export default CreatePhase;
