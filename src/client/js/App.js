import React from 'react';
import { render } from 'react-dom'
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router'

import Points from './Points.js';

import '../css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-spinner/react-spinner.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';


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
	 	<Route path=":setname" component={Points} />
	  </Route>
	</Router>,
    document.getElementById('content')
);