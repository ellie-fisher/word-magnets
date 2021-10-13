import Client from "../../clients/Client";
import Packet from "../../packets/Packet";
import PacketCommand from "../../packets/PacketCommand";

import RoomPhaseType from "./RoomPhaseType";
import RoomInfo from "../RoomInfo";
import RoomClients from "../RoomClients";
import RoomWordbanks from "../RoomWordbanks";


class RoomPhase
{
	public startTime: number;

	protected _type: RoomPhaseType;
	protected _timeLeft: number;
	protected _timeout;

	constructor ()
	{
		this.startTime = 0;
		this._timeLeft = 0;
		this._timeout = -1;
	}

	async start ( info: RoomInfo, clients: RoomClients, wordbanks: RoomWordbanks, onEnd: Function )
	{
		await this._onPreStart (info, clients, wordbanks);

		clients.sendDataPacket (PacketCommand.StartPhase, this._type);

		this._timeLeft = this.startTime;
		this._tick (info, clients, wordbanks, onEnd);
	}

	protected _tick ( info: RoomInfo, clients: RoomClients, wordbanks: RoomWordbanks, onEnd: Function )
	{
		clients.sendDataPacket (PacketCommand.RoomInfo, { timeLeft: this._timeLeft });

		if ( this._timeLeft <= 0 )
		{
			this._onEnd (info, clients, wordbanks, onEnd);
		}
		else
		{
			this._timeLeft--;
			this._timeout = setTimeout (() => this._tick (info, clients, wordbanks, onEnd), 1000);
		}
	}

	protected async _onEnd ( info: RoomInfo, clients: RoomClients, wordbanks: RoomWordbanks, onEnd: Function )
	{
		clients.sendDataPacket (PacketCommand.EndPhase, this._type);
	}

	get type (): RoomPhaseType
	{
		return this._type;
	}

	receivePacket ( packet: Packet, client: Client ) {}

	protected async _onPreStart ( info: RoomInfo, clients: RoomClients, wordbanks: RoomWordbanks ) {}
}


export default RoomPhase;
