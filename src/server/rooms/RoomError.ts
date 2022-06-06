enum RoomError
{
	Ok,
	Full,
	InvalidInfo,
	DuplicateName,
	InRoom,
	NotInRoom,
	NotFound,
	NotOwner,
	ClientNotFound,
	KickOwner,
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

		case RoomError.DuplicateName:
			return "A player in the room already has that name.";

		case RoomError.InRoom:
			return "You are already in a room.";

		case RoomError.NotInRoom:
			return "You are not in that room.";

		case RoomError.NotFound:
			return "Room does not exist.";

		case RoomError.NotOwner:
			return "You are not the owner of the room.";

		case RoomError.ClientNotFound:
			return "Player not found.";

		case RoomError.KickOwner:
			return "You cannot kick the owner of the room.";

		default:
			return "Unknown room error.";
	}
};


export default RoomError;

export { getRoomErrorMessage };
