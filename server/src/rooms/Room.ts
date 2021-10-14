import { RequestError, TimeoutError } from "got";

import RoomInfo from "./RoomInfo";
import RoomClients from "./RoomClients";
import RoomWordbanks from "./RoomWordbanks";
import RoomError from "./RoomError";

import Packet from "../packets/Packet";
import PacketCommand from "../packets/PacketCommand";
import Client from "../clients/Client";

import RoomPhase from "./phases/RoomPhase";
import RoomPhaseType from "./phases/RoomPhaseType";
import CreatePhase from "./phases/CreatePhase";
import VotePhase from "./phases/VotePhase";


class Room
{
	public id: string;
	public info: RoomInfo;
	public clients: RoomClients;
	public phase: RoomPhase;
	public wordbanks: RoomWordbanks;

	protected _onDestroy: Function;
	protected _phases: Map<RoomPhaseType, RoomPhase>;

	constructor ( id: string, info: RoomInfo, owner: Client, onDestroy: Function = () => {} )
	{
		this.id = id;
		this.info = info;
		this.clients = new RoomClients (id, owner);
		this._onDestroy = onDestroy;
		this.wordbanks = new RoomWordbanks ();

		this._phases = new Map (
		[
			[RoomPhaseType.Create, new CreatePhase (this.info, this.clients, this.wordbanks)],
			[RoomPhaseType.Vote, new VotePhase (this.info, this.clients, this.wordbanks)],
		]);

		this.phase = this._phases.get (RoomPhaseType.Create);
	}

	destroy ( reason: string = "The room was closed." )
	{
		this.sendDataPacket (PacketCommand.DestroyRoom, reason);
		this.clients.forEach (client => client.onLeaveRoom ());
		this.clients.clearClients ();

		this._onDestroy (this, reason);
	}

	join ( client: Client ): RoomError
	{
		if ( client.roomID !== "" )
		{
			return RoomError.InRoom;
		}

		if ( this.isFull () )
		{
			return RoomError.Full;
		}

		if ( this.clients.addClient (client) )
		{
			this.sendDataPacket (PacketCommand.JoinRoom, client.id);
			this.sendInfo (client);
			this.sendClientList (client);

			if ( this.phase.type === RoomPhaseType.Create )
			{
				this.sendWordbanks (client);
			}
		}

		return RoomError.Ok;
	}

	leave ( client: Client )
	{
		if ( this.clients.isOwner (client) )
		{
			this.destroy ("The room was closed.");
		}
		else
		{
			this.sendDataPacket (PacketCommand.LeaveRoom, client.id, [client.id]);
			this.clients.removeClient (client.id);
			client.onLeaveRoom ();
		}
	}

	nextPhase ()
	{
		switch ( this.phase.type )
		{
			case RoomPhaseType.Create:
				this.phase = this._phases.get (RoomPhaseType.Vote);
				break;

			default:
				break;
		}
	}

	async startPhase ()
	{
		try
		{
			await this.phase.start (() =>
			{
				this.nextPhase ();
				this.startPhase ();
			});
		}
		catch ( error )
		{
			console.error ("onPreStart() -", error);

			this.destroy (error instanceof RequestError || error instanceof TimeoutError
				? "An API error occurred."
				: "An internal server error occurred."
			);

			return;
		}
	}

	receivePacket ( packet: Packet, client: Client )
	{
		this.phase.receivePacket (packet, client);
	}

	/**
	 * @param {PacketCommand} command
	 * @param {any} [body=""]
	 * @param {string[]|null} [except=null] - Client IDs to *NOT* send the packet to.
	 */
	sendDataPacket ( command: PacketCommand, body: any = "", except: string[] = null )
	{
		this.clients.sendDataPacket (command, body, except);
	}

	sendInfo ( client?: Client )
	{
		if ( arguments.length <= 0 )
		{
			this.sendDataPacket (PacketCommand.RoomInfo, this.toJSON ());
		}
		else
		{
			client.packets.sendDataPacket (client.socket, PacketCommand.RoomInfo, this.toJSON ());
		}
	}

	sendClientList ( client?: Client )
	{
		if ( arguments.length <= 0 )
		{
			this.sendDataPacket (PacketCommand.ClientList, this.clients.toJSON ());
		}
		else
		{
			client.packets.sendDataPacket (client.socket, PacketCommand.ClientList, this.clients.toJSON ());
		}
	}

	sendWordbanks ( client?: Client )
	{
		if ( arguments.length <= 0 )
		{
			this.sendDataPacket (PacketCommand.Wordbanks, this.wordbanks.toJSON ());
		}
		else
		{
			client.packets.sendDataPacket (client.socket, PacketCommand.Wordbanks, this.wordbanks.toJSON ());
		}
	}

	isFull (): boolean
	{
		return this.clients.size >= this.info.maxClients;
	}

	toJSON (): object
	{
		const data: any = this.info.toJSON ();
		const owner = this.clients.getOwner ();

		data.id = this.id;
		data.ownerID = owner.id;
		data.ownerName = owner.info.name;
		data.numClients = this.clients.size;

		return data;
	}
}


export default Room;
