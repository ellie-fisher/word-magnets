import Client from "../clients/Client";

import Packet from "../packets/Packet";
import PacketType from "../packets/PacketType";
import PacketCommand from "../packets/PacketCommand";


class RoomClients
{
	public ownerID: string;
	public roomID: string;

	protected _clients: Map<string, Client>;
	protected _nameCache: Map<string, string>;  // For using player names in sentences.

	constructor ( roomID: string, owner: Client )
	{
		this.roomID = roomID;
		this.ownerID = owner.id;
		this._clients = new Map ();
		this._nameCache = new Map ();

		this.addClient (owner);
	}

	refreshNameCache ()
	{
		this._nameCache.clear ();

		this._clients.forEach (client =>
		{
			this._nameCache.set (client.id, client.info.name);
		});
	}

	addClient ( client: Client ): boolean
	{
		const notInRoom = client.roomID === "";

		if ( notInRoom && !this.hasClient (client.id) )
		{
			this._clients.set (client.id, client);
			this._nameCache.set (client.id, client.info.name);

			client.roomID = this.roomID;
		}

		return notInRoom;
	}

	removeClient ( id: string ): boolean
	{
		if ( this.hasClient (id) )
		{
			const client = this.getClient (id);

			client.roomID = "";
			this._clients.delete (id);

			return true;
		}

		return false;
	}

	clearClients ()
	{
		this.ownerID = "";

		this._clients.forEach (client =>
		{
			client.roomID = "";
		})

		this._clients.clear ();
	}

	hasClient ( id: string ): boolean
	{
		return this._clients.has (id);
	}

	getClient ( id: string ): Client | null
	{
		return this.hasClient (id) ? this._clients.get (id) : null;
	}

	getOwner (): Client | null
	{
		return this.getClient (this.ownerID);
	}

	isOwner ( client: Client ): boolean
	{
		return client !== null && this.getOwner () === client;
	}

	/**
	 * @param {PacketCommand} command
	 * @param {any} [body=""]
	 * @param {string[]|null} [except=null] - Client IDs to *NOT* send the packet to.
	 */
	sendDataPacket ( command: PacketCommand, body: any = "", except: string[] = null )
	{
		const _except = new Set (except === null ? [] : except);

		this._clients.forEach (client =>
		{
			if ( except === null || !_except.has (client.id) )
			{
				client.packets.sendDataPacket (client.socket, command, body);
			}
		});
	}

	forEach ( callback )
	{
		this._clients.forEach (callback);
	}

	toJSON ()
	{
		const clients = [];

		this._clients.forEach (client =>
		{
			clients.push (client.id);
		});

		return clients;
	}

	get size (): number
	{
		return this._clients.size;
	}
}


export default RoomClients;
