import RoomPhaseType from "../../common/rooms/phases/RoomPhaseType";
import RoomPhaseState from "../../common/rooms/phases/RoomPhaseState";

import { IRoomPublicData } from "../../common/rooms/IRoomInfo";


const RoomModel =
{
	info: {} as IRoomPublicData,
	phaseType: RoomPhaseType.Create,
	phaseState: RoomPhaseState.Ready,
	clients: {},
};


export default RoomModel;
