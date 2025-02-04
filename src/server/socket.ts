import { IncomingMessage } from "node:http";
import { WebSocket, RawData } from "ws";

import { Packet } from "../common/packets/Packet";
import { PacketBuffer } from "../common/packets/PacketBuffer";
import { Client } from "./Client";
import { ClientIDPacket } from "./packets/ClientID";
import { PacketType } from "../common/packets/PacketType";
import { RoomManager } from "./rooms/RoomManager";

function onMessage(this: WebSocket, data: RawData, isBinary: boolean)
{
	if (!isBinary)
	{
		return;
	}

	if (data instanceof Buffer)
	{
		data = data.buffer.slice(data.byteOffset) as ArrayBuffer;
	}
	else if (!(data instanceof ArrayBuffer))
	{
		return;
	}

	const unpacked = Packet.unpack(new PacketBuffer(data));

	switch (unpacked?.type)
	{
		case PacketType.CreateRoom:
		case PacketType.DestroyRoom:
		case PacketType.JoinRoom:
		case PacketType.LeaveRoom:
		case PacketType.StartGame:
		case PacketType.SubmitSentence:
		case PacketType.SubmitVote:
		case PacketType.RemoveClient:
			RoomManager.receivePacket((this as any)._wmClient, unpacked);
			break;

		default:
			break;
	}
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
	client.send(ClientIDPacket.pack(client));
};
