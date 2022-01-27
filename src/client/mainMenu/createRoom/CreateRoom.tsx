import React, { Component } from "react";
import { connect } from "react-redux";

import Fields from "../../input/Fields";
import CreateRoomActions from "./actionCreators";

import { CreateRoomState } from "./reducer";


type CreateRoomProps = CreateRoomState & typeof CreateRoomActions;

class CreateRoom extends Component<CreateRoomProps>
{
	render ()
	{
		const { props } = this;

		return (
			<div>
				<Fields
					keyPrefix="CreateRoom-roomInfo-field"
					fields={props.roomInfo}
					onChange={( newValue, key, field ) => props.setField ("roomInfo", key, newValue)}
				/>

				<Fields
					keyPrefix="CreateRoom-clientInfo-field"
					fields={props.clientInfo}
					onChange={( newValue, key, field ) => props.setField ("clientInfo", key, newValue)}
				/>
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return {
		roomInfo:
		{
			...state.createRoom.roomInfo,
		},

		clientInfo:
		{
			...state.createRoom.clientInfo,
		},
	};
};

const mapDispatchToProps = dispatch =>
{
	return {
		setField ( type: string, key: string, value: any )
		{
			dispatch (CreateRoomActions.setField (type, key, value));
		},
	};
};


export default connect (mapStateToProps, mapDispatchToProps) (CreateRoom);
