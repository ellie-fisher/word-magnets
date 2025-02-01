import { IncomingMessage } from "node:http";
import { WebSocket } from "ws";

import { Client } from "./Client";
import { AnyObject } from "../common/util";

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
};
