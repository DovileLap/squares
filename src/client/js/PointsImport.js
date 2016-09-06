import React from 'react';
import FileInput from 'react-file-input';
import Spinner from 'react-spinner';


class PointsImport extends React.Component {
	constructor(props) {
		super(props);
		this.messages = [];
		this.state = {
			loading: false
		}
	}


	handleChange(event) {
		let self = this;
		let file = event.target.files[0];
		if (!event.target.files[0]){
			return;
		}
		let reader = new FileReader();
		reader.onload = function(progressEvent) {
			let lines = this.result.split('\n');
			let points = [];
		    for(var lineid = 0; lineid < lines.length; lineid++){
		    	console.log(lineid);
		    	let line = lines[lineid];
		    	if (line.length === 0) {
		    		continue;
		    	}
		      	let coords = line.split(' ');
		      	if (coords.length != 2) {
		      		self.messages.push([lineid, line, "Malformed line, expecting two integers separated by a space."]);
		      		continue;
		      	}
		      	let point = { x: coords[0], y: coords[1] };
		      	let validates = self.props.validator(point);
		      	if (!validates.valid) {
		      		self.messages.push([lineid, line, validates.msg]);
		      		continue;
		      	}
		      	points.push(point);
		    }
		    console.log('batch done');
		    self.props.addPoints(points);
		    self.setState({ loading: false })
		    console.log('all done');
		    console.log(self.messages);
		}
		this.setState({ loading: true })
		reader.readAsText(file);
	}

	render(){
		return (
			<form class="points-import-form form-inline">
		        <FileInput name="pointsImport"
		                   accept=".txt"
		                   placeholder="Import Points"
		                   className="form-control"
		                   onChange={ this.handleChange.bind(this) } />
		        <div style = { { display: this.state.loading? '': 'none' }} 
		        	class="points-import-spinner">
		        	<Spinner/>
		        </div>
		      </form>

		)
	}
}	

module.exports = PointsImport;