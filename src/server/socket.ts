import { IncomingMessage } from "node:http";
import { WebSocket } from "ws";

import { Client } from "./Client";
import { AnyObject } from "../common/util";
import { ServerPacket } from "./packets/ServerPacket";
import { PacketType } from "../common/packets/PacketType";

function onMessage(this: WebSocket, message: AnyObject)
{
	console.log("message:", message);
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
