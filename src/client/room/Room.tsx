import React, { Component } from "react";
import { connect } from "react-redux";

import RoomActions from "./actionCreators";
import LobbyPhase from "./lobby/LobbyPhase";
import CreatePhase from "./create/CreatePhase";
import VotePhase from "./vote/VotePhase";

import RoomPhaseType from "../../common/rooms/phases/RoomPhaseType";

import { RoomState } from "./reducer";
import { AnyObject } from "../../common/util/types";

import "./packetHandlers";


type RoomProps = AnyObject;

class Room extends Component<RoomProps>
{
	render ()
	{
		const { props } = this;
		const { info } = props;

		const headerStyle = { padding: "1vw" };

		let view;

		switch ( props.phase )
		{
			case RoomPhaseType.Lobby:
			{
				view = <LobbyPhase />;
				break;
			}

			case RoomPhaseType.Create:
			{
				view = <CreatePhase />;
				break;
			}

			case RoomPhaseType.Vote:
			{
				view = <VotePhase />;
				break;
			}

			default:
			{
				view = <div>Unknown/Unhandled room phase</div>;
				break;
			}
		}

		return (
			<div>
				<button onClick={() => props.clickBack ()}>{"<< Leave Room"}</button>

				<span style={headerStyle}>Time Left: {info.timeLeft}</span>
				<span style={headerStyle}>Round: {info.currentRound} of {info.maxRounds}</span>

				<span style={headerStyle}>
					<strong>ID: </strong>

					<span style={{ fontFamily: "monospace", fontSize: "1vw" }}>
						{info.id}
					</span>
				</span>

				<hr />

				{view}
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return {
		info: state.room.info,
		phase: state.room.phase,
	};
};

const mapDispatchToProps = dispatch =>
{
	return {
		clickBack ()
		{
			dispatch (RoomActions.leaveRoom ());
		},
	};
};


export default connect (mapStateToProps, mapDispatchToProps) (Room);
