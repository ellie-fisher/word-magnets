import Client from "../../clients/Client";
import Packet from "../../../common/packets/Packet";
import PacketCommand from "../../../common/packets/PacketCommand";

import RoomPhaseType from "../../../common/rooms/phases/RoomPhaseType";
import RoomPhaseState from "../../../common/rooms/phases/RoomPhaseState";
import RoomInfo from "../RoomInfo";
import RoomClients from "../RoomClients";
import RoomWordbanks from "../RoomWordbanks";


const DEFAULT_START_TIME = 10;

class RoomPhase
{
	public startTime: number;

	protected _type: RoomPhaseType;
	protected _state: RoomPhaseState;
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

		this._type = RoomPhaseType.Unknown;
		this._state = RoomPhaseState.Ready;

		this.startTime = DEFAULT_START_TIME;
		this._timeLeft = 0;
		this._timeout = -1;
	}

	async start ( onEnd: Function )
	{
		await this._onPreStart ();

		this._state = RoomPhaseState.Start;

		this.sendPhaseDataToAll ();

		this._timeLeft = this.startTime;
		this._tick (onEnd);
	}

	protected _tick ( onEnd: Function )
	{
		this._state = RoomPhaseState.Running;
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
		this._state = RoomPhaseState.End;
		this.sendPhaseDataToAll ();
	}

	get type (): RoomPhaseType
	{
		return this._type;
	}

	get state (): RoomPhaseState
	{
		return this._state;
	}

	receivePacket ( packet: Packet, client: Client ) {}

	sendData ( recipient: Client )
	{
		this.sendPhaseData (recipient);
	}

	sendPhaseData ( recipient: Client )
	{
		recipient.packets.sendDataPacket (PacketCommand.PhaseData, { type: this._type, state: this._state });
	}

	sendPhaseDataToAll ()
	{
		this._clients.forEach (this.sendPhaseData.bind (this));
	}

	protected async _onPreStart ()
	{
		this._state = RoomPhaseState.PreStart;
	}
}


export default RoomPhase;
