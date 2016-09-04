import React from 'react';
import { Button } from 'react-bootstrap'

class SaveForm extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			name: '',
			disabled: false,
			btnLabel: 'Save'
		}
	}

	handleNameChange(e) {
		this.setState({ name: e.target.value })
	}

	handleSubmit(e) {
		let self = this;
		e.preventDefault();
		console.log('saving...')
		this.setState({
			disabled: true,
			btnLabel: 'Saving...'
		});
		this.props.onSave(this.state.name, function(){
			console.log('saved')
			self.setState({
				disabled: false,
				btnLabel: 'Save'
			})
		});
	}

	render() {
		return (
			<form class="points-save-form" onSubmit={ this.handleSubmit.bind(this) }>	
				<input type="text" 
						placeholder="List Name" 
						value={ this.state.name } 
						onChange={ this.handleNameChange.bind(this) } />
				<Button class="save-button" 
						disabled={this.state.disabled} 
						bsStyle="primary" 
						type="submit" > 
				    { this.state.btnLabel }
				</Button>
			</form>
		)
	}
}

module.exports = SaveForm;