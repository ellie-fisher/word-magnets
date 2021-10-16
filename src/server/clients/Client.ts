import { WebSocket } from "ws";

import ClientInfo from "./ClientInfo";
import Packet from "../../common/packets/Packet";
import PacketManager from "../../common/packets/PacketManager";
import Sentence from "../wordbanks/Sentence";


class Client
{
	public id: string;
	public socket: WebSocket;
	public info: ClientInfo;
	public packets: PacketManager;
	public roomID: string;
	public score: number;
	public sentence: Sentence;
	public vote: number;
	public voteID: number;

	constructor ( id: string, socket: WebSocket, info: ClientInfo )
	{
		// @ts-ignore
		socket.fmClient = this;  // Monkey-patch custom property.

		this.id = id;
		this.socket = socket;
		this.info = info;
		this.packets = new PacketManager (socket);
		this.roomID = "";
		this.score = 0;
		this.sentence = { value: "", votes: 0 };
		this.vote = -1;
		this.voteID = -1;
	}

	clearSentence ()
	{
		this.sentence.value = "";
		this.sentence.votes = 0;
	}

	onNewRound ()
	{
		this.clearSentence ();
		this.vote = -1;
		this.voteID = -1;
	}

	onNewGame ()
	{
		this.onNewRound ();
		this.score = 0;
	}

	onLeaveRoom ()
	{
		this.clearSentence ();
		this.roomID = "";
		this.score = 0;
		this.vote = -1;
		this.voteID = -1;
	}

	sendPacket ( packet: Packet )
	{
		this.packets.sendPacket (packet);
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
