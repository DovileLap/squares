import React from 'react';
import ReactDom from 'react-dom';
import { Button } from 'react-bootstrap';
import jQuery from 'jquery';
import $ from 'jquery';
import 'bootstrap'; // react-bootstrap-table needs a separate import
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Spinner from 'react-spinner';


import { validateCoord } from './validators';
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
            title: '',
        }};
    if (!validateCoord(value)) {
        response.isValid = false;
        response.notification.type = 'error';
        response.notification.msg = 'Coordinate has to be an integer between -5000 and 5000.';
        response.notification.title = 'Invalid Value';
    }
    return response;
}

export default class PointTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            sizePerPage: 20,
            loading: false
        };
    }

    componentDidMount() {
        let el = ReactDom.findDOMNode(this);
        
        // All this cause react-bootstrap-table isn't flexible enough
        let toolbar = $(el).find('.react-bs-table-tool-bar > div > div:first-child');
        // Change bootstrap classes on table toolbar
        toolbar.attr('class', 'col-xs-12 col-sm-12 col-md-12 col-lg-12');

        let buttons = $(el).find('.points-table-extra-button');
        // Add Extra buttons 
        buttons.detach();
        toolbar.find('.btn-group').append(buttons);

        // And spinner
        let spinner = $(el).find('.points-spinner');
        spinner.detach();
        toolbar.append(spinner);
    }

    onPageChange(page, sizePerPage) {
        this.setState({
          currentPage: page
        });
    }

    onSizePerPageList(sizePerPage) {
        this.setState({
          sizePerPage: sizePerPage,
          currentPage: 1
        });
      }


    getPage() {
        const currentIndex = (this.state.currentPage - 1) * this.state.sizePerPage;
        return this.props.points.slice(currentIndex, currentIndex + this.state.sizePerPage);
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
    }

    deleteRow(id) {
        const split = id.split(" ");
        const point = this.props.points.find(function(point) {
            return point.x == parseInt(split[0]) && point.y == parseInt(split[1]);
        });
        if (point) {
            this.props.onDeleteRow(point);
        }
    }

    onAddRow(row) {
        this.props.onAddRow(row);
    }

    toggleLoading(loading) {
        this.setState({
            loading: loading
        });
    }

    render() {
        let points = this.getPage();
        points.forEach(function(point) {
            point.id = point.x + " " + point.y;
        });

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
        };

        return (
            <div class="points-table-container">
                <h3>Points</h3>
                <BootstrapTable 
                    data={ points } 
                    remote 
                    selectRow={ { mode: 'checkbox' } }
                    keyField="id" 
                    striped  
                    hover 
                    pagination 
                    insertRow 
                    deleteRow 
                    options={options} 
                    fetchInfo={ { dataTotalSize: this.props.points.length } }
                    >
                  <TableHeaderColumn dataField="x" dataSort editable={ {validator: pointValidator} }>X</TableHeaderColumn>
                  <TableHeaderColumn dataField="y" dataSort editable={ {validator: pointValidator} }>Y</TableHeaderColumn>
                </BootstrapTable>
                {/* All buttons with .points-table-extra-button will be moved to toolbar of the table on componentDidMount.
                Unfortunately the component itself lacks flexibility in buttons. */}
                <Button class="clear-button points-table-extra-button" 
                        bsStyle="danger" 
                        onClick={ this.props.clearAll } 
                        disabled= { this.state.loading } > 
                    <i class="glyphicon glyphicon-trash"></i>
                    &nbsp;Clear all 
                </Button>
                <PointsImport  
                    addPoints={ this.props.addPoints }
                    validator={ this.props.validator } 
                    handleMessages={ this.props.handleMessages } 
                    limit={ this.props.limit } 
                    toggleLoading = { this.toggleLoading.bind(this) }
                    btnClass="points-table-extra-button" 
                    disabled= { this.state.loading } />
                <PointsExport 
                    points={ this.props.points } 
                    filename="points.txt" 
                    disabled= { this.state.loading }
                />
                <div style = { { display: this.state.loading? '': 'none' }} 
                    class="points-spinner">
                    <Spinner/>
                </div>
            </div>
        )
    }
}

PointTable.defaultProps = {
    points: []
};
