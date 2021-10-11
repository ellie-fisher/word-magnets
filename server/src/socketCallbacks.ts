import Client from "./clients/Client";
import ClientInfo from "./clients/ClientInfo";
import ClientManager from "./clients/ClientManager";
import ClientNames from "./clients/ClientNames";

import Packet from "./packets/Packet";
import isValidPacket from "./packets/isValidPacket";
import handlePacket from "./packets/handlePacket";

import validateFields from "./validation/validateFields";
import clientInfoFields from "./validation/fields/clientInfo";


const onNewConnection = function ( socket: any, request: any )
{
	const client = ClientManager.create (socket, new ClientInfo ({ name: "" }));

	if ( client === null )
	{
		socket.close (
			ClientManager.hasReachedMax ()
				? "Maximum player limit reached. Please try again later."
				: "A major error has occurred. Please try again later."
		);

		return;
	}

	console.log (`New connection: ${client.id}`);

	socket.on ("message", onSocketMessage);
	socket.on ("close", onSocketClose);
};

const onSocketClose = function ( this: any )
{
	const { fmClient } = this;

	ClientManager.remove (fmClient.id);
	ClientNames.removeClient (fmClient);

	console.log (`${fmClient.id} disconnected.`);
};

const onSocketMessage = function ( this: any, message: any )
{
	console.log ("onSocketMessage:", message.toString ());

	const client: Client = this.fmClient;

	let packet;

	try
	{
		packet = JSON.parse (message);

		console.log ("PACKET", packet);

		if ( !isValidPacket (packet) )
		{
			throw new Error ("Invalid packet");
		}
	}
	catch ( error: any )
	{
		let errorMessage = "Internal server error";

		if ( error instanceof SyntaxError )
		{
			errorMessage = "Malformed packet";
		}
		else if ( error.message === "Invalid packet" )
		{
			errorMessage = error.message;
		}
		else
		{
			console.error ("Packet JSON parsing error:", error.message);
		}

		client.packets.sendErrorPacket (this, errorMessage);
		return;
	}

	handlePacket (packet, client);
};


export default onNewConnection;
