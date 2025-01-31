export enum PacketType
{
	/* [X] */  Invalid,

	// Client => Server:
	/* [X] */  CreateRoom,
	/* [X] */  JoinRoom,
	/* [X] */  LeaveRoom,
	/* [X] */  DestroyRoom,
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
	/* [ ] */  RoomWords,
	/* [ ] */  RoomSentences,
};
