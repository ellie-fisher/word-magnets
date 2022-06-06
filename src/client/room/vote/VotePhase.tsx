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

		let content: any = "No sentences to vote for!";

		if ( props.phase.state === RoomPhaseState.End )
		{
			content = "Please wait...";
		}
		else if ( props.sentences.length > 0 )
		{
			content = <Table
				columns={["Sentence"]}
				rows={props.sentences.map (sentence => [sentence.value])}
				selected={props.sentences.findIndex (sentence => sentence.voteID === props.voteID)}
				onClick={index => props.setVote (props.sentences[index].voteID)}
			/>;
		}

		return <div style={{ width: "100%" }} className="center">{content}</div>;
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

