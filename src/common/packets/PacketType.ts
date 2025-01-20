export enum PacketType
{
	/* [X] */  Invalid,

	// Client => Server:
	/* [X] */  CreateRoom,
	/* [X] */  JoinRoom,
	/* [X] */  LeaveRoom,
	/* [X] */  DestroyRoom,
	/* [X] */  StartGame,
	/* [ ] */  SubmitSentence,
	/* [ ] */  SubmitVote,
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
	/* [ ] */  RoomSentences,
};
