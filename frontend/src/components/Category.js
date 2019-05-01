import React, {Component} from "react"
import {Button, Modal, Form, Table, Row} from "react-bootstrap"
import config from "../config.json"

export default class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updateItem: {},
            categories: []
        };

        this.loadCategories.bind(this);

        this.handleUpdateClose.bind(this);
        this.handleUpdateShow.bind(this);

        this.createCategory.bind(this);
        this.updateCategory.bind(this);
        this.deleteCategory.bind(this);

        this.onNameChange.bind(this);
        this.onYearChange.bind(this);
        this.onSexChange.bind(this);
        this.onDistanceChange.bind(this);
    };

    loadCategories = () => {
        fetch(`http://${config.host}/api/categories`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => this.setState({categories: data}))
            .catch(err => console.error(err))
    };

    createCategory = () => {
        fetch(`http://${config.host}/api/categories`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({})
        })
            .then(() => console.log(`created category successfully`))
            .catch(err => console.error(err))
    };

    updateCategory = () => {
        const id = this.state.updateItem._id;
        const item = {
            name: this.state.updateItem.name,
            year: this.state.updateItem.year,
            sex: this.state.updateItem.sex,
            distance: this.state.updateItem.distance,
        };
        console.log(item);
        fetch(`http://${config.host}/api/categories/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(item)
        })
            .then(() => console.log(`updated category ${id} successfully`))
            .catch(err => console.error(err))
    };

    deleteCategory = () => {
        const id = this.state.updateItem._id;
        fetch(`http://${config.host}/api/categories/${id}`, {
            method: 'DELETE'
        })
            .then(() => console.log(`deleted category ${id} successfully`))
            .catch(err => console.error(err))
    };

    handleUpdateClose = () => this.setState({updateItem: {}});

    handleUpdateShow = (item) => this.setState({updateItem: item});

    componentWillMount = () => this.loadCategories();

    onNameChange = event => {
        const state = this.state;
        state.updateItem.name = event.target.value;
        this.setState(state);
    };

    onYearChange = event => {
        const state = this.state;
        state.updateItem.year = event.target.value;
        this.setState(state);
    };

    onSexChange = event => {
        const state = this.state;
        state.updateItem.sex = event.target.value;
        this.setState(state);
    };

    onDistanceChange = event => {
        const state = this.state;
        state.updateItem.distance = event.target.value;
        this.setState(state);
    };

    render() {
        const updateItem = this.state.updateItem;
        const rows = [];
        this.state.categories.forEach(item => {
            rows.push(<tr key={item._id} onClick={() => {
                this.handleUpdateShow(item);
            }}>
                <td>{item.name}</td>
                <td>{item.year}</td>
                <td>{item.sex}</td>
                <td>{item.distance}</td>
            </tr>)
        });
        return (
            <div>
                <Modal show={updateItem.hasOwnProperty('_id')} onHide={() => this.handleUpdateClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update {updateItem._id}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group as={Row} controlId='formName'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type='text' onChange={this.onNameChange} defaultValue={updateItem.name}/>
                            </Form.Group>
                            <Form.Group as={Row} controlId='formYear'>
                                <Form.Label>Jahr</Form.Label>
                                <Form.Control type='text' onChange={this.onYearChange} defaultValue={updateItem.year}/>
                            </Form.Group>
                            <Form.Group as={Row} controlId='formSex'>
                                <Form.Label>Gechlecht</Form.Label>
                                <Form.Control as="select" onChange={this.onSexChange} defaultValue={updateItem.sex} >
                                    <option>m</option>
                                    <option>w</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group as={Row} controlId='formDistance'>
                                <Form.Label>Distanz</Form.Label>
                                <Form.Control type='text' onChange={this.onDistanceChange} defaultValue={updateItem.distance}/>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleUpdateClose()}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={() => {
                            this.deleteCategory();
                            this.handleUpdateClose();
                        }}>
                            Delete
                        </Button>
                        <Button variant="primary" onClick={() => {
                            this.updateCategory();
                            this.handleUpdateClose();
                        }}>
                            Update
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Button variant="outline-primary" onClick={() => this.createCategory()} >Hinzufügen</Button>

                <Table bordered hover>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Jahr</th>
                        <th>Geschlecht</th>
                        <th>Distanz</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </Table>
            </div>
        );
    };
}