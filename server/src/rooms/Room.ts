import RoomInfo from "./RoomInfo";
import RoomClients from "./RoomClients";
import RoomWordbanks from "./RoomWordbanks";
import RoomError from "./RoomError";

import Client from "../clients/Client";
import PacketCommand from "../packets/PacketCommand";


class Room
{
	public id: string;
	public info: RoomInfo;
	public clients: RoomClients;
	public wordbanks: RoomWordbanks;

	protected _onDestroy: Function;

	constructor ( id: string, info: RoomInfo, owner: Client, onDestroy: Function = () => {} )
	{
		this.id = id;
		this.info = info;
		this.clients = new RoomClients (id, owner);
		this._onDestroy = onDestroy;
		this.wordbanks = new RoomWordbanks ();
	}

	destroy ( reason: string = "The room was closed." )
	{
		this.sendDataPacket (PacketCommand.DestroyRoom, reason);
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
		}
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
