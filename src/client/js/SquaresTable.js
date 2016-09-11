import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


export default class SquaresTable extends React.Component {

    constructor(props) {
        super(props);
        this.squares = props.squares;
        this.state = {
            squares: props.squares,
            currentPage: 1,
            sizePerPage: 20,
        };
    }

    componentWillReceiveProps(props){
        this.squares = props.squares;
        this.setState({
            squares: props.squares
           });
           this.resetPage();
    }

    onPageChange(page, sizePerPage) {
        const currentIndex = (page - 1) * sizePerPage;
        this.setState({
          squares: this.squares.slice(currentIndex, currentIndex + sizePerPage),
          currentPage: page
        });
    }

    onSizePerPageList(sizePerPage) {
        const currentIndex = (this.state.currentPage - 1) * sizePerPage;
        this.setState({
          squares: this.squares.slice(currentIndex, currentIndex + sizePerPage),
          sizePerPage: sizePerPage
        });
      }

    resetPage() {
        const currentIndex = (this.state.currentPage - 1) * this.state.sizePerPage;
        this.setState({
          squares: this.squares.slice(currentIndex, currentIndex + this.state.sizePerPage)
        });
    }

    render() {
        let data = this.state.squares.map(function(square, id){
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
            sizePerPage: this.state.sizePerPage,
            page: this.state.currentPage,
            onPageChange: this.onPageChange.bind(this),
            onSizePerPageList: this.onSizePerPageList.bind(this),
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
