import RoomPhaseType from "../../common/rooms/phases/RoomPhaseType";
import RoomPhaseState from "../../common/rooms/phases/RoomPhaseState";

import sentenceToString from "../util/sentenceToString";

import { SentenceWord } from "../../common/wordbanks/Sentence";

import { Action } from "../types/redux";
import { IWordbank } from "../types/game";
import { AnyObject } from "../../common/util/types";

import { MAX_SENTENCE_LEN } from "../../common/rooms/constants";


interface RoomState
{
	phase: RoomPhaseType;
	phaseState: RoomPhaseState;
	clients: AnyObject;
	info: AnyObject;
	wordbanks: IWordbank[];
	sentence: SentenceWord[];
};

const initialState =
{
	phase: RoomPhaseType.Lobby,
	phaseState: RoomPhaseState.PreStart,
	clients: {},
	info: {},
	wordbanks: [],
	sentence: [],
	sentenceString: "",
};

const RoomReducer = ( state: RoomState = initialState, action: Action ) =>
{
	switch ( action.type )
	{
		case "room/clientJoinRoom":
		{
			return {
				...state,

				clients:
				{
					...state.clients,
					[action.payload.id]: { ...action.payload },
				},
			};
		}

		case "room/clientLeaveRoom":
		{
			const clients = { ...state.clients };

			delete clients[action.payload];

			return { ...state, clients };
		}

		case "room/clientList":
		{
			const clients = {};

			action.payload.forEach (client =>
			{
				clients[client.id] = { ...client };
			})

			return { ...state, clients };
		}

		case "room/roomInfo":
		{
			return {
				...state,

				info:
				{
					...state.info,
					...action.payload,
				},
			};
		}

		case "room/phaseData":
		{
			return {
				...state,
				phase: action.payload.type,
				phaseState: action.payload.state,
			};
		}

		case "room/sentence/wordbanks":
		{
			return {
				...state,
				wordbanks: action.payload,
			};
		}

		case "room/sentence/addWord":
		{
			const { sentence, wordbanks, clients } = state;
			const sentenceCopy = sentence.slice ();

			sentenceCopy.push (action.payload);

			const sentenceString = sentenceToString (sentenceCopy, wordbanks, clients);

			if ( sentenceString.length > MAX_SENTENCE_LEN )
			{
				return state;
			}

			return {
				...state,
				sentence: sentenceCopy,
				sentenceString,
			};
		}

		case "createRoom/createRoom:request":
		{
			return { ...initialState };
		}
	}

	return state;
};


export default RoomReducer;

export { RoomState };
