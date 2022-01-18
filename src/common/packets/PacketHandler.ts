import Packet from "./Packet";
import validatePacket from "./validatePacket";

import { ValidationData } from "../validation/types";


interface PacketHandlerArgs
{
	fields?: any;
	handler: ( Packet, ...args: any[] ) => void;
	validationFailed?: ( Packet, ...args: any[] ) => void;
}


class PacketHandler
{
	protected _fields: any;  // TODO: Add an `AnyObject` custom type.
	protected _handler: Function;
	protected _validationFailed: Function;

	constructor ( args: PacketHandlerArgs )
	{
		this._fields = args.fields;
		this._handler = args.handler;
		this._validationFailed = args.validationFailed || function () {};
	}

	handlePacket ( packet: Packet, ...args: any[] )
	{
		if ( !this.hasValidation )
		{
			this._handler (packet, ...args);
		}
		else
		{
			const results = validatePacket (packet, this._fields);

			if ( results[0] )
			{
				this._handler (packet, ...args);
			}
			else
			{
				this._validationFailed (packet, ...args, results[1]);
			}
		}
	}

	get hasValidation (): boolean
	{
		return typeof this._fields === "object" && this._fields !== null;
	}
}


export default PacketHandler;
