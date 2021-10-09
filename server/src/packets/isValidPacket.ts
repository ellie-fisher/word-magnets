import PacketType from "./PacketType";
import PacketCommand from "./PacketCommand";

import has from "../../../common/src/util/has";


const requiredFields = Object.freeze (["type", "sequence", "command", "body"]);


const isValidPacket = ( packet: any ): boolean =>
{
	if ( packet === null || typeof packet !== "object" )
	{
		return false;
	}

	const { length } = requiredFields;

	for ( let i = 0; i < length; i++ )
	{
		if ( !has (packet, requiredFields[i]) )
		{
			return false;
		}
	}

	if ( !(packet.type in PacketType) || !(packet.command in PacketCommand) )
	{
		return false;
	}

	if ( packet.type === PacketType.Response )
	{
		if ( !has (packet, "requestSeq") || !Number.isInteger (packet.requestSeq) )
		{
			return false;
		}

		if ( typeof packet.body !== "object" || !has (packet.body, "ok") )
		{
			return false;
		}
	}

	return true;
};


export default isValidPacket;
