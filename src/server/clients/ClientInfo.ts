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
