import { WebSocket } from "ws";

import ClientInfo from "./ClientInfo";
import Packet from "../../common/packets/Packet";
import PacketManager from "../../common/packets/PacketManager";
import Sentence from "../../common/wordbanks/Sentence";


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

	constructor ( id: string, socket: WebSocket, info: ClientInfo )
	{
		// @ts-ignore
		socket.fmClient = this;  // Monkey-patch custom property. TODO: Rename to something else

		this.id = id;
		this.socket = socket;
		this.info = info;
		this.packets = new PacketManager (socket);
		this.roomID = "";
		this.score = 0;
		this.sentence = { value: "", votes: 0, voteID: -1 };
		this.vote = -1;
	}

	clearSentence ()
	{
		this.sentence.value = "";
		this.sentence.votes = 0;
		this.sentence.voteID = -1;
	}

	hasSentence (): boolean
	{
		return this.sentence.value !== "";
	}

	hasVoteID (): boolean
	{
		return this.sentence.voteID >= 0;
	}

	onNewRound ()
	{
		this.clearSentence ();
		this.vote = -1;
	}

	onNewGame ()
	{
		this.onNewRound ();
		this.score = 0;
	}

	// TODO: A potentially good idea would be to have clients be just an object with an ID and a name,
	//       and have everything else "wrap around" it when a client joins a server, so it can simply
	//       be detached when they leave a room and we don't have to worry about clearing any of this.
	//
	//       Kind of similar to how the "entity" part of ECS is just an empty vessel with an ID.
	onLeaveRoom ()
	{
		this.clearSentence ();
		this.roomID = "";
		this.score = 0;
		this.vote = -1;
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
