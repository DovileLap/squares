import React from 'react';
import { Button } from 'react-bootstrap'
import PointTable from './PointTable'
import PointsImport from './PointsImport'
import Squares from './Squares'
import Sets from './Sets'


import { validateCoord } from './validators'

class Points extends React.Component {
	constructor(props) {
		super(props);
		this.nextId = 0;
		this.points = [];
		props.points.map(function(point){
			this._addPoint(point);
		}, this);
		this.state = {
			points: this.points,
			name: ''
		};

	}

	getPoints() {
		return this.state.points;
	}

	newPoint(x, y) {
		let newPoint = { 
			  id: this.nextId,
			  x: parseInt(x),
			  y: parseInt(y)
		};
		this.nextId++;
		return newPoint;
	}

	_addPoint(point) {
		const validation = this.validatePoint(point);
		if (validation.valid) {
			this.points.push(this.newPoint(point.x, point.y));
		} else {
			console.log(validation.msg);
		}
	}

	addPoint(point) {
		this._addPoint(point);
		this.setState({
			points: this.points
		})
	}

	addPoints(points) {
		points.map(function(point){
			this._addPoint(point);
		}, this);
		this.setState({
			points: this.points
		});
	}

	validatePoint(point) {
		let resp = { valid: true, msg: ''};
		if (!point.hasOwnProperty('x') || !point.hasOwnProperty('y')) {
			resp.valid = false;
			resp.msg = 'Point has to have x and y coordinates defined.'
		} else if (!validateCoord(point.x) || !validateCoord(point.y)) {
			resp.valid = false;
			resp.msg = 'Coordinates have to be integers between -5000 and 5000.'
		}
		let intPoint = {x: parseInt(point.x),
						y: parseInt(point.y)};
		if (this.points.length > 10000) {
			resp.valid = false;
			resp.msg = 'Too many points.';
		} else if (this.pointExists(intPoint)) {
			resp.valid = false;
			resp.msg = 'This point already exists.';
		}
		return resp; 
	}

	pointExists(point) {
		return !!this.points.find(function(savedPoint) {
			return savedPoint.x == point.x && savedPoint.y == point.y;
		})
	}

	deleteById(id) {
		console.log('deleting ' + id);
		let idx = this.points.findIndex(function(point) {
			return point.id == id;
		})
		if (idx == -1) {
			throw "Unknown point: " + point;
		}
		this.points.splice(idx, 1);
		this.setState({
			points: this.points
		});
	}

	deletePoint(point) {
		console.log('deleting ' + point);
		let idx = this.points.indexOf(point);
		if (idx == -1) {
			throw "Unknown point: " + point;
		}
		this.points.splice(idx, 1);
		this.setState({
			points: this.points
		});
	}

	clearAll() {
		this.points = [];
		this.setState({
			points: this.points
		});
	}

	onDeleteSet(name) {
		if (this.state.name == name) {
			this.clearAll();
			this.setState({
				name: ''
			});
		}
	}

	onSaveSet(name) {
		this.setState({
			name: name
		});
	}

	onLoadSet(name, points) {
		this.setState({
			name: name
		});
		this.clearAll();
		this.addPoints(points);
	}

	render() {
		let setname = "New set";
		if (this.state.name) {
			setname = "Set " + this.state.name;
		}
		return (
			<div class="main-container container-fluid">
				<div class="toolbar row">
					<div class="col-md-6 col-sm-6 col-xs-12">
						<Button class="clear-button" 
								bsStyle="primary"   
						        onClick={ this.clearAll.bind(this) } > 
						    Clear all Points
						</Button>
						<PointsImport addPoints={ this.addPoints.bind(this) }
								  validator={ this.validatePoint.bind(this) }  />
					</div>
					<div class="col-md-6 col-sm-6 col-xs-12">
						<Sets getPoints={ this.getPoints.bind(this) }
							  onSaveSet={ this.onSaveSet.bind(this) }
							  onDeleteSet={ this.onDeleteSet.bind(this) }
							  onLoadSet={ this.onLoadSet.bind(this)}
								/>
					</div>
				</div>
				<div class="row">
					<div class="col-md-12 col-xs-12">
						<h3>{ setname }</h3>
					</div>
				</div>
				<div class="row">
					<div class="col-md-6 col-xs-12">
						<PointTable onDeleteRow={this.deleteById.bind(this)} 
									onAddRow={this.addPoint.bind(this)} 
									{ ...this.state } />
					</div>
					<div class="col-md-6 col-xs-12">
						<Squares { ...this.state }/>
					</div>
				</div>
			</div>
		);
	}
};

Points.defaultProps = {
    points: []
};

module.exports = Points;