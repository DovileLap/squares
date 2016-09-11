import React from 'react';
import ReactDom from 'react-dom';
import { Button } from 'react-bootstrap';


export default class PointsImport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }


    handleChange(event) {
        let self = this;
        let file = event.target.files[0];
        if (!event.target.files[0]){
            return;
        }
        let reader = new FileReader();
        let messages = [];
        reader.onload = function(progressEvent) {
            let lines = this.result.split('\n');
            let points = [];
            for(var lineidx = 0; lineidx < lines.length; lineidx++){
                let line = lines[lineidx];
                if (line.length === 0) {
                    continue;
                }
                let coords = line.split(' ');
                if (coords.length != 2) {
                    messages.push([lineidx, line, "Malformed line, expecting two integers separated by a space."]);
                    continue;
                }
                let point = { x: coords[0], y: coords[1] };

                // If we reached max points allowed, ignore the rest                  
                if (points.length >= self.props.limit) {
                    messages.push([lineidx, line, "Maximum point set capacity reached, ignoring the rest."]);
                    break;
                }

                // Otherwise vlidate the point
                let validates = self.props.validator(point);
                if (!validates.valid) {
                    messages.push([lineidx, line, validates.msg]);
                    continue;
                }

                // And make sure it's not duplicate within the file too
                let duplicate = !!points.find((savedPoint) =>
                    savedPoint.x == point.x && savedPoint.y == point.y
                );
                if (duplicate) {
                    messages.push([lineidx, line, "Duplicate point."]);
                    continue;
                }

                points.push(point);
            }
            self.props.addPoints(points);
            if (messages.length > 0) {
                messages = self.formatMessages(messages);
                if (points.length > 0) {
                    messages.unshift("".concat(points.length, " points have been imported, but there were errors:"));
                }
                self.props.handleMessages(messages);
            }
            
            self.props.toggleLoading(false);
        };
        this.props.toggleLoading(true);
        // reset file input, so we can import same file again
        this.inputEl().val('');
        reader.readAsText(file);
    }

    formatMessages(messages) {
        return messages.map(function(message) {
            return "Error in line " + (message[0] + 1) + " [" + message[1] + "]: " + message[2];
        });
    }

    inputEl() {
        return $(ReactDom.findDOMNode(this)).find('input[type="file"]');
    }

    openDialog() {
        this.inputEl().click();
    }

    render(){
        return (
            <form class="points-import-form form-inline">
                <input type="file" 
                        accept=".txt" 
                        style={ { display: "none" } }
                        onChange={ this.handleChange.bind(this) }/>
                <Button class={ "file-import-button " + this.props.btnClass }  
                        bsStyle="info"   
                        onClick={ this.openDialog.bind(this) } 
                        disabled={ this.props.disabled } >
                    <i class="glyphicon glyphicon-import"></i>
                    &nbsp;Import
                </Button>
              </form>

        )
    }
}    