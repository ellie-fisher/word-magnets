import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

import Client from "./Client";
import ClientInfo from "./ClientInfo";

import ObjectManager from "../misc/ObjectManager";

import serverConfig from "../config/serverConfig";


class _ClientManager extends ObjectManager<Client>
{
	protected _create ( id: string, socket: WebSocket, info: ClientInfo ): Client
	{
		return new Client (id, socket, info);
	}
}

const ClientManager = new _ClientManager (serverConfig.limits.clients);


export default ClientManager;
