import React, { Component } from "react";
import { connect } from "react-redux";

import Wordbank from "./Wordbank";

import RoomPhaseState from "../../../common/rooms/phases/RoomPhaseState";

import CreatePhaseActions from "./actionCreators";
import ClientList from "../ClientList";

import sentenceToString from "../../util/sentenceToString";

import { AnyObject } from "../../../common/util/types";

import "./packetHandlers";


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
		const { sentence, clients, wordbanks } = props;

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
					disabled={props.phase.state === RoomPhaseState.End}
				/>

			{
				wordbanks.map (( wordbank, index ) =>
				{
					return <Wordbank
						key={`wordbank-${wordbank.displayName}-${index}`}
						wordbank={wordbank}
						onClick={( word: string, wordIndex: number ) => props.addWord (index, wordIndex, false)}
						disabled={props.phase.state === RoomPhaseState.End}
					/>
				})
			}

				<div>
					{sentenceToString (sentence, wordbanks, clients)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return {
		phase: state.room.general.phase,
		clients: state.room.general.clients,
		wordbanks: state.room.create.wordbanks,
		sentence: state.room.create.sentence,
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

			dispatch (CreatePhaseActions.addWord (wordData));
		},
	};
};


export default connect (mapStateToProps, mapDispatchToProps) (CreatePhase);
