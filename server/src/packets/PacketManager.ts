import { WebSocket } from "ws";

import Packet from "./Packet";
import PacketType from "./PacketType";
import PacketCommand from "./PacketCommand";


class PacketManager
{
	protected _sequence: number;

	constructor ()
	{
		this._sequence = 0;
	}

	sendPacket ( socket: WebSocket, packet: Packet )
	{
		socket.send (JSON.stringify (packet.toJSON ()));
	}

	sendDataPacket ( socket: WebSocket, command: PacketCommand, body: object = {} )
	{
		this.sendPacket (socket, new Packet (PacketType.Data, this._sequence++, command, body));
	}

	sendRequestPacket ( socket: WebSocket, command: PacketCommand, body: object = {} )
	{
		this.sendPacket (socket, new Packet (PacketType.Request, this._sequence++, command, body));
	}

	sendResponsePacket ( socket: WebSocket, request: Packet, body: object = {} )
	{
		this.sendPacket (
			socket,
			new Packet (PacketType.Response, this._sequence++, request.command, body, request.sequence),
		);
	}

	sendAcceptPacket ( socket: WebSocket, request: Packet, data: any = null )
	{
		const body: any = { ok: true };

		if ( data !== null )
		{
			body.data = data;
		}

		this.sendResponsePacket (socket, request, body);
	}

	sendRejectPacket ( socket: WebSocket, request: Packet, data: any = null )
	{
		const body: any = { ok: false };

		if ( data !== null )
		{
			body.data = data;
		}

		this.sendResponsePacket (socket, request, body);
	}

	sendErrorPacket ( socket: WebSocket, message: string )
	{
		this.sendDataPacket (socket, PacketCommand.Error, { message });
	}
}


export default PacketManager;
