import React, { Component } from "react";
import { connect } from "react-redux";

import Table from "../Table";
import RoomActions from "../actionCreators";
import ClientList from "../ClientList";

import sentenceToString from "../../util/sentenceToString";

import { RoomState } from "../reducer";
import { AnyObject } from "../../../common/util/types";


type GameEndProps = AnyObject;

class GameEnd extends Component<GameEndProps, AnyObject>
{
	render ()
	{
		const rows = this.props.finalScores.map (data => [data.name, data.score]);

		rows.sort (( a, b ) => b[1] - a[1]);

		return (
			<div>
				<h1>Final Scores</h1>
			{
				rows.length <= 0
					? "No players to show, somehow...?"
					: <Table
						columns={["Player", "Score"]}
						rows={rows}
					/>
			}
			</div>
		);
	}
}

const mapStateToProps = state =>
{
	return { finalScores: state.room.finalScores };
};


export default connect (mapStateToProps) (GameEnd);
