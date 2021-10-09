enum PacketCommand
{
	Error,
	Warning,
	Message,

	RegisterInfo,  // When registering a username.

	CreateRoom,
	JoinRoom,
	LeaveRoom,
	DeleteRoom,

	StartPhase,
	EndPhase,

	KickClient,
	BanClient,  // Unused until actual accounts are supported.

	RoomInfo,

	ClientList,
	RoomList,

	SendSentence,
	SentenceList,

	CastVote,
}


export default PacketCommand;
