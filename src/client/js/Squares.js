import React from 'react';

import SquaresTable from './SquaresTable';
import SquaresViz from './SquaresViz';

function comparePoints(pt1, pt2){
	if (pt1.x < pt2.x) {
		return -1;
	} else if (pt1.x > pt2.x) {
		return 1;
	} else if (pt1.y < pt2.y) {
		return -1;
	} else if (pt1.y > pt2.y) {
		return 1;
	}
	return 0;
}

class Squares extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			points: props.points,
			squares: this.calculateSquares(props.points)
		}
	}

	componentWillReceiveProps(props){
	    this.setState({
	    	points: props.points,
	    	squares: this.calculateSquares(props.points)
	   	});
	}

	calculateSquares(points) {
		let sortedPoints = points.sort(comparePoints);
		let hash = {}
		for (let idx = 0; idx < sortedPoints.length; idx++) {
			let point = sortedPoints[idx];
			if (hash[point.x] === undefined){
				hash[point.x] = []
			}
			hash[point.x].push(point.y);
		}

		let squares = [];
		for (let firstIdx = 0; firstIdx < sortedPoints.length; firstIdx++) {
			let firstPt = sortedPoints[firstIdx];
			for (let secondIdx = firstIdx + 1; secondIdx < sortedPoints.length; secondIdx++) {
				let secondPt = sortedPoints[secondIdx];
				// Let's only check certain angle lines, otherwise we'll be duplicating results.
				if (!(firstPt.x <= secondPt.x && firstPt.y < secondPt.y)) {
					continue
				}
				let thirdPt = {
					x: secondPt.x + (secondPt.y - firstPt.y),
					y: secondPt.y + (firstPt.x - secondPt.x)
				};
				let fourthPt = {
					x: firstPt.x + (secondPt.y - firstPt.y),
					y: firstPt.y + (firstPt.x - secondPt.x)
				};
				if ((hash[thirdPt.x] !== undefined && hash[thirdPt.x].indexOf(thirdPt.y) >= 0) 
					&& (hash[fourthPt.x] !== undefined && hash[fourthPt.x].indexOf(fourthPt.y) >= 0)){
					// Found!
					squares.push([firstPt, secondPt, thirdPt, fourthPt]);
				}
			}
		}
		return squares;

	}

	render() {
		return (
			<div>
				<h3>Squares</h3>
				<SquaresViz { ...this.state }
					/>
				<SquaresTable squares={ this.state.squares }/>
			</div>
		)
	}
}

Squares.defaultProps = {
    points: []
};

module.exports = Squares;