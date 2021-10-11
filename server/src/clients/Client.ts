import { WebSocket } from "ws";

import ClientInfo from "./ClientInfo";
import Packet from "../packets/Packet";
import PacketManager from "../packets/PacketManager";
import Sentence from "../wordbank/Sentence";


class Client
{
	public id: string;
	public socket: WebSocket;
	public info: ClientInfo;
	public packets: PacketManager;
	public roomID: string;
	public score: number;
	public sentence: Sentence;
	public vote: string;


	constructor ( id: string, socket: WebSocket, info: ClientInfo )
	{
		// @ts-ignore
		socket.fmClient = this;  // Monkey-patch custom property.

		this.id = id;
		this.socket = socket;
		this.info = info;
		this.packets = new PacketManager ();
		this.roomID = "";
		this.score = 0;
		this.sentence = { words: [], votes: 0 };
		this.vote = "";
	}

	onLeaveRoom ()
	{
		this.roomID = "";
		this.score = 0;
		this.sentence = { words: [], votes: 0 };
		this.vote = "";
	}

	sendPacket ( packet: Packet )
	{
		this.packets.sendPacket (this.socket, packet);
	}

	toJSON (): object
	{
		const object: any = this.info.toJSON ();

		object.id = this.id;
		object.score = this.score;

		return object;
	}
}


export default Client;
