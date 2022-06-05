import React, { Component } from "react";
import { connect } from "react-redux";

import RoomActions from "../general/actionCreators";
import ClientList from "../ClientList";

import { AnyObject } from "../../../common/util/types";


type LobbyPhaseProps = AnyObject;

class LobbyPhase extends Component<LobbyPhaseProps, AnyObject>
{
	constructor ( props )
	{
		super (props);

		this.state =
		{
			startGameClicked: false,
		};
	}

	clickStartGame ()
	{
		this.setState ({ startGameClicked: true });
		this.props.startGame ();
	}

	render ()
	{
		const { props } = this;

		return (
			<div className="center">
				<h1 className="header">Pre-Game Lobby</h1>
				<small>Waiting for room owner to start the game...</small>

				<div style={{ marginTop: "1em" }}>
				{
					props.clientID !== props.ownerID
						? ""
						: <button
							className="magnet"
							onClick={() => this.clickStartGame ()}
							disabled={this.state.startGameClicked}
						>
							Start Game
						</button>
				}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return {
		clientID: state.app.clientID,
		ownerID: state.room.general.info.ownerID,
		clients: state.room.general.clients,
	};
};

const mapDispatchToProps = dispatch =>
{
	return {
		startGame ()
		{
			dispatch (RoomActions.startGame ());
		},
	};
};


export default connect (mapStateToProps, mapDispatchToProps) (LobbyPhase);
