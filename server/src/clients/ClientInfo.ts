class ClientInfo
{
	public name: string;

	constructor ( name: string = "" )
	{
		this.name = name;
	}

	toJSON (): object
	{
		return { name: this.name };
	}
}


export default ClientInfo;
