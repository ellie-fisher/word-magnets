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
	/* [ ] */  RemoveClient,

	// Server => Client:
	/* [X] */  ClientID,
	/* [ ] */  CreateRoomRejected,
	/* [ ] */  JoinRoomRejected,
	/* [ ] */  ClientJoin,
	/* [ ] */  ClientLeave,
	/* [ ] */  RoomData,
	/* [ ] */  RoomDestroyed,
	/* [ ] */  RoomStateEnter,
	/* [ ] */  RoomStateLeave,
	/* [ ] */  RoomWords,
	/* [ ] */  RoomSentences,
};
