import { WebSocket } from "ws";

import Multimap from "../util/Multimap";

import Packet from "./Packet";
import PacketType from "./PacketType";
import PacketCommand from "./PacketCommand";
import PacketHandler from "./PacketHandler";


type Handler = PacketHandler | Function;

class PacketManager
{
	protected _socket: any;  // Sigh... We need this to be `any` to make it compatible with both
	                         // the `ws` WebSocket and the native WebSocket.
	protected _sequence: number;
	protected _handlers: Map<PacketType, Multimap>;
	protected _fallback: Function;

	constructor ( socket: any, fallback: Function = () => {} )
	{
		this._socket = socket;
		this._sequence = 0;
		this._handlers = new Map ();
		this._fallback = fallback;
	}

	on ( type: PacketType, command: PacketCommand, handler: Handler ): Handler
	{
		if ( !this._handlers.has (type) )
		{
			this._handlers.set (type, new Multimap ());
		}

		this._handlers.get (type).add (command, handler);

		return handler;
	}

	off ( type: PacketType, command: PacketCommand, handler: Handler ): Handler
	{
		if ( !this._handlers.has (type) )
		{
			return null;
		}

		this._handlers.get (type).delete (command, handler);

		return handler;
	}

	setFallbackHandler ( fallback: Function ): Function
	{
		this._fallback = fallback;
		return fallback;
	}

	handlePacket ( packet: Packet, ...args: any[] )
	{
		const multimap = this._handlers.get (packet.type);

		if ( !this._handlers.has (packet.type) || !multimap.has (packet.command) )
		{
			this._fallback (packet, ...args);
		}
		else
		{
			multimap.forEach (packet.command, handler =>
			{
				if ( handler instanceof PacketHandler )
				{
					handler.handlePacket (packet, ...args);
				}
				else
				{
					handler (packet, ...args);
				}
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
