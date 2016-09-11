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
			action: null,
			sets: [],
			savedSets: [] 
		}
		this.loadSets();
	}

	onLoadSets(sets) {
		this.setState({
			sets: sets.slice(),
			savedSets: sets.slice()
		});
	}

	loadSets() {
		this.props.SetsAPI.loadSets(
			{	
				success: this.onLoadSets.bind(this)
			}
		);
	}

	handleNameChange(e) {
		this.setState({ name: e.target.value });
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
		if (name.length > 0 && this.validateNewName(name).valid) {
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
		if (this.state.name.length == 0) return;

		this.setState({
			action: 'saving'
		});
		this.save();
	}

	reset() {
		this.setState({
			action: null
		});
	}

	onSave() {
		this.props.onSaveSet(this.state.name);
		this.loadSets();
	}

	save(callback) {
		this.props.SetsAPI.saveSet(
			this.state.name, 
			this.props.getPoints(),
			{
				success: this.onSave.bind(this),
				complete: this.reset.bind(this)
			}
		)
	}

	onDelete() {
		this.props.onDeleteSet(this.state.name);
		this.loadSets();
	}
	
	delete() {
		if (this.state.name.length == 0) return;
		this.setState({
			action: 'deleting'
		});
		this.props.SetsAPI.deleteSet(this.state.name, 
			{
				success: this.onDelete.bind(this),
				complete: this.reset.bind(this)
			}
		);
	}

	onLoad(points) {
		this.props.onLoadSet(this.state.name, points);
	}

	load() {
		if (this.state.name.length == 0) return;
		this.setState({
			action: 'loading'
		});
		this.props.SetsAPI.loadSet(this.state.name,
			{
				success: this.onLoad.bind(this),
				complete: this.reset.bind(this)
			}
		)
	}

	openDialog() {
		this.dialog.open();
	}

	render() {
		let options = this.state.sets.map(function(opt) {
			return ( <option key={ opt } 
							 value= { opt }> 
							 { opt } { this.state.savedSets.indexOf(opt) < 0? '(not saved)': '' }
					 </option> ); 
		}, this);
		options.unshift( ( <option key=""></option>) );

		let disableButtons = !!this.state.action || this.state.name.length == 0;
		let disableDelete = this.state.savedSets.indexOf(this.state.name) < 0;
		let disableLoad = disableDelete;

		return (
			<form class="sets-save-form form-inline" onSubmit={ this.handleSubmit.bind(this) }>
				<select type="select" 
						class="form-control"
						value={ this.state.name }
						onChange={ this.handleNameChange.bind(this) }>
					{ options }
				</select>
				<Button bsStyle="success" 
						onClick= { this.openDialog.bind(this) }>
						<i class="glyphicon glyphicon-plus"></i>
				</Button>	
				<div class="btn-group">
					<Button disabled={ disableButtons} 
							bsStyle="primary" 
							type="submit" > 
						<i class="glyphicon glyphicon-floppy-disk"></i>
					    &nbsp;{ this.state.action == 'saving'? 'Saving...': 'Save' }
					</Button>
					<Button bsStyle="success"
							disabled={ disableButtons || disableLoad}
							onClick={ this.load.bind(this) }>
						<i class="glyphicon glyphicon-download"></i>
						&nbsp;{ this.state.action == 'loading'? 'Loading...': 'Load' }
					</Button>
					<Button bsStyle="warning"
							disabled={ disableButtons || disableDelete} 
							onClick={ this.delete.bind(this) }>
						<i class="glyphicon glyphicon-trash"></i>
						&nbsp;{ this.state.action == 'deleting'? 'Deleting...': 'Delete' }
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