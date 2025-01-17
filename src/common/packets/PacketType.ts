export enum PacketType
{
	/* [ ] */  Invalid,

	// Client => Server:
	/* [ ] */  CreateRoom,
	/* [ ] */  JoinRoom,
	/* [ ] */  LeaveRoom,
	/* [ ] */  DestroyRoom,
	/* [ ] */  StartGame,
	/* [ ] */  SubmitSentence,
	/* [ ] */  SubmitVote,
	/* [ ] */  RemoveClient,

	// Server => Client:
	/* [ ] */  ClientID,
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
