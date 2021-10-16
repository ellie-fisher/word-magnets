import { WebSocket } from "ws";

import Packet from "./Packet";
import PacketType from "./PacketType";
import PacketCommand from "./PacketCommand";


class PacketManager
{
	protected _socket: WebSocket;
	protected _sequence: number;

	constructor ( socket: WebSocket )
	{
		this._socket = socket;
		this._sequence = 0;
	}

	sendPacket ( packet: Packet )
	{
		const json: any = packet.toJSON ();

		// FIXME: Remove
		json.command = PacketCommand[json.command];

		this._socket.send (JSON.stringify (json));
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
