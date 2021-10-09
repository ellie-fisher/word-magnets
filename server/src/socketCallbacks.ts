import Client from "./clients/Client";
import ClientInfo from "./clients/ClientInfo";
import ClientManager from "./clients/ClientManager";
import ClientNames from "./clients/ClientNames";

import PacketCommand from "./packets/PacketCommand";
import isValidPacket from "./packets/isValidPacket";

import validateFields from "./validation/validateFields";
import clientInfoFields from "./validation/fields/clientInfo";


const onNewConnection = function ( socket: any, request: any )
{
	const client = ClientManager.create (socket, new ClientInfo (""));

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

	if ( client.info.name === "" && packet.command !== PacketCommand.RegisterInfo )
	{
		client.packets.sendRejectPacket (this, packet, "Please set your name first.");
		return;
	}

	if ( packet.command === PacketCommand.RegisterInfo && client.roomID !== "" )
	{
		client.packets.sendRejectPacket (this, packet, "Cannot change name in a room.");
		return;
	}
};


export default onNewConnection;
