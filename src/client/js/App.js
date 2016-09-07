import React from 'react';
import { render } from 'react-dom'
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router'

import Points from './Points.js';

import '../css/app.css';


var App = React.createClass({
  render: function() {
    return (
	    <div className="content">
			{this.props.children}
	    </div>
    )
  }
});

render(
	<Router history={hashHistory}>
	  <Route path="/" component={App}>
	 	<IndexRoute component={Points}/>
	  </Route>
	</Router>,
    document.getElementById('content')
);