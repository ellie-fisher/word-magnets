import { WebSocket } from "ws";

import ClientInfo from "./ClientInfo";
import Packet from "../packets/Packet";
import PacketManager from "../packets/PacketManager";
import SentenceWord from "../wordbank/SentenceWord";


class Client
{
	public id: string;
	public socket: WebSocket;
	public info: ClientInfo;
	public packets: PacketManager;
	public roomID: string;
	public score: number;
	public sentence: SentenceWord[];
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
		this.sentence = [];
		this.vote = "";
	}

	onLeaveRoom ()
	{
		this.roomID = "";
		this.score = 0;
		this.sentence = [];
		this.vote = "";
	}
}


export default Client;
