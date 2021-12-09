import { WebSocket } from "ws";

import Multimap from "../util/Multimap";

import Packet from "./Packet";
import PacketType from "./PacketType";
import PacketCommand from "./PacketCommand";


class PacketManager
{
	protected _socket: any;  // Sigh... We need this to be `any` to make it compatible with both
	                         // the `ws` WebSocket and the native WebSocket.
	protected _sequence: number;
	protected _listeners: Map<PacketType, Multimap>;
	protected _fallback: Function;

	constructor ( socket: any )
	{
		this._socket = socket;
		this._sequence = 0;
		this._listeners = new Map ();
		this._fallback = () => {};
	}

	on ( type: PacketType, command: PacketCommand, listener: Function ): Function
	{
		if ( !this._listeners.has (type) )
		{
			this._listeners.set (type, new Multimap ());
		}

		this._listeners.get (type).add (command, listener);

		return listener;
	}

	off ( type: PacketType, command: PacketCommand, listener: Function ): Function
	{
		if ( !this._listeners.has (type) )
		{
			return null;
		}

		this._listeners.get (type).delete (command, listener);

		return listener;
	}

	setFallbackHandler ( fallback: Function ): Function
	{
		this._fallback = fallback;
		return fallback;
	}

	handlePacket ( packet: Packet, ...args: any[] )
	{
		const multimap = this._listeners.get (packet.type);

		if ( !this._listeners.has (packet.type) || !multimap.has (packet.command) )
		{
			this._fallback (packet, ...args);
		}
		else
		{
			multimap.forEach (packet.command, listener =>
			{
				listener (packet, ...args);
			});
		}
	}

	sendPacket ( packet: Packet )
	{
		this._socket.send (JSON.stringify (packet.toJSON ()));
	}

	sendDataPacket ( command: PacketCommand, body: any = "" )
	{
		this.sendPacket (new Packet (PacketType.Data, this._sequence++, command, body));
	}

	sendRequestPacket ( command: PacketCommand, body: any = "" )
	{
		this.sendPacket (new Packet (PacketType.Request, this._sequence++, command, body));
	}

	sendResponsePacket ( request: Packet, body: any = "" )
	{
		this.sendPacket (
			new Packet (PacketType.Response, this._sequence++, request.command, body, request.sequence),
		);
	}

	sendAcceptPacket ( request: Packet, data: any = null )
	{
		const body: any = { ok: true };

		if ( data !== null )
		{
			body.data = data;
		}

		this.sendResponsePacket (request, body);
	}

	sendRejectPacket ( request: Packet, data: any = null )
	{
		const body: any = { ok: false };

		if ( data !== null )
		{
			body.data = data;
		}

		this.sendResponsePacket (request, body);
	}

	sendErrorPacket ( message: string )
	{
		this.sendDataPacket (PacketCommand.Error, { message });
	}
}


export default PacketManager;
