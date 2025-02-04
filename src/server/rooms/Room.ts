import { PacketBuffer } from "../../common/packets/PacketBuffer";
import { Client } from "../Client";
import { RoomData } from "./RoomData";
import { ClientJoinPacket } from "../packets/ClientJoin";
import { ClientLeavePacket } from "../packets/ClientLeave";
import { RoomDataPacket } from "../packets/RoomData";
import { RoomDestroyedPacket } from "../packets/RoomDestroyed";

export class Room
{
	#id: string;
	#owner: Client;
	#clients: Set<Client>;

	public data: RoomData;
	public words: string[][];

	constructor(id: string, owner: Client, data: RoomData)
	{
		this.#id = id;
		this.#owner = owner;
		this.#clients = new Set();
		this.data = { ...data };
		this.words = [];

		owner.roomID = id;

		this.addClient(owner);
	}

	public get id(): string { return this.#id; }
	public get owner(): Client { return this.#owner; }
	public get clients(): Client[] { return this.#clients.values().toArray(); }
	public get isFull(): boolean { return this.#clients.size >= this.data.maxPlayers; }

	public addClient(client: Client): void
	{
		this.#clients.add(client);

		client.roomID = this.#id;

		this.send(ClientJoinPacket.pack(client));
		this.send(RoomDataPacket.pack(this.data));
	}

	public removeClient(client: Client): void
	{
		client.roomID = "";

		this.send(ClientLeavePacket.pack(client));
		this.#clients.delete(client);
	}

	public destroy(): void
	{
		this.send(RoomDestroyedPacket.pack());

		for (const client of this.#clients)
		{
			client.roomID = "";
		}

		this.#clients.clear();
	}

	public send(buffer: PacketBuffer): void
	{
		for (const client of this.#clients)
		{
			client.send(buffer);
		}
	}
};
