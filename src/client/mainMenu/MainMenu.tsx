import React, { Component } from "react";
import { connect } from "react-redux";

import MainMenuTab from "./MainMenuTab";

import CreateRoom from "./createRoom/CreateRoom";
import JoinRoom from "./joinRoom/JoinRoom";

import MainMenuActions from "./actionCreators";

import { MainMenuState } from "./reducer";
import { AnyObject } from "../../common/util/types";


type MainMenuProps = AnyObject;

class MainMenu extends Component<MainMenuProps>
{
	render ()
	{
		const { props } = this;

		const isCreateSelected = props.tab === MainMenuTab.CreateRoom;
		const isJoinSelected = props.tab === MainMenuTab.JoinRoom;

		return (
			<div className="center">
				<div>
					<button
						className={`dashed-tab ${isCreateSelected ? "dashed-tab-selected" : "dashed-tab-left"}`}
						onClick={event => props.selectTab (MainMenuTab.CreateRoom)}
					>
						Create Room
					</button>

					<button
						className={`dashed-tab ${isJoinSelected ? "dashed-tab-selected" : "dashed-tab-right"}`}
						onClick={event => props.selectTab (MainMenuTab.JoinRoom)}
					>
						Join Room
					</button>
				</div>

				<div>
					{isCreateSelected ? <CreateRoom /> : <JoinRoom />}
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
