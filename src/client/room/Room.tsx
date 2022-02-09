import React, { Component } from "react";
import { connect } from "react-redux";

import { RoomState } from "./reducer";
import { AnyObject } from "../../common/util/types";

import "./packetHandlers";


type RoomProps = AnyObject;

class Room extends Component<RoomProps>
{
	render ()
	{
		const { props } = this;

		return (
			<div>
				Room
				<br />
				Phase: {props.phase}
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return {
		phase: state.room.phase,
	};
};


export default connect (mapStateToProps) (Room);
