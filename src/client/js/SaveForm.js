import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';
import $ from 'jquery';

import SetDialog from './SetDialog';

class SaveForm extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			name: '',
			disabled: false,
			btnLabel: 'Save',
			sets: ['A', 'B', 'C'] 
		}
	}

	handleNameChange(e) {
		if (e.target.value == "add_new_set") {
			this.dialog.open();
		} else {
			this.setState({ name: e.target.value })
		}	
	}

	validateNewName(name) {
		if (this.state.sets.indexOf(name) >= 0) {
			return {
				valid: false,
				message: 'This name is already taken.'
			}
		}
		return {
			valid: true,
			message: ''
		}
	}

	createNewName(name) {
		if (this.validateNewName(name).valid) {
			let sets = this.state.sets;
			sets.push(name);
			this.setState({
				sets: sets,
				name: name
			});
		}
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
		let options = this.state.sets.map(function(opt) {
			return ( <option key={ opt } 
							 value= { opt }> 
							 { opt } 
					 </option> );
		}, this);
		options.unshift( ( <option key=""></option>) );
		options.push( ( <option key="add_new_set" value="add_new_set">New...</option> ) );

		return (
			<form class="points-save-form form-inline" onSubmit={ this.handleSubmit.bind(this) }>
				<select type="select" 
						class="form-control"
						value={ this.state.name }
						onChange={ this.handleNameChange.bind(this) }>
					{ options }
				</select>	
				<div class="btn-group">
					<Button disabled={this.state.disabled} 
							bsStyle="primary" 
							type="submit" > 
						<span class="glyphicon glyphicon-floppy-disk"></span>
					    &nbsp;{ this.state.btnLabel }
					</Button>
					<Button bsStyle="success">
						<i class="glyphicon glyphicon-download"></i>
						&nbsp;Load
					</Button>
					<Button bsStyle="warning">
						<i class="glyphicon glyphicon-trash"></i>
						&nbsp;Delete
					</Button>
				</div>
				<SetDialog id="set-dialog" 
					validateName= { this.validateNewName.bind(this) } 
					createNewName = { this.createNewName.bind(this) }
					ref={ (dialog) => this.dialog = dialog } />
			</form>
		)
	}
}

module.exports = SaveForm;