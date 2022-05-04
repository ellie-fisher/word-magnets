import React, { Component } from "react";
import { connect } from "react-redux";

import AppActions from "../app/actionCreators";
import AppView from "../app/AppView";

import { AnyObject } from "../../common/util/types";


type RoomDestroyedProps = AnyObject;

class RoomDestroyed extends Component<RoomDestroyedProps>
{
	render ()
	{
		const { props } = this;

		return (
			<div>
				<h1>Room Closed</h1>
				<p>{props.reason}</p>

				<button onClick={props.clickOK}>
					OK
				</button>
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return {
		reason: state.room.general.destroyMessage,
	};
};

const mapDispatchToProps = dispatch =>
{
	return {
		clickOK ()
		{
			dispatch (AppActions.setView (AppView.MainMenu));
		},
	};
};


export default connect (mapStateToProps, mapDispatchToProps) (RoomDestroyed);
