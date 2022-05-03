import React, { Component } from "react";
import { connect } from "react-redux";

import Wordbank from "./Wordbank";

import RoomPhaseState from "../../../common/rooms/phases/RoomPhaseState";

import RoomActions from "../actionCreators";
import ClientList from "../ClientList";

import sentenceToString from "../../util/sentenceToString";

import { RoomState } from "../reducer";
import { AnyObject } from "../../../common/util/types";


type CreatePhaseProps = AnyObject;

class CreatePhase extends Component<CreatePhaseProps, AnyObject>
{
	constructor ( props )
	{
		super (props);
	}

	render ()
	{
		const { props } = this;
		const { clients, wordbanks } = props;

		const playerWordbank =
		{
			displayName: "Players",
			words: Object.keys (clients).map (id => clients[id]),
		};

		return (
			<div>
				<Wordbank
					wordbank={playerWordbank}
					isName={true}
					onClick={( client: AnyObject ) => props.addWord (-1, client.id, true)}
					disabled={props.phaseState === RoomPhaseState.End}
				/>

			{
				wordbanks.map (( wordbank, index ) =>
				{
					return <Wordbank
						key={`wordbank-${wordbank.displayName}-${index}`}
						wordbank={wordbank}
						onClick={( word: string, wordIndex: number ) => props.addWord (index, wordIndex, false)}
						disabled={props.phaseState === RoomPhaseState.End}
					/>
				})
			}

			<hr />

				<div>
					{props.sentenceString}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return {
		phaseState: state.room.phaseState,
		clients: state.room.clients,
		wordbanks: state.room.wordbanks,
		sentence: state.room.sentence,
		sentenceString: state.room.sentenceString,
	};
};

const mapDispatchToProps = dispatch =>
{
	return {
		addWord ( wordbank: number, word: number | string, isName: boolean = false )
		{
			const wordData = { word, isName } as any;

			if ( wordbank >= 0 )
			{
				wordData.wordbank = wordbank;
			}

			dispatch (RoomActions.addWord (wordData));
		},
	};
};


export default connect (mapStateToProps, mapDispatchToProps) (CreatePhase);
