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


export default ClientNames;
