import React, { Component } from "react";
import { connect } from "react-redux";

import Table from "../Table";

import RoomPhaseState from "../../../common/rooms/phases/RoomPhaseState";
import VotePhaseActions from "./actionCreators";

import { AnyObject } from "../../../common/util/types";

import "./packetHandlers";


type VotePhaseProps = AnyObject;

class VotePhase extends Component<VotePhaseProps, AnyObject>
{
	render ()
	{
		const { props } = this;

		const selected = props.sentences.findIndex (sentence => sentence.voteID === props.voteID);

		return (
			<div style={{ width: "100%" }} className="center">
			{
				props.sentences.length <= 0
					? "No sentences to vote for!"
					: <Table
						columns={["Sentence"]}
						rows={props.sentences.map (sentence => [sentence.value])}
						selected={selected}
						onClick={index => props.setVote (props.sentences[index].voteID)}
					/>
			}
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return {
		phase: state.room.general.phase,
		sentences: state.room.vote.sentences,
		voteID: state.room.vote.voteID,
	};
};

const mapDispatchToProps = dispatch =>
{
	return {
		setVote ( voteID: number )
		{
			dispatch (VotePhaseActions.setVote (voteID));
		},
	};
};


export default connect (mapStateToProps, mapDispatchToProps) (VotePhase);

