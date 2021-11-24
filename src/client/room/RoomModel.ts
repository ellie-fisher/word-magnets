import IRoomInfo from "../../common/rooms/IRoomInfo";
import RoomPhaseType from "../../common/rooms/phases/RoomPhaseType";


const RoomModel =
{
	info: {} as IRoomInfo,
	phase: RoomPhaseType.Create,
	isPhaseEnd: false,
};


export default RoomModel;
