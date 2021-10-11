enum PacketCommand
{
	Error,
	Warning,
	Message,

	RegisterInfo,  // When registering a username.

	CreateRoom,
	JoinRoom,
	LeaveRoom,
	DestroyRoom,

	StartPhase,
	EndPhase,

	KickClient,
	BanClient,  // Unused until actual accounts are supported.

	ChatMessage,  // TODO: Add chat capabilities

	RoomInfo,

	ClientList,
	RoomList,

	SendSentence,
	SentenceList,

	CastVote,
}


export default PacketCommand;
