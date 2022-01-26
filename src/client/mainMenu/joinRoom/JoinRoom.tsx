import React, { Component } from "react";
import { connect } from "react-redux";

import { JoinRoomState } from "./reducer";


type JoinRoomProps = JoinRoomState;

class JoinRoom extends Component<JoinRoomProps>
{
	render ()
	{
		const { props } = this;

		return (
			<div>
				JoinRoom
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return {};
};


export default connect (mapStateToProps) (JoinRoom);
