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
	protected _listeners: Multimap;
	protected _fallback: Function;

	constructor ( socket: any )
	{
		this._socket = socket;
		this._sequence = 0;
		this._listeners = new Multimap ();
		this._fallback = () => {};
	}

	on ( command: PacketCommand, listener: Function ): Function
	{
		this._listeners.add (command, listener);
		return listener;
	}

	off ( command: PacketCommand, listener: Function ): Function
	{
		this._listeners.delete (command, listener);
		return listener;
	}

	setFallbackHandler ( fallback: Function ): Function
	{
		this._fallback = fallback;
		return fallback;
	}

	handlePacket ( packet: Packet, ...args: any[] )
	{
		if ( !this._listeners.has (packet.command) )
		{
			this._fallback (packet, ...args);
		}
		else
		{
			this._listeners.forEach (packet.command, listener =>
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
