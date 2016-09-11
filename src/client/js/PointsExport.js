import React from 'react';
import { Button } from 'react-bootstrap';
import filesaver from 'file-saver';


export default class PointsExport extends React.Component {

    export() {
        const rows = this.props.points.map((point) => 
            [point.x, point.y].join(' ')        
        );
        const body = rows.join('\n');

        filesaver.saveAs(new Blob([ body ],
            { type: 'text/plain;charset=utf-8' }),
            this.props.filename, true);
    }

    render() {
        return (
            <Button class="clear-button points-table-extra-button" 
                    bsStyle="success" 
                    onClick = { this.export.bind(this) } 
                    disabled={ this.props.disabled }> 
                <i class="glyphicon glyphicon-export"></i>
                &nbsp;Export 
            </Button>
        )
    }
}