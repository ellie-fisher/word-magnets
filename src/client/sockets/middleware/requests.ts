import AppActions from "../../app/actionCreators";
import AppView from "../../app/AppView";

import PacketCommand from "../../../common/packets/PacketCommand";
import packetManager from "../packetManager";

import { AnyObject } from "../../../common/util/types";


// TODO: Move these to separate middleware in their respective folders.

const requestsMiddleware = store => next => action =>
{
	const state = store.getState ();

	switch ( action.type )
	{
		case "createRoom/createRoom:request":
		{
			const data: AnyObject = {};
			const { info } = state.mainMenu;

			Object.keys (info).forEach (type =>
			{
				data[type] = {};

				Object.keys (info[type]).forEach (key =>
				{
					data[type][key] = info[type][key].value;
				});
			});

			packetManager.sendRequestPacket (PacketCommand.CreateRoom, data);
			break;
		}

		case "joinRoom/joinRoom:request":
		{
			const clientInfo: AnyObject = {};
			const { info } = state.mainMenu;

			Object.keys (info.clientInfo).forEach (key =>
			{
				clientInfo[key] = info.clientInfo[key].value;
			});

			packetManager.sendRequestPacket (PacketCommand.JoinRoom, { roomID: action.payload, clientInfo });
			break;
		}

		default:
		{
			break;
		}
	}

	next (action);
};


export default requestsMiddleware;
