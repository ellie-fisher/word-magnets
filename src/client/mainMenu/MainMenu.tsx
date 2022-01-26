import React, { Component } from "react";

import { connect } from "react-redux";

import { CreateRoomState } from "./reducers/createRoom";


type MainMenuProps = CreateRoomState;


class MainMenu extends Component<MainMenuProps>
{
	render ()
	{
		return <div>MainMenu</div>;
	}
}

const mapStateToProps = state =>
{
	return {};
};


export default connect (mapStateToProps) (MainMenu);
