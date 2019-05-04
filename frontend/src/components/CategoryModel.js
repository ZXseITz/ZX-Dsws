import React, {Component} from "react"
import {Form, Row} from "react-bootstrap";

export default class CategoryModel extends Component {
    constructor(props) {
        super(props);
        this.model = props.model;
        this.onChange.bind(this);
    }

    onChange = (event, prop) => {
        this.model[prop] = event.target.value;
    };

    render() {
        return <Form>
            <Form.Group as={Row} controlId='formName'>
                <Form.Label>Name</Form.Label>
                <Form.Control type='text' onChange={event => this.onChange(event, 'name')} defaultValue={this.model.name}/>
            </Form.Group>
            <Form.Group as={Row} controlId='formYear'>
                <Form.Label>Jahr</Form.Label>
                <Form.Control type='text' onChange={event => this.onChange(event, 'year')} defaultValue={this.model.year}/>
            </Form.Group>
            <Form.Group as={Row} controlId='formSex'>
                <Form.Label>Gechlecht</Form.Label>
                <Form.Control as="select" onChange={event => this.onChange(event, 'sex')} defaultValue={this.model.sex} >
                    <option>m</option>
                    <option>w</option>
                </Form.Control>
            </Form.Group>
            <Form.Group as={Row} controlId='formDistance'>
                <Form.Label>Distanz</Form.Label>
                <Form.Control type='text' onChange={event => this.onChange(event, 'distance')} defaultValue={this.model.distance}/>
            </Form.Group>
        </Form>;
    }
}