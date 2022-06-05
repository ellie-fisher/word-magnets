import React, { Component } from "react";
import { connect } from "react-redux";

import RoomActions from "./general/actionCreators";

import { AnyObject } from "../../common/util/types";


type TopbarProps = AnyObject;

class Topbar extends Component<TopbarProps>
{
	render ()
	{
		const { props } = this;
		const { info } = props;

		const headerStyle = { padding: "1em" };

		return (
			<div className="topbar">
				<button className="dashed btn orange" onClick={() => props.clickBack ()}>
					{"<< Leave Room"}
				</button>

				<span style={headerStyle}>Time Left: {info.timeLeft}</span>
				<span style={headerStyle}>Round: {info.currentRound} of {info.maxRounds}</span>

				<span style={headerStyle}>
					<strong>ID: </strong>

					<span style={{ fontFamily: "monospace", userSelect: "text" }}>
						{info.id}
					</span>
				</span>
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return {
		info: state.room.general.info,
	};
};

const mapDispatchToProps = dispatch =>
{
	return {
		clickBack ()
		{
			dispatch (RoomActions.leaveRoom ());
		},
	};
};


export default connect (mapStateToProps, mapDispatchToProps) (Topbar);
