import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

import Client from "./Client";
import ClientInfo from "./ClientInfo";

import ObjectManager from "../misc/ObjectManager";


const DEFAULT_MAX_CLIENTS = 300;

class _ClientManager extends ObjectManager<Client>
{
	protected _create ( id: string, socket: WebSocket, info: ClientInfo ): Client
	{
		return new Client (id, socket, info);
	}
}

const ClientManager = new _ClientManager (DEFAULT_MAX_CLIENTS);


export default ClientManager;

export { DEFAULT_MAX_CLIENTS };
