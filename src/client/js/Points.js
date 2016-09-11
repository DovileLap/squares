import React from 'react';
import { Button, Grid, Row, Col } from 'react-bootstrap';
import PointTable from './PointTable';
import Squares from './Squares';
import Sets from './Sets';
import SetsAPI from './SetsAPI';
import ErrorAlert from './ErrorAlert';

import { validateCoord } from './validators';

export default class Points extends React.Component {
    constructor(props) {
        super(props);
        this.maximumPoints = 10000;
        this.points = []; // Separate, so we can change state in a batch.
        this.state = {
            points: [],
            name: this.props.params.setname,
            messages: []
        };
    }

    getPoints() {
        return this.state.points;
    }

    newPoint(x, y) {
        let newPoint = { 
              x: parseInt(x),
              y: parseInt(y)
        };
        return newPoint;
    }

    _addPoint(point) {
        const validation = this.validatePoint(point);
        if (validation.valid) {
            this.points.push(this.newPoint(point.x, point.y));
        } else {
            console.error('Attempted to add invalid point: ' + validation.msg);
        }
    }

    addPoint(point) {
        this._addPoint(point);
        this.setState({
            points: this.points
        });
    }

    addPoints(points) {
        this.resetMessages();
        points.map(function(point){
            this._addPoint(point);
        }, this);
        this.setState({
            points: this.points
        });
    }

    validatePoint(point) {
        let resp = { valid: true, msg: ''};
        if (!point.hasOwnProperty('x') || !point.hasOwnProperty('y')) {
            resp.valid = false;
            resp.msg = 'Point has to have x and y coordinates defined.';
        } else if (!validateCoord(point.x) || !validateCoord(point.y)) {
            resp.valid = false;
            resp.msg = 'Coordinates have to be integers between -5000 and 5000.';
        }
        let intPoint = {x: parseInt(point.x),
                        y: parseInt(point.y)};
        if (this.points.length >= this.maximumPoints) {
            resp.valid = false;
            resp.msg = 'Too many points.';
        } else if (this.pointExists(intPoint)) {
            resp.valid = false;
            resp.msg = 'This point already exists.';
        }
        return resp; 
    }

    pointExists(point) {
        return !!this.points.find(function(savedPoint) {
            return savedPoint.x == point.x && savedPoint.y == point.y;
        });
    }

    deletePoint(point) {
        let idx = this.points.indexOf(point);
        if (idx == -1) {
            throw "Unknown point: " + point;
        }
        this.points.splice(idx, 1);
        this.setState({
            points: this.points
        });
    }

    clearAll() {
        this.points = [];
        this.setState({
            points: this.points
        });
    }

    onAddPoint(point) {
        let validation = this.validatePoint(point);
        if (validation.valid) {
            this.addPoint(point);
        } else {
            this.setState({ messages: [validation.msg] });
        }
    }

    onDeleteSet(name) {
        if (this.state.name == name) {
            this.clearAll();
            this.setState({
                name: ''
            });
        }
    }

    onSaveSet(name) {
        this.setState({
            name: name
        });
    }

    onLoadSet(name, points) {
        this.setState({
            name: name
        });
        this.clearAll();
        this.addPoints(points);
    }

    handleMessages(messages) {
        this.setState({ messages: messages });
    }

    resetMessages() {
        this.setState({ messages: [] });
    }

    addMessage(message) {
        let messages = this.state.messages.slice();
        messages.push(message);
        this.setState({ messages: messages });
    }

    render() {
        let setname = "New set";
        if (this.state.name) {
            setname = "Set " + this.state.name;
        }
        return (
            <Grid fluid class="main-container">
                <Row class="header">
                    <Col md={4} sm={4} xs={12}>
                        <h2 class="">{ setname }</h2>
                    </Col>
                    <Col md={8} sm={8} xs={12}>
                        <Sets getPoints={ this.getPoints.bind(this) }
                              onSaveSet={ this.onSaveSet.bind(this) }
                              onDeleteSet={ this.onDeleteSet.bind(this) }
                              onLoadSet={ this.onLoadSet.bind(this)} 
                              SetsAPI = { new SetsAPI() }
                              preloadSet={ this.props.params.setname }
                                />
                    </Col>
                </Row>
                <Row>
                    <Col  md={12} sm={12} xs={12}>
                        <ErrorAlert messages={ this.state.messages }/>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} sm={6} xs={12}>
                        <PointTable onDeleteRow={this.deletePoint.bind(this)} 
                                    onAddRow={this.onAddPoint.bind(this)}
                                    points={ this.state.points }
                                    clearAll={this.clearAll.bind(this) } 
                                    addPoints={ this.addPoints.bind(this) }
                                    validator={ this.validatePoint.bind(this) } 
                                    handleMessages={ this.handleMessages.bind(this) } 
                                    limit={ this.maximumPoints - this.state.points.length }/>
                    </Col>
                    <Col md={6} sm={6} xs={12}>
                        <Squares points= { this.state.points }/>
                    </Col>
                </Row>
            </Grid>
        );
    }
};

Points.defaultProps = {
    points: []
};
