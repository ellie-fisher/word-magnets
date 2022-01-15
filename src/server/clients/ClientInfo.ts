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

	cache ()
	{
		return { name: this.name };
	}

	getPublicData ()
	{
		return { name: this.name };
	}
}


export default ClientInfo;
