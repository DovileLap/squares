import React from 'react';
import { Button } from 'react-bootstrap';
import filesaver from 'file-saver';


class PointsExport extends React.Component {

	export() {
		let rows = this.props.points.map(function(point) {
			return [point.x, point.y].join(' ');		
		});
		let body = rows.join('\n');

		filesaver.saveAs(new Blob([ body ],
	        { type: 'text/plain;charset=utf-8' }),
	        this.props.filename, true);
	}

	render() {
		return (
			<Button class="clear-button points-table-extra-button" 
					bsStyle="success" 
					onClick = { this.export.bind(this) } > 
				<i class="glyphicon glyphicon-export"></i>
			    &nbsp;Export 
			</Button>
		)
	}
}

module.exports = PointsExport;