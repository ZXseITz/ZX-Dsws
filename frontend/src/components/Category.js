import React, {Component} from "react"
import {Button, Modal, Form, Table, Row} from "react-bootstrap"
import config from "../config.json"

export default class Category extends Component {
    constructor(props) {
        super(props);
        this.refs = {
            formName: React.createRef(),
            formYear: React.createRef(),
            formSex: React.createRef(),
            formDistance: React.createRef(),
        };
        this.state = {
            updateItem: null,
            categories: []
        };

        this.loadCategories.bind(this);

        this.handleUpdateClose.bind(this);
        this.handleUpdateShow.bind(this);

        this.createCategory.bind(this);
        this.updateCategory.bind(this);
        this.deleteCategory.bind(this);
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
            name: this.refs.formName,
            year: this.refs.formYear,
            sex: this.refs.formSex,
            distance: this.refs.formDistance,
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

    handleUpdateClose = () => this.setState({updateItem: null});

    handleUpdateShow = (item) => this.setState({updateItem: item});

    componentWillMount = () => this.loadCategories();

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
                <Modal show={updateItem !== null} onHide={this.handleUpdateClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update {updateItem != null ? updateItem._id : ''}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group as={Row} controlId='formName'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type='text'
                                              defaultValue={updateItem !== null ? updateItem.name : ''}/>
                            </Form.Group>
                            <Form.Group as={Row} controlId='formYear'>
                                <Form.Label>Jahr</Form.Label>
                                <Form.Control type='text' defaultValue={updateItem !== null ? updateItem.year : ''}/>
                            </Form.Group>
                            <Form.Group as={Row} controlId='formSex'>
                                <Form.Label>Gechlecht</Form.Label>
                                <Form.Control as="select"
                                              defaultValue={updateItem !== null ? updateItem.sex : ''}
                                >
                                    <option>m</option>
                                    <option>w</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group as={Row} controlId='formDistance'>
                                <Form.Label>Distanz</Form.Label>
                                <Form.Control type='text'
                                              defaultValue={updateItem !== null ? updateItem.distance : ''}/>
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