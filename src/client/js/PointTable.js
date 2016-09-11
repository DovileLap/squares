import React from 'react';
import ReactDom from 'react-dom';
import { Button } from 'react-bootstrap';
import jQuery from 'jquery';
import $ from 'jquery';
import 'bootstrap'; // react-bootstrap-table needs a separate import
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { validateCoord } from './validators'
import PointsImport from './PointsImport';
import PointsExport from './PointsExport';

/*
	BootstrapTable refuses to have row/collection validation, allows cell-level only.
*/

function pointValidator(value) {
	let response = { 
		isValid: true,
		notification: { 
			type: 'success',
			msg : '',
			title: ''
		}};
	if (!validateCoord(value)) {
		response.isValid = false;
		response.notification.type = 'error';
		response.notification.msg = 'Coordinate has to be an integer between -5000 and 5000.';
		response.notification.title = 'Invalid Value';
	}
	return response;
}

class PointTable extends React.Component {

	constructor(props) {
		super(props);
		this.points = props.points;
		this.state = {
			points: props.points,
			currentPage: 1,
			sizePerPage: 20,
		};
	}

	componentWillReceiveProps(props){
		this.points = props.points;
	    this.setState({
	    	points: props.points
	   	});
	   	this.resetPage();
	}

	componentDidMount() {
	    let el = ReactDom.findDOMNode(this);
	    
	    let toolbar = jQuery(el).find('.react-bs-table-tool-bar > div > div:first-child');
	    // Change bootstrap classes on table toolbar
	    toolbar.attr('class', 'col-xs-12 col-sm-12 col-md-12 col-lg-12');

	    let buttons = jQuery(el).find('.points-table-extra-button');
	    // Add Extra buttons 
	    buttons.detach();
	    toolbar.find('.btn-group').append(buttons);
	}

	onPageChange(page, sizePerPage) {
		const currentIndex = (page - 1) * sizePerPage;
	    this.setState({
	      points: this.points.slice(currentIndex, currentIndex + sizePerPage),
	      currentPage: page
	    });
	}

	onSizePerPageList(sizePerPage) {
	    const currentIndex = (this.state.currentPage - 1) * sizePerPage;
	    this.setState({
	      points: this.points.slice(currentIndex, currentIndex + sizePerPage),
	      sizePerPage: sizePerPage
	    });
	  }

	resetPage() {
		const currentIndex = (this.state.currentPage - 1) * this.state.sizePerPage;
	    this.setState({
	      points: this.points.slice(currentIndex, currentIndex + this.state.sizePerPage)
	    });
	}

	onDeleteRows(rowids) {
		// Multiple selected
		if (Array.isArray(rowids)) {
			rowids.map(function(id) {
				this.deleteRow(id);
			}, this);

		//single selected
		} else {
			this.deleteRow(rowids);
		}
		this.resetPage();
	}

	deleteRow(id) {
		let point = this.state.points.find(function(point) {
			return point.id == id;
		})
		if (point) {
			this.props.onDeleteRow(point);
		}
	}

	onAddRow(row) {
		this.props.onAddRow(row);
		this.resetPage();
	}

	export() {
		return this.points;
	}

	render() {
		var options = {
			sizePerPageList: [5, 10, 20, 50],
			sizePerPage: this.state.sizePerPage,
			page: this.state.currentPage,
			onDeleteRow: this.onDeleteRows.bind(this),
			onAddRow: this.onAddRow.bind(this),
			onPageChange: this.onPageChange.bind(this),
			onSizePerPageList: this.onSizePerPageList.bind(this),
			paginationShowsTotal: true,
			handleConfirmDeleteRow: (next) => { next(); } 
		}
		return (
			<div>
				<h3>Points</h3>
				<BootstrapTable 
					data={this.state.points} 
					remote 
					selectRow={ { mode: 'checkbox' } }
					keyField="id" 
					striped  
					hover 
					pagination 
					insertRow 
					deleteRow 
					options={options} 
					fetchInfo={ { dataTotalSize: this.points.length } }
					>
			      <TableHeaderColumn dataField="x" dataSort editable={ {validator: pointValidator} }>X</TableHeaderColumn>
			      <TableHeaderColumn dataField="y" dataSort editable={ {validator: pointValidator} }>Y</TableHeaderColumn>
			    </BootstrapTable>
			    {/* All buttons with .points-table-extra-button will be moved to toolbar of the table on componentDidMount.
			    Unfortunately the component itself lacks flexibility in buttons. */}
			    
			    <Button class="clear-button points-table-extra-button" 
						bsStyle="danger" 
						onClick = { this.props.clearAll } > 
					<i class="glyphicon glyphicon-trash"></i>
				    &nbsp;Clear all 
				</Button>
				<PointsImport  
					addPoints={ this.props.addPoints }
					validator={ this.props.validator } 
					handleMessages={ this.props.handleMessages } 
					limit = { this.props.limit } 
					btnClass = "points-table-extra-button" />
				<PointsExport 
			    	points={ this.points } 
			    	filename="points.txt"
			    />
			</div>
		)
	}
}

PointTable.defaultProps = {
    points: []
};

module.exports = PointTable;