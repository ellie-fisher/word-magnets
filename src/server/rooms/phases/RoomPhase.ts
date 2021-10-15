import Client from "../../clients/Client";
import Packet from "../../packets/Packet";
import PacketCommand from "../../packets/PacketCommand";

import RoomPhaseType from "./RoomPhaseType";
import RoomInfo from "../RoomInfo";
import RoomClients from "../RoomClients";
import RoomWordbanks from "../RoomWordbanks";


const DEFAULT_START_SEC = 10;

class RoomPhase
{
	public startTime: number;

	protected _type: RoomPhaseType;
	protected _timeLeft: number;
	protected _timeout;

	protected _info: RoomInfo;
	protected _clients: RoomClients;
	protected _wordbanks: RoomWordbanks;

	constructor ( info: RoomInfo, clients: RoomClients, wordbanks: RoomWordbanks )
	{
		this._info = info;
		this._clients = clients;
		this._wordbanks = wordbanks;

		this.startTime = DEFAULT_START_SEC;
		this._timeLeft = 0;
		this._timeout = -1;
	}

	async start ( onEnd: Function )
	{
		await this._onPreStart ();

		this._clients.sendDataPacket (PacketCommand.StartPhase, this._type);

		this._timeLeft = this.startTime;
		this._tick (onEnd);
	}

	protected _tick ( onEnd: Function )
	{
		this._clients.sendDataPacket (PacketCommand.RoomInfo, { timeLeft: this._timeLeft });

		if ( this._timeLeft <= 0 )
		{
			this._onEnd (onEnd);
		}
		else
		{
			this._timeLeft--;
			this._timeout = setTimeout (() => this._tick (onEnd), 1000);
		}
	}

	protected async _onEnd ( onEnd: Function )
	{
		this._clients.sendDataPacket (PacketCommand.EndPhase, this._type);
	}

	get type (): RoomPhaseType
	{
		return this._type;
	}

	receivePacket ( packet: Packet, client: Client ) {}

	protected async _onPreStart () {}
}


export default RoomPhase;
