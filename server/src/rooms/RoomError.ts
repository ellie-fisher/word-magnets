enum RoomError
{
	Ok,
	Full,
	InvalidInfo,
	InRoom,
	NotInRoom,
	NotFound,
	NotOwner,
}

const getRoomErrorMessage = function ( error: RoomError )
{
	switch ( error )
	{
		case RoomError.Ok:
			return "";

		case RoomError.Full:
			return "The room is full.";

		case RoomError.InvalidInfo:
			return "Invalid room info.";

		case RoomError.InRoom:
			return "You are already in a room.";

		case RoomError.NotInRoom:
			return "You are not in that room.";

		case RoomError.NotFound:
			return "That room does not exist.";

		case RoomError.NotOwner:
			return "You are not the owner of the room.";

		default:
			return "Unknown room error.";
	}
};


export default RoomError;

export { getRoomErrorMessage };
