import React from 'react';
import { Button, Modal, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';


class SetDialog extends React.Component {

	constructor(props){
		super(props);
		this.state = this.getInitState();
	}

	getInitState(){
		return {
			showModal: false,
			name: '',
			validationState: '',
			validationMessage: ''
		};
	}

	close() {
	    this.setState({ showModal: false });
	}

	open(){
	    this.setState({ showModal: true });
	}

	save() {
		let validation = this.props.validateName(this.state.name);
		if (!validation.valid) {
			this.setState({ 
				validationMessage: validation.message,
				validationState: 'error' 
			});
		} else {
			this.props.createNewName(this.state.name);
			this.setState(this.getInitState());
		}

	}

	render() {
		let validationStateAttr = {};
		if (this.state.validationState) {
			validationStateAttr.validationState = this.state.validationState;
		}

		return (
			<Modal onHide={this.close.bind(this)} show={this.state.showModal}>
		      <Modal.Header closeButton>
		        <Modal.Title>New set</Modal.Title>
		      </Modal.Header>

		      <Modal.Body>
		      	<FormGroup { ...validationStateAttr }>
			      <ControlLabel>Set name</ControlLabel>
			      <FormControl type="text" 
			      			   onChange={ (e) => this.setState( { name: e.target.value })  }
			      />
			      <HelpBlock>{ this.state.validationMessage }</HelpBlock>
			    </FormGroup>
		      </Modal.Body>

		      <Modal.Footer>
		        <Button onClick={ this.close.bind(this) }>Cancel</Button>
		        <Button bsStyle="primary"
		        		disabled={ this.state.name.length == 0 }
		        		onClick= { this.save.bind(this) }> 
		        	Save
		        </Button>
		      </Modal.Footer>

		    </Modal>
		);
	}
}

module.exports = SetDialog;
