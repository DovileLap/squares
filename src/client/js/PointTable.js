import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { validateCoord } from './validators'

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

	onDeleteRow(rowids) {
		if (Array.isArray(rowids)) {
			rowids.map(function(id) {
				this.props.onDeleteRow(id);
			}, this);
		} else {
			this.props.onDeleteRow(rowids);
		}
		this.resetPage();
	}

	onAddRow(row) {
		this.props.onAddRow(row);
		this.resetPage();
	}

	render() {
		var options = {
			sizePerPageList: [5, 10, 20, 50],
			sizePerPage: this.state.sizePerPage,
			page: this.state.currentPage,
			onDeleteRow: this.onDeleteRow.bind(this),
			onAddRow: this.onAddRow.bind(this),
			onPageChange: this.onPageChange.bind(this),
			onSizePerPageList: this.onSizePerPageList.bind(this),
			paginationShowsTotal: true
		}
		return (
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
				exportCSV 
				csvFileName="points.txt" 
				options={options} 
				fetchInfo={ { dataTotalSize: this.points.length } }
				handleConfirmDeleteRow={ (next) => { next(); } }>
		      <TableHeaderColumn dataField="x" dataSort editable={ {validator: pointValidator} }>X</TableHeaderColumn>
		      <TableHeaderColumn dataField="y" dataSort editable={ {validator: pointValidator} }>Y</TableHeaderColumn>
		    </BootstrapTable>
		)
	}
}

PointTable.defaultProps = {
    points: []
};

module.exports = PointTable;