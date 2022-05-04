import RoomPhaseType from "../../../common/rooms/phases/RoomPhaseType";
import RoomPhaseState from "../../../common/rooms/phases/RoomPhaseState";

import AppActions from "../../app/actionCreators";
import AppView from "../../app/AppView";
import RoomActions from "./actionCreators";

import PacketCommand from "../../../common/packets/PacketCommand";
import packetManager from "../../sockets/packetManager";


const roomMiddleware = store => next => action =>
{
	next (action);

	const state = store.getState ();

	switch ( action.type )
	{
		case "room/leaveRoom":
		{
			packetManager.sendDataPacket (PacketCommand.LeaveRoom);
			break;
		}

		case "room/startGame":
		{
			packetManager.sendRequestPacket (PacketCommand.StartGame);
			break;
		}

		case "room/phaseData":
		{
			const { payload } = action;

			switch ( payload.type )
			{
				case RoomPhaseType.Create:
				{
					if ( payload.state === RoomPhaseState.PreStart )
					{
						store.dispatch (RoomActions.newRound ());
					}
					else if ( payload.state === RoomPhaseState.End )
					{
						packetManager.sendRequestPacket (PacketCommand.SendSentence, state.room.create.sentence);
					}

					break;
				}

				case RoomPhaseType.Vote:
				{
					if ( payload.state === RoomPhaseState.End )
					{
						packetManager.sendRequestPacket (PacketCommand.CastVote, state.room.vote.voteID);
					}

					break;
				}
			}

			break;
		}

		default:
		{
			break;
		}
	}
};


export default roomMiddleware;
