import Client from "./Client";


const ClientNames: any = new Map<string, Client> ();

ClientNames.addClient = function ( client: Client )
{
	this.set (client.info.name, client);
};

ClientNames.removeClient = function ( client: Client )
{
	this.delete (client.info.name);
};

ClientNames.isDuplicateName = function ( name: string, client: Client ): boolean
{
	return this.has (name) && this.get (name) !== client;
};


export default ClientNames;
