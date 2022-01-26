import React, { Component } from "react";
import { connect } from "react-redux";

import MainMenuTab from "./MainMenuTab";

import CreateRoom from "./createRoom/CreateRoom";
import JoinRoom from "./joinRoom/JoinRoom";

import { AnyObject } from "../../common/util/types";


type MainMenuProps = AnyObject;

class MainMenu extends Component<MainMenuProps>
{
	render ()
	{
		const { props } = this;

		return (
			<div>
				{props.tab === MainMenuTab.CreateRoom ? <CreateRoom /> : <JoinRoom />}
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return {
		tab: state.mainMenu.tab,
	};
};


export default connect (mapStateToProps) (MainMenu);
