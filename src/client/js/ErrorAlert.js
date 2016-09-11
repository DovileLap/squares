import React from 'react';
import { Alert } from 'react-bootstrap';

class ErrorAlert extends React.Component {
	constructor(props) {
		super(props);
		this.limit = 5;
		this.state = {
			messages: props.messages,
			visible: props.messages.length > 0,
			showAllMessages: false
		}
	}

	componentWillReceiveProps(props){
		if (this.state.messages != props.messages) {
		    this.setState({
		    	messages: props.messages,
		    	visible: props.messages.length > 0,
				showAllMessages: false
		   	});
		}
	}


	handleDismiss() {
		this.setState({ visible: false });
	}

	showAll() {
		this.setState( { showAllMessages: true });
	}

	render() {
		let messages = this.props.messages;
		let overflowCount = 0;
		if (!this.state.showAllMessages) {
			messages = this.props.messages.slice(0, this.limit);
			overflowCount = Math.max(this.props.messages.length - this.limit, 0);
		}
		let messageLines = messages.map(function(message, id) {
			return (<p key={ id }> { message } </p>);
		});

		let overflow = '';
		if (overflowCount > 0) {
			overflow = (
				<p>
					<a class="error-alert-more" 
						onClick={ this.showAll.bind(this) }>
						Show {overflowCount} more message{ overflowCount == 1 ? '' : 's' }...
					</a>
				</p>
			);
		}

		if (this.state.visible) {
			return (
				<Alert bsStyle="danger" 
					class="error-alert" 
					onDismiss={ this.handleDismiss.bind(this) } >
					<h4>Error!</h4>
					{ messageLines }
					{ overflow }
				</Alert>
			);
		}
		return null;
	}

}

module.exports = ErrorAlert;