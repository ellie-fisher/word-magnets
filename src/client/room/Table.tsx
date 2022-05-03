import React, { FC, ReactElement } from "react";
import { AnyObject } from "../../common/util/types";


type TableProps = AnyObject;

const Table: FC<TableProps> = ( props: TableProps ): ReactElement =>
{
	const { columns = [], rows = [], selected = -1, onClick = () => {} } = props;

	return (
		<table>
			<thead>
				<tr>{columns.map (( col, colIndex ) => <th key={`col-${colIndex}-${col}`}>{col}</th>)}</tr>
			</thead>
			<tbody>
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
						<tr key={`row-${rowIndex}-${isSelected}`} style={style}>
						{
							cols.map (( col, colIndex ) =>
							{
								return (
									<td key={`row-${rowIndex}-${isSelected}-col-${colIndex}`}>
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
