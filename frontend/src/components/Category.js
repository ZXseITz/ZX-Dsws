import React, {Component} from "react"
import {Button, Modal, Form, Table, Row} from "react-bootstrap"
import CategoryModel from "./CategoryModel"
import config from "../config.json"

export default class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model: {},
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
        const id = this.state.model._id;
        const item = {
            name: this.state.model.name,
            year: this.state.model.year,
            sex: this.state.model.sex,
            distance: this.state.model.distance,
        };
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
        const id = this.state.model._id;
        fetch(`http://${config.host}/api/categories/${id}`, {
            method: 'DELETE'
        })
            .then(() => console.log(`deleted category ${id} successfully`))
            .catch(err => console.error(err))
    };

    handleUpdateClose = () => this.setState({model: {}});

    handleUpdateShow = (item) => this.setState({model: item});

    componentWillMount = () => this.loadCategories();

    render() {
        const model = this.state.model;
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
                <Modal show={Object.entries(model).length > 0} onHide={() => this.handleUpdateClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update {model._id}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <CategoryModel model={model} />
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