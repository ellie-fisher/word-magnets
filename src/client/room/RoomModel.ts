import IRoomInfo from "../../common/rooms/IRoomInfo";
import RoomPhaseType from "../../common/rooms/phases/RoomPhaseType";
import RoomPhaseState from "../../common/rooms/phases/RoomPhaseState";


const RoomModel =
{
	info: {} as IRoomInfo,
	phaseType: RoomPhaseType.Create,
	phaseState: RoomPhaseState.Ready,
	clients: {},
};


export default RoomModel;
