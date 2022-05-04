import React, { Component } from "react";
import { connect } from "react-redux";

import Fields from "../../input/Fields";

import JoinRoomActions from "./actionCreators";
import MainMenuActions from "../actionCreators";

import { JoinRoomState } from "./reducer";
import { AnyObject } from "../../../common/util/types";

import "./packetHandlers";

type JoinRoomProps = AnyObject;

class JoinRoom extends Component<JoinRoomProps, AnyObject>
{
	constructor ( props )
	{
		super (props);

		this.state =
		{
			roomID: "",
			name: "",
		};
	}

	setRoomID ( roomID: string )
	{
		this.setState ({ roomID });
	}

	render ()
	{
		const { props } = this;

		return (
			<div>
				Room ID:

				<input
					type="text"
					value={this.state.roomID}
					onChange={event => this.setRoomID (event.target.value)}
				/>

				<br />

				<Fields
					keyPrefix="JoinRoom-clientInfo-field"
					fields={props.clientInfo}
					error={props.error}
					onChange={( newValue, key, field ) => props.setField ("clientInfo", key, newValue)}
				/>

				{props.error !== "" ? <strong>{props.error}</strong> : ""}

				<hr />

				<button onClick={() => props.joinRoom (this.state.roomID)}>
					Join
				</button>
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return {
		clientInfo: { ...state.mainMenu.clientInfo },
		error: state.joinRoom.error,
	};
};

const mapDispatchToProps = dispatch =>
{
	return {
		setField ( type: string, key: string, value: any )
		{
			dispatch (MainMenuActions.setField (type, key, value));
		},

		joinRoom ( roomID: string )
		{
			dispatch (JoinRoomActions.joinRoomRequest (roomID));
		},
	};
};


export default connect (mapStateToProps, mapDispatchToProps) (JoinRoom);
