import React, { FC, ReactElement } from "react";
import { AnyObject } from "../../common/util/types";


type TableProps = AnyObject;

const Table: FC<TableProps> = ( props: TableProps ): ReactElement =>
{
	const { columns = [], rows = [], selected = -1, onClick = () => {} } = props;

	return (
		<table style={{ width: "100%" }} className="keep-white-space">
			<thead>
				<tr className="dashed">
				{
					columns.map (( col, colIndex ) =>
					{
						return <th key={`col-${colIndex}-${col}`}><small>{col}</small></th>;
					})
				}
				</tr>
			</thead>

			<tbody className="dashed bold-border">
			{
				rows.map (( cols, rowIndex ) =>
				{
					const style: AnyObject = {};
					const isSelected = rowIndex === selected;

					if ( isSelected )
					{
						style.backgroundColor = "#61636B";
					}

					return (
						<tr
							key={`row-${rowIndex}-${isSelected}`}
							style={style}
							className={`dashed ${rowIndex === rows.length - 1 ? "last" : ""}`}
						>
						{
							cols.map (( col, colIndex ) =>
							{
								return (
									<td
										key={`row-${rowIndex}-${isSelected}-col-${colIndex}`}
										className={`dashed ${colIndex === cols.length - 1 ? "last" : ""}`}
									>
										{col}
									</td>
								);
							})
						}
						</tr>
					);
				})
			}
			</tbody>
		</table>
	);
};


export default Table;
