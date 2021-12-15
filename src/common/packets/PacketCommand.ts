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

	PhaseData,

	KickClient,
	BanClient,  // Unused until actual accounts are supported.

	ChatMessage,  // TODO: Add chat capabilities

	RoomInfo,

	ClientList,
	RoomList,

	Wordbanks,
	SendSentence,
	SentenceList,

	CastVote,
	SentenceScores,
}


export default PacketCommand;
