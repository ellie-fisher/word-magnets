import React, { Component } from "react";
import { connect } from "react-redux";

import Table from "../Table";
import RoomActions from "../actionCreators";
import ClientList from "../ClientList";

import sentenceToString from "../../util/sentenceToString";

import { RoomState } from "../reducer";
import { AnyObject } from "../../../common/util/types";


type ResultsPhaseProps = AnyObject;

class ResultsPhase extends Component<ResultsPhaseProps, AnyObject>
{
	render ()
	{
		const { props } = this;
		const { nameCache, sentences } = props.sentenceScores;

		const rows = [];

		Object.keys (sentences).forEach (clientID =>
		{
			const sentence = sentences[clientID];

			rows.push ([nameCache[clientID], sentence.votes, sentence.value]);
		});

		rows.sort (( a, b ) => b[1] - a[1]);

		return (
			<div>
			{
				rows.length <= 0
					? "No results to show!"
					: <Table
						columns={["Author", "Votes", "Sentence"]}
						rows={rows}
					/>
			}
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return {
		sentenceScores: state.room.sentenceScores,
	};
};

const mapDispatchToProps = dispatch =>
{
	return {
		setVote ( voteID: number )
		{
			dispatch (RoomActions.setVote (voteID));
		},
	};
};


export default connect (mapStateToProps, mapDispatchToProps) (ResultsPhase);
