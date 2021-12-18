import { WebSocket } from "ws";

import ClientInfo from "./ClientInfo";
import ClientRoomData from "./ClientRoomData";
import Packet from "../../common/packets/Packet";
import PacketManager from "../../common/packets/PacketManager";
import Sentence from "../../common/wordbanks/Sentence";


class Client
{
	public id: string;
	public socket: WebSocket;
	public info: ClientInfo;
	public packets: PacketManager;
	public roomData: ClientRoomData;

	constructor ( id: string, socket: WebSocket, info: ClientInfo )
	{
		// @ts-ignore
		socket.__$_gameClient = this;  // Monkey-patch custom property. The absurd prefix is to make it unique.

		this.id = id;
		this.socket = socket;
		this.info = info;
		this.packets = new PacketManager (socket);
		this.roomData = new ClientRoomData (this.id);
	}

	clearRoomData ()
	{
		this.roomData.clear ();
	}

	handleNewRound ()
	{
		this.roomData.handleNewRound ();
	}

	handleNewGame ()
	{
		this.roomData.handleNewGame ();
	}

	handleLeaveRoom ()
	{
		this.roomData.handleLeaveRoom ();
	}

	isInRoom (): boolean
	{
		return this.roomData.roomID !== "";
	}

	sendPacket ( packet: Packet )
	{
		this.packets.sendPacket (packet);
	}

	toJSON (): object
	{
		const object: any = this.info.toJSON ();

		object.id = this.id;

		return { ...object, ...this.roomData.toJSON () };
	}

	set roomID ( roomID: string )
	{
		this.roomData.roomID = roomID;
	}

	set vote ( vote: number )
	{
		this.roomData.vote = vote;
	}

	set score ( score: number )
	{
		this.roomData.score = score;
	}

	get roomID (): string
	{
		return this.roomData.roomID;
	}

	get vote (): number
	{
		return this.roomData.vote;
	}

	get score (): number
	{
		return this.roomData.score;
	}
}


export default Client;
