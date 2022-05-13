import React, { Component } from "react";
import { connect } from "react-redux";

import Topbar from "./Topbar";
import LobbyPhase from "./lobby/LobbyPhase";
import CreatePhase from "./create/CreatePhase";
import VotePhase from "./vote/VotePhase";
import ResultsPhase from "./results/ResultsPhase";
import GameEndPhase from "./gameEnd/GameEndPhase";

import RoomPhaseType from "../../common/rooms/phases/RoomPhaseType";
import { AnyObject } from "../../common/util/types";

import "./general/packetHandlers";


type RoomProps = AnyObject;

class Room extends Component<RoomProps>
{
	render ()
	{
		const { props } = this;
		const { phase } = props;

		let view;

		switch ( phase.type )
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

			case RoomPhaseType.Results:
			{
				view = <ResultsPhase />;
				break;
			}

			case RoomPhaseType.GameEnd:
			{
				view = <GameEndPhase />;
				break;
			}

			default:
			{
				view = <div>{`Unknown/Unhandled room phase \`${phase}\``}</div>;
				break;
			}
		}

		return (
			<div>
				<Topbar />
				{view}
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return {
		phase: state.room.general.phase,
	};
};


export default connect (mapStateToProps) (Room);
