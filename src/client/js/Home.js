import React from 'react';
import Points from './Points.js';

const pointsJson= [{ x:10, y:20},
			 { x:0, y:-5},
			 { x:35, y:5},
			 { x:38, y:5},
			 { x:39, y:5},
			 { x:35, y:6}
			 ];

var Home = React.createClass({
	render: function() {
		return (
			<div>
				<Points points={pointsJson} />
			</div>
		)
	}
});

module.exports = Home;