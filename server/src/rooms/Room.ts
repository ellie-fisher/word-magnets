import RoomInfo from "./RoomInfo";
import RoomClients from "./RoomClients";

import Client from "../clients/Client";
import PacketCommand from "../packets/PacketCommand";


class Room
{
	public id: string;
	public info: RoomInfo;
	public clients: RoomClients;

	constructor ( id: string, info: RoomInfo, owner: Client )
	{
		this.id = id;
		this.info = info;
		this.clients = new RoomClients (id, owner);
	}

	/**
	 * @param {PacketCommand} command
	 * @param {any} [body={}]
	 * @param {string[]|null} [except=null] - Client IDs to *NOT* send the packet to.
	 */
	sendDataPacket ( command: PacketCommand, body: any = {}, except: string[] = null )
	{
		this.clients.sendDataPacket (command, body, except);
	}

	isFull (): boolean
	{
		return this.clients.size >= this.info.maxClients;
	}

	toJSON (): object
	{
		const data: any = this.info.toJSON ();

		data.id = this.id;
		data.ownerName = this.clients.getOwner ().info.name;
		data.numClients = this.clients.size;

		return data;
	}
}


export default Room;
