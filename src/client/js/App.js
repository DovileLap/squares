import React from 'react';
import { render } from 'react-dom'
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router'

import Home from './Home.js';

console.log('Hello World!');


var App = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Tiles</h1>
        <div className="content">
 			{this.props.children}
        </div>
      </div>
    )
  }
});


render(
	<Router history={hashHistory}>
	  <Route path="/" component={App}>
	 	<IndexRoute component={Home}/>
	  </Route>
	</Router>,
    document.getElementById('content')
);