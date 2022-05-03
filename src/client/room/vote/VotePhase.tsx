import React, { Component } from "react";
import { connect } from "react-redux";

import Table from "../Table";
import RoomActions from "../actionCreators";
import ClientList from "../ClientList";

import sentenceToString from "../../util/sentenceToString";

import { RoomState } from "../reducer";
import { AnyObject } from "../../../common/util/types";


type VotePhaseProps = AnyObject;

class VotePhase extends Component<VotePhaseProps, AnyObject>
{
	render ()
	{
		const { props } = this;

		const selected = props.sentenceList.findIndex (sentence => sentence.voteID === props.voteID);

		return (
			<div>
			{
				props.sentenceList.length <= 0
					? "No sentences to vote for!"
					: <Table
						columns={["", "Sentence"]}
						rows=
						{
							props.sentenceList.map (sentence =>
							[
								<button
									key={`player-sentence-btn-${sentence.voteID}`}
									onClick={() => props.setVote (sentence.voteID)}
								>
									Vote
								</button>,
								sentence.value
							])
						}
						selected={selected}
					/>
			}
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return {
		sentenceList: state.room.sentenceList,
		voteID: state.room.voteID,
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


export default connect (mapStateToProps, mapDispatchToProps) (VotePhase);

