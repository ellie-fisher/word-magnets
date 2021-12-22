import Client from "../clients/Client";

import Packet from "../../common/packets/Packet";
import PacketType from "../../common/packets/PacketType";
import PacketCommand from "../../common/packets/PacketCommand";


class RoomClients
{
	public ownerID: string;
	public roomID: string;

	protected _clients: Map<string, Client>;

	// For using player names in sentences, and remembering votes and scores until the next round.
	protected _cache: Map<string, any>;

	constructor ( roomID: string, owner: Client )
	{
		this.roomID = roomID;
		this.ownerID = owner.id;
		this._clients = new Map ();
		this._cache = new Map ();
	}

	refreshCache ()
	{
		this._cache.clear ();

		this._clients.forEach (client =>
		{
			this._cache.set (client.id, client.cacheData ());
		});
	}

	applyCachedData ( client: Client )
	{
		if ( !this.hasCachedClient (client.id) )
		{
			return;
		}

		client.applyCachedData (this._cache.get (client.id));
	}

	getCachedName ( clientID: string ): string
	{
		return this.hasCachedClient (clientID) ? this._cache.get (clientID).name : "";
	}

	getAllCachedData ()
	{
		const data = [];

		this._cache.forEach (( cachedData, clientID: string ) =>
		{
			data.push ({ ...cachedData });
		});

		return data;
	}

	hasCachedClient ( clientID: string ): boolean
	{
		return this._cache.has (clientID);
	}

	handleNewRound ()
	{
		this.refreshCache ();

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

			if ( this.hasCachedClient (client.id) )
			{
				this.applyCachedData (client);
			}

			this._cache.set (client.id, client.cacheData ());

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
			this.sendDataPacket (PacketCommand.ClientList, this.getPublicData ());
		}
		else
		{
			client.packets.sendDataPacket (PacketCommand.ClientList, this.getPublicData ());
		}
	}

	forEach ( callback )
	{
		this._clients.forEach (callback);
	}

	getPublicData ()
	{
		const clients = [];

		this._clients.forEach (client =>
		{
			clients.push (client.getPublicData ());
		});

		return clients;
	}

	get size (): number
	{
		return this._clients.size;
	}
}


export default RoomClients;
