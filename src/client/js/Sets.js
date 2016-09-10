import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';
import $ from 'jquery';

import SetDialog from './SetDialog';

class Sets extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			name: '',
			disabled: false,
			saveBtnLabel: 'Save',
			loadBtnLabel: 'Load',
			deleteBtnLabel: 'Delete',
			sets: [] 
		}
		this.loadSets();
	}

	loadSets() {
		$.ajax({
			url: '/sets',
			context: this,
			success: function(data){
				this.setState({
					sets: data
				});
			}
		});
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
			saveBtnLabel: 'Saving...'
		});
		this.save();
	}

	resetButtons() {
		this.setState({
			disabled: false,
			saveBtnLabel: 'Save',
			loadBtnLabel: 'Load',
			deleteBtnLabel: 'Delete'
		});
	}

	save(callback) {
		$.ajax({
			url: '/set/'+this.state.name,
			method: 'POST',
			contentType: "application/json",
			context: this,
			data: JSON.stringify({ 'points': this.props.getPoints() }),
			success: function() {
				this.props.onSaveSet(this.state.name);
			},
			complete: this.resetButtons
		});
	}
	
	delete() {
		this.setState({
			disabled: true,
			deleteBtnLabel: 'Deleting...'
		});
		$.ajax({
			url: '/set/' + this.state.name,
			method: 'DELETE',
			context: this,
			success: function(data){
				this.props.onDeleteSet(this.state.name);
				this.loadSets();
			},
			complete: this.resetButtons
		});
	}

	load() {
		this.setState({
			disabled: true,
			loadBtnLabel: 'Loading...'
		});
		$.ajax({
			url: '/set/' + this.state.name,
			context: this,
			success: function(data){
				this.props.onLoadSet(this.state.name, data);
			},
			complete: this.resetButtons
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
					    &nbsp;{ this.state.saveBtnLabel }
					</Button>
					<Button bsStyle="success"
							disabled={this.state.disabled}
							onClick={ this.load.bind(this) }>
						<i class="glyphicon glyphicon-download"></i>
						&nbsp;{ this.state.loadBtnLabel }
					</Button>
					<Button bsStyle="warning"
							disabled={this.state.disabled} 
							onClick={ this.delete.bind(this) }>
						<i class="glyphicon glyphicon-trash"></i>
						&nbsp;{ this.state.deleteBtnLabel }
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

module.exports = Sets;