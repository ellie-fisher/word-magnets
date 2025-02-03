import { v4 as uuidv4 } from "uuid";
import { WebSocket } from "ws";

import { PacketBuffer } from "../common/packets/PacketBuffer";

export class Client
{
	#id: string;
	#socket: WebSocket;
	public name: string;
	public roomID: string;

	constructor(socket: WebSocket)
	{
		this.#id = uuidv4();
		this.#socket = socket;
		this.name = "";
		this.roomID = "";
	}

	public get id(): string { return this.#id; }
	public get socket(): WebSocket { return this.#socket; }

	public send(buffer: PacketBuffer): void
	{
		this.#socket.send(buffer.buffer);
	}
};
