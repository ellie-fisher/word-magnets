import { IncomingMessage } from "node:http";
import { WebSocket, RawData } from "ws";

import { Client } from "./Client";
import { ServerPacket } from "./packets/ServerPacket";
import { PacketType } from "../common/packets/PacketType";
import { PacketBuffer } from "../common/packets/PacketBuffer";

function onMessage(this: WebSocket, data: RawData, isBinary: boolean)
{
	if (!isBinary || !(data instanceof ArrayBuffer))
	{
		return;
	}

	const unpacked = ServerPacket.unpack(new PacketBuffer(data));

	if (unpacked === null)
	{
		return;
	}

	console.log("RECEIVED:", unpacked);
};

function onClose(this: WebSocket)
{
	const id: string | null = (this as any)?._wmClient?.id ?? null;

	(this as any)._wmClient = null;

	console.log(`${id ?? (this as any)._socket.remoteAddress} disconnected.`);
};

export function onSocketConnection(socket: WebSocket, request: IncomingMessage)
{
	const client = new Client(socket);

	(socket as any)._wmClient = client;

	console.log(`New connection: ${client.id} (address: ${request.socket.remoteAddress})`);

	socket.on("message", onMessage.bind(socket));
	socket.on("close", onClose.bind(socket));

	// Send client their ID because client-side behavior can be different if it's the client's own ID.
	ServerPacket.send(client, { type: PacketType.ClientID, data: { id: client.id }});
};
