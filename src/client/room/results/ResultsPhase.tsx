import React, { Component } from "react";
import { connect } from "react-redux";

import Table from "../Table";

import { AnyObject } from "../../../common/util/types";

import "./packetHandlers";


type ResultsPhaseProps = AnyObject;

class ResultsPhase extends Component<ResultsPhaseProps, AnyObject>
{
	render ()
	{
		const { props } = this;
		const { nameCache, sentences } = props.sentences;

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
					? "No sentences were created."
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
	return { sentences: state.room.results.sentences };
};


export default connect (mapStateToProps) (ResultsPhase);
