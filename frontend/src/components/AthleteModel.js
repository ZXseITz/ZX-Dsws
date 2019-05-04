import React, {Component} from "react"
import {Form, Row} from "react-bootstrap";

export default class AthleteModel extends Component {
    constructor(props) {
        super(props);
        this.model = props.model;
        this.onChange.bind(this);
        this.onChangeInt.bind(this);
        this.onChangeFloat.bind(this);
        this.onChangeState.bind(this);
    }

    onChange = (event, prop) => {
        this.model[prop] = event.target.value;
    };

    onChangeInt = (event, prop) => {
        this.model[prop] = parseInt(event.target.value);
    };

    onChangeFloat = (event, prop) => {
        this.model[prop] = parseFloat(event.target.value);
    };

    onChangeState = (event) => {
        let state = 1;
        switch (event.target.value) {
            case 'Finished':
                state = 0;
                break;
            case 'DNS':
                state = 2;
                break;
            case 'DNF':
                state = 3;
                break;
        }
        this.model['state'] = state;
    };

    getStateText = state => {
        switch (state) {
            case 0:
                return 'Finished';
            case 1:
                return 'Pending';
            case 2:
                return 'DNS';
            case 3:
                return 'DNF';
        }
    };

    render() {
        return <Form>
            <Form.Group as={Row}>
                <Form.Label>Startnummer</Form.Label>
                <Form.Control type='text' onChange={event => this.onChangeInt(event, 'number')} defaultValue={this.model.number}/>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label>Vorname</Form.Label>
                <Form.Control type='text' onChange={event => this.onChange(event, 'firstname')} defaultValue={this.model.firstname}/>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label>Nachname</Form.Label>
                <Form.Control type='text' onChange={event => this.onChange(event, 'surname')} defaultValue={this.model.surname}/>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label>Jahrgang</Form.Label>
                <Form.Control type='text' onChange={event => this.onChangeInt(event, 'year')} defaultValue={this.model.year}/>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label>Klasse</Form.Label>
                <Form.Control type='text' onChange={event => this.onChange(event, 'schoolClass')} defaultValue={this.model.schoolClass}/>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label>Kategorie</Form.Label>
                <Form.Control type='text' onChange={event => this.onChange(event, 'category')} defaultValue={this.model.category}/>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label>Status</Form.Label>
                <Form.Control as="select" onChange={event => this.onChangeState(event)} defaultValue={this.getStateText(this.model.state)} >
                    <option>Finished</option>
                    <option>Pending</option>
                    <option>DNS</option>
                    <option>DNF</option>
                </Form.Control>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label>Zeit</Form.Label>
                <Form.Control type='text' onChange={event => this.onChangeFloat(event, 'time')} defaultValue={this.model.time} />
            </Form.Group>
        </Form>;
    }
}