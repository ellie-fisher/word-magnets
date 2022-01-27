import React, { Component } from "react";
import { connect } from "react-redux";

import Fields from "../../input/Fields";
import CreateRoomActions from "./actionCreators";

import { CreateRoomState } from "./reducer";


type CreateRoomProps = { roomInfo: CreateRoomState } & typeof CreateRoomActions;

class CreateRoom extends Component<CreateRoomProps>
{
	render ()
	{
		const { props } = this;

		return (
			<div>
				<Fields
					keyPrefix="CreateRoom-field"
					fields={props.roomInfo}
					onChange={( event, key, field ) => props.setField (key, event.target.value)}
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
			...state.createRoom.roomInfo
		},
	};
};

const mapDispatchToProps = dispatch =>
{
	return {
		setField ( key: string, value: any )
		{
			dispatch (CreateRoomActions.setField (key, value));
		},
	};
};


export default connect (mapStateToProps, mapDispatchToProps) (CreateRoom);
