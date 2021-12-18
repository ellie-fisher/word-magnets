import Client from "../clients/Client";

import Packet from "../../common/packets/Packet";
import PacketType from "../../common/packets/PacketType";
import PacketCommand from "../../common/packets/PacketCommand";


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
	}

	refreshNameCache ()
	{
		this._nameCache.clear ();

		this._clients.forEach (client =>
		{
			this._nameCache.set (client.id, client.info.name);
		});
	}

	getCachedName ( clientID: string ): string
	{
		return this.hasName (clientID) ? this._nameCache.get (clientID) : "";
	}

	hasName ( clientID: string ): boolean
	{
		return this._nameCache.has (clientID);
	}

	handleNewRound ()
	{
		this.refreshNameCache ();

		this.forEach (( client: Client ) =>
		{
			client.handleNewRound ();
		});
	}

	handleNewGame ()
	{
		this.forEach (( client: Client ) =>
		{
			client.handleNewGame ();
		});
	}

	addClient ( client: Client ): boolean
	{
		const notInRoom = !client.isInRoom ();

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

			client.handleLeaveRoom ();
			this._clients.delete (id);

			return true;
		}

		return false;
	}

	clearClients ()
	{
		this.forEach (( client: Client ) => client.handleLeaveRoom ());
		this.ownerID = "";
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
				client.packets.sendDataPacket (command, body);
			}
		});
	}

	sendClientList ( client?: Client )
	{
		if ( arguments.length <= 0 )
		{
			this.sendDataPacket (PacketCommand.ClientList, this.toJSON ());
		}
		else
		{
			client.packets.sendDataPacket (PacketCommand.ClientList, this.toJSON ());
		}
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
			clients.push (client.toJSON ());
		});

		return clients;
	}

	get size (): number
	{
		return this._clients.size;
	}
}


export default RoomClients;
