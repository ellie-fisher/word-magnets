import AppActions from "../app/actionCreators";
import AppView from "../app/AppView";

import PacketCommand from "../../../common/packets/PacketCommand";
import packetManager from "../packetManager";

import { AnyObject } from "../../../common/util/types";


const requestsMiddleware = store => next => action =>
{
	const state = store.getState ();

	switch ( action.type )
	{
		case "createRoom/createRoom:request":
		{
			const data: AnyObject = {};
			const { createRoom } = state;

			Object.keys (createRoom).forEach (type =>
			{
				const info = createRoom[type];

				data[type] = {};

				Object.keys (info).forEach (key =>
				{
					data[type][key] = info[key].value;
				});
			});

			packetManager.sendRequestPacket (PacketCommand.CreateRoom, data);

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
