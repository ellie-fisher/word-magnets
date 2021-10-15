class ClientInfo
{
	public name: string;

	constructor ( info )
	{
		this.name = info.name;
	}

	toJSON (): object
	{
		return { name: this.name };
	}
}


export default ClientInfo;
