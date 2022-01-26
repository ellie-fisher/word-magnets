import React, { Component } from "react";
import { connect } from "react-redux";

import MainMenuTab from "./MainMenuTab";

import CreateRoom from "./createRoom/CreateRoom";
import JoinRoom from "./joinRoom/JoinRoom";

import MainMenuActions from "./actionCreators";

import { MainMenuState } from "./reducer";


type MainMenuProps = MainMenuState & typeof MainMenuActions;

class MainMenu extends Component<MainMenuProps>
{
	render ()
	{
		const { props } = this;

		return (
			<div>
				<div>
					<button onClick={( event ) => props.selectTab (MainMenuTab.CreateRoom)}>
						Create Room
					</button>

					<button onClick={( event ) => props.selectTab (MainMenuTab.JoinRoom)}>
						Join Room
					</button>
				</div>

				<hr />

				<div>
					{props.tab === MainMenuTab.CreateRoom ? <CreateRoom /> : <JoinRoom />}
				</div>
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

const mapDispatchToProps = dispatch =>
{
	return {
		selectTab ( tab: MainMenuTab )
		{
			dispatch (MainMenuActions.selectTab (tab));
		},
	};
};


export default connect (mapStateToProps, mapDispatchToProps) (MainMenu);
