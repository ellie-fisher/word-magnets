import PacketType from "./PacketType";
import PacketCommand from "./PacketCommand";


class Packet
{
	public type: PacketType;
	public sequence: number;
	public command: PacketCommand;
	public body: any;
	public requestSeq: number;

	constructor (
		type: PacketType,
		sequence: number,
		command: PacketCommand,
		body: any = "",
		requestSeq: number = -1,
	)
	{
		this.type = type;
		this.sequence = sequence;
		this.command = command;
		this.body = body;
		this.requestSeq = requestSeq;
	}

	toJSON ()
	{
		const object: any =
		{
			type: this.type,
			sequence: this.sequence,
			command: this.command,
			body: this.body,
		};

		if ( this.requestSeq >= 0 )
		{
			object.requestSeq = this.requestSeq;
		}

		return object;
	}
}


export default Packet;
