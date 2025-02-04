export enum PacketType
{
	/* [X] */  Invalid,

	// Client => Server:
	/* [X] */  CreateRoom,
	/* [X] */  DestroyRoom,
	/* [X] */  JoinRoom,
	/* [X] */  LeaveRoom,
	/* [X] */  StartGame,
	/* [X] */  SubmitSentence,
	/* [X] */  SubmitVote,
	/* [X] */  RemoveClient,

	// Server => Client:
	/* [X] */  ClientID,
	/* [X] */  CreateRoomRejected,
	/* [X] */  JoinRoomRejected,
	/* [X] */  ClientJoin,
	/* [X] */  ClientLeave,
	/* [X] */  RoomData,
	/* [X] */  RoomDestroyed,
	/* [ ] */  RoomStateEnter,
	/* [ ] */  RoomStateLeave,
	/* [X] */  RoomWords,
	/* [X] */  RoomSentences,
};
