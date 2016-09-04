import React from 'react';
import Points from './Points';

const pointsJson= [{ x:10, y:20},
			 { x:0, y:0},
			 { x:0, y:5},
			 { x:5, y:0},
			 { x:5, y:5},
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