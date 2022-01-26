import React, { Component } from "react";
import { connect } from "react-redux";

import { AnyObject } from "../../../common/util/types";


type CreateRoomProps = AnyObject;

class CreateRoom extends Component<CreateRoomProps>
{
	render ()
	{
		const { props } = this;

		return (
			<div>
				CreateRoom
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return {};
};


export default connect (mapStateToProps) (CreateRoom);
