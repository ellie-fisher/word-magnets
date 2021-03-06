import React, { Component } from "react";
import { connect } from "react-redux";

import Fields from "../../input/Fields";

import CreateRoomActions from "./actionCreators";
import MainMenuActions from "../actionCreators";

import has from "../../../common/util/has";

import { AnyObject } from "../../../common/util/types";

import "./packetHandlers";


type CreateRoomProps = AnyObject;

class CreateRoom extends Component<CreateRoomProps>
{
	render ()
	{
		const { props } = this;
		const { error } = props;

		let errorWhich = "none";
		let errorData = "";

		if ( error !== "" )
		{
			if ( typeof error === "string" )
			{
				errorWhich = "all";
				errorData = error;
			}
			else if ( Array.isArray (error) )
			{
				errorWhich = "all";
				errorData = error[0];
			}
			else if ( typeof error === "object" && error !== null )
			{
				errorWhich = error.which;
				errorData = error.validation;
			}
		}

		return (
			<div className="center">
				<Fields
					keyPrefix="CreateRoom-roomInfo-field"
					fields={props.info.roomInfo}
					error={errorWhich === "roomInfo" ? errorData : ""}
					onChange={( newValue, key, field ) => props.setField ("roomInfo", key, newValue)}
				/>

				<Fields
					keyPrefix="CreateRoom-clientInfo-field"
					fields={props.info.clientInfo}
					error={errorWhich === "clientInfo" ? errorData : ""}
					onChange={( newValue, key, field ) => props.setField ("clientInfo", key, newValue)}
				/>

				{errorWhich === "all" ? <strong>{errorData}</strong> : ""}

				<button style={{ float: "left" }} className="magnet" onClick={props.createRoom}>
					Create Room
				</button>
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return {
		info: { ...state.mainMenu.info },
		error: { ...state.createRoom.error },
	};
};

const mapDispatchToProps = dispatch =>
{
	return {
		setField ( type: string, key: string, value: any )
		{
			dispatch (MainMenuActions.setField (type, key, value));
		},

		createRoom ()
		{
			dispatch (CreateRoomActions.createRoomRequest ());
		},
	};
};


export default connect (mapStateToProps, mapDispatchToProps) (CreateRoom);
