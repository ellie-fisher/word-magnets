import { WebSocket } from "ws";

import ClientInfo from "./ClientInfo";
import ClientRoomData from "./ClientRoomData";
import Packet from "../../common/packets/Packet";
import PacketManager from "../../common/packets/PacketManager";
import Sentence from "../../common/wordbanks/Sentence";

import { AnyObject } from "../../common/util/types";


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
		socket.__$_gameClient = this;  // Monkey-patch custom property. The absurd prefix is to avoid
		                               // overwriting an existing one.

		this.id = id;
		this.socket = socket;
		this.info = info;
		this.packets = new PacketManager (socket);
		this.roomData = new ClientRoomData (this.id);
	}

	cacheData (): AnyObject
	{
		return { ...this.roomData.cache (), ...this.info.cache (), id: this.id };
	}

	applyCachedData ( data: AnyObject )
	{
		/* We don't apply the cached data to `info` or this client because it could change important,
		   unique things like their ID or their name. */
		this.roomData.applyCachedData (data);
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

	getPublicData (): AnyObject
	{
		const object = this.info.getPublicData ();

		object.id = this.id;

		return { ...object, ...this.roomData.getPublicData () };
	}

	set name ( name: string )
	{
		this.info.name = name;
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

	get name (): string
	{
		return this.info.name;
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
