import Client from "../../clients/Client";
import Packet from "../../../common/packets/Packet";
import PacketCommand from "../../../common/packets/PacketCommand";

import IRoom from "../IRoom";
import RoomInfo from "../RoomInfo";
import RoomClients from "../RoomClients";
import RoomWordbanks from "../RoomWordbanks";

import RoomPhaseType from "../../../common/rooms/phases/RoomPhaseType";
import RoomPhaseState from "../../../common/rooms/phases/RoomPhaseState";


const DEFAULT_START_TIME = 10;

class RoomPhase
{
	public startTime: number;

	protected _type: RoomPhaseType;
	protected _state: RoomPhaseState;
	protected _timeout;

	protected _room: IRoom;

	constructor ( room: IRoom )
	{
		this._room = room;

		this._type = RoomPhaseType.Unknown;
		this._state = RoomPhaseState.Ready;

		this.startTime = DEFAULT_START_TIME;
		this._timeout = -1;
	}

	async start ( onEnd: Function )
	{
		await this._onPreStart ();

		this._state = RoomPhaseState.Start;

		this.sendPhaseData ();

		this._room.info.timeLeft = this.startTime;
		this._tick (onEnd);
	}

	protected _tick ( onEnd: Function )
	{
		this._state = RoomPhaseState.Running;
		this._room.clients.sendDataPacket (PacketCommand.RoomInfo, { timeLeft: this._room.info.timeLeft });

		if ( this._room.info.timeLeft <= 0 )
		{
			this._onEnd (onEnd);
		}
		else
		{
			this._room.info.timeLeft--;
			this._timeout = setTimeout (() => this._tick (onEnd), 1000);
		}
	}

	protected async _onEnd ( onEnd: Function )
	{
		this._state = RoomPhaseState.End;
		this.sendPhaseData ();
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

	sendPhaseData ( recipient?: Client )
	{
		if ( arguments.length <= 0 )
		{
			this._room.clients.forEach (this.sendPhaseData.bind (this));
		}
		else
		{
			recipient.packets.sendDataPacket (PacketCommand.PhaseData, { type: this._type, state: this._state });
		}
	}

	protected async _onPreStart ()
	{
		this._state = RoomPhaseState.PreStart;
	}
}


export default RoomPhase;
