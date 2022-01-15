enum PacketCommand
{
	Error,
	Warning,
	Message,

	ClientConnected,

	CreateRoom,
	JoinRoom,
	LeaveRoom,
	DestroyRoom,

	StartGame,

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
	FinalScores,
}


export default PacketCommand;
