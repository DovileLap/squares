import React from 'react';
import ReactDom from 'react-dom';
import $ from 'jquery';
import * as d3 from 'd3';


d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

class SquaresViz extends React.Component {

	constructor(props) {
		super(props);
	    this.handleResize = this.handleResize.bind(this);
	    this.margin = {
			left: 5,
			right: 5,
			top: 5,
			bottom: 5
		};
	}

	componentDidMount() {
	    let el = ReactDom.findDOMNode(this);
	    this.svg = d3.select(el).append("svg")
	    	.attr("class", "points-viz-container");
	    this.g = this.svg.append("g")
		   	.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
	    this.createViz(el);
	    window.addEventListener('resize', this.handleResize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	componentDidUpdate() {
	    let el = ReactDom.findDOMNode(this);
	    this.createViz(el);
	}

	handleResize() {
		let el = ReactDom.findDOMNode(this);
		this.createViz(el);
	}

	createViz(el) {
		
		let width = $(el).width();
		let height = width;
		let pointsData = this.props.points;
		let squaresData = this.props.squares;
		let svg = this.svg;
		let g = this.g;
		let margin = this.margin;

		let xValue = function(d) { return d.x; };
		let xScale = d3.scaleLinear().range([0, width]);
		let xMap = function(d) { return xScale(xValue(d));};
		//let xAxis = d3.axisBottom().scale(xScale);
		xScale.domain([d3.min(pointsData, xValue)-1, d3.max(pointsData, xValue)+1]);

		// setup y
		let yValue = function(d) { return d.y;}; 
		let yScale = d3.scaleLinear().range([height, 0]);
		let yMap = function(d) { return yScale(yValue(d));};
		//let yAxis = d3.axisLeft().scale(yScale);
		yScale.domain([d3.min(pointsData, yValue)-1, d3.max(pointsData, yValue)+1]);


		svg.attr("width", width + margin.left + margin.right)
		   .attr("height", height + margin.top + margin.bottom);
		

		let points = g.selectAll(".dot")
	      .data(pointsData, function(d){
	      		return d.x+','+d.y;
	      });
	   	points.enter().append("circle")
	      .attr("class", "dot")
	      .attr("fill", "#545454")
	      .attr("r", 1.5)
	     .merge(points)
	      .attr("cx", xMap)
	      .attr("cy", yMap);
	    points.exit().remove();


	    let squares = g.selectAll(".square")
	    	.data(squaresData, function(d){
	    		return d.map(function(pt){
	    			return pt.x+","+pt.y;
	    		}).join(" ");
	    	});
	    squares.enter().append("polyline")
	      .attr("class", "square")
	      .on("mouseover", function(d) {
			  d3.select(this).attr("class", "square active")
			  	.moveToFront();
			})  
	       .on("mouseout", function(d) {
	       	  d3.select(this).attr("class", "square");
	       })
	     .merge(squares)
	       .attr("points", function(d){
	      	return xMap(d[0])+','+yMap(d[0])+" "+
	      		   xMap(d[1])+','+yMap(d[1])+" "+
	      		   xMap(d[2])+','+yMap(d[2])+" "+
	      		   xMap(d[3])+','+yMap(d[3])+" "+
	      		   xMap(d[0])+','+yMap(d[0]);
	    });
	    squares.exit().remove();			
	}

	render() {
	    return ( 
	    	<div class="squares-viz"></div>
	    );


	}
}

module.exports = SquaresViz;