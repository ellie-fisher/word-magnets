export enum PacketType
{
	/* [X] */  Invalid,

	// Client => Server:
	/* [X] */  CreateRoom,
	/* [ ] */  JoinRoom,
	/* [ ] */  LeaveRoom,
	/* [ ] */  DestroyRoom,
	/* [ ] */  StartGame,
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
