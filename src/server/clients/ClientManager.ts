import { WebSocket } from "ws";

import Client from "./Client";
import ClientInfo from "./ClientInfo";

import ObjectManager from "../misc/ObjectManager";

import serverConfig from "../config/serverConfig";

import { ObjectCreateError } from "../misc/ObjectManager";


class _ClientManager extends ObjectManager<Client>
{
	protected _create ( id: string, socket: WebSocket, info: ClientInfo ): Client
	{
		return new Client (id, socket, info);
	}

	getCreateErrorMessage ( error: ObjectCreateError ): string
	{
		const { maxObjects } = this;

		switch ( error )
		{
			case ObjectCreateError.Ok:
				return "";

			case ObjectCreateError.ObjectLimit:
				return `The server can only support up to ${maxObjects} connection${maxObjects != 1 ? "s" : ""}.`
					+ " Please try again later.";

			case ObjectCreateError.AlreadyExists:
				return "A client with your ID already exists in the client manager."
					+ " Please report this bug to the developers.";

			case ObjectCreateError.GenerateID:
				return "Failed to create a unique client ID. Please try again later.";

			default:
				return "Unknown object creation error.";
		}
	}
}

const ClientManager = new _ClientManager (serverConfig.limits.clients);


export default ClientManager;
