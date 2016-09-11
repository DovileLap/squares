import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


export default class SquaresTable extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let data = this.props.squares.map(function(square, id){
            return {
                'id': id,
                'pt1': square[0].x + ' ' + square[0].y,
                'pt2': square[1].x + ' ' + square[1].y,
                'pt3': square[2].x + ' ' + square[2].y,
                'pt4': square[3].x + ' ' + square[3].y,
            }
        });


        var options = {
            sizePerPageList: [5, 10, 20, 50],
            paginationShowsTotal: true
        }
        return (
            <BootstrapTable 
                data={data} 
                remote 
                keyField="id" 
                striped  
                hover 
                pagination 
                options={options} 
                fetchInfo={ { dataTotalSize: this.props.squares.length } }>
              <TableHeaderColumn dataField="pt1" dataSort>Point 1</TableHeaderColumn>
              <TableHeaderColumn dataField="pt2" dataSort>Point 2</TableHeaderColumn>
              <TableHeaderColumn dataField="pt3" dataSort>Point 3</TableHeaderColumn>
              <TableHeaderColumn dataField="pt4" dataSort>Point 4</TableHeaderColumn>
            </BootstrapTable>
        )
    }
}
