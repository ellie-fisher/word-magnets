import { AnyObject } from "../../common/util/types";


/**
 * Client data that is directly controlled by the client. Only used for names for now.
 *
 * For data not controlled by client like score, voting, etc., @see `server/clients/ClientRoomData`
 */
class ClientInfo
{
	public name: string;

	constructor ( info )
	{
		this.name = info.name;
	}

	cache (): AnyObject
	{
		return { name: this.name };
	}

	getPublicData (): AnyObject
	{
		return { name: this.name };
	}
}


export default ClientInfo;
