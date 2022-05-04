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

		const roomIDFields =
		{
			roomID:
			{
				type: "string",
				displayName: "Room ID",
			},
		};

		return (
			<div>
				<Fields
					keyPrefix="JoinRoom-roomID-field"
					fields={roomIDFields}
					error=""
					onChange={newValue => this.setRoomID (newValue)}
				/>

				<Fields
					keyPrefix="JoinRoom-clientInfo-field"
					fields={props.info.clientInfo}
					error={props.error}
					onChange={( newValue, key, field ) => props.setField ("clientInfo", key, newValue)}
				/>

				{props.error !== "" ? <strong>{props.error}</strong> : ""}

				<hr />

				<button className="magnet" onClick={() => props.joinRoom (this.state.roomID)}>
					Join
				</button>
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return {
		info: { ...state.mainMenu.info },
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
