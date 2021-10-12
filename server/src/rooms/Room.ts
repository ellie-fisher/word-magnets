import RoomInfo from "./RoomInfo";
import RoomClients from "./RoomClients";
import RoomWordbanks from "../rooms/RoomWordbanks";

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
