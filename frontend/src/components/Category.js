import React, {Component} from "react"
import {Button, Modal, Form, Table, Row} from "react-bootstrap"
import CategoryModel from "./CategoryModel"
import config from "../config.json"

export default class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model: {},
            newModel: {},
            categories: []
        };

        this.loadCategories.bind(this);
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

    stringifyCategory = model => {
        // exclude _id
        return JSON.stringify({
            name: `${model.sex}${model.year}`,
            year: model.year,
            sex: model.sex,
            distance: model.distance,
        });
    };

    createCategory = () => {
        fetch(`http://${config.host}/api/categories`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: this.stringifyCategory(this.state.newModel)
        })
            .then(() => console.log(`created category successfully`))
            .then(() => this.loadCategories())
            .catch(err => console.error(err))
    };

    updateCategory = () => {
        const id = this.state.model._id;
        fetch(`http://${config.host}/api/categories/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: this.stringifyCategory(this.state.model)
        })
            .then(() => console.log(`updated category ${id} successfully`))
            .then(() => this.loadCategories())
            .catch(err => console.error(err))
    };

    deleteCategory = () => {
        const id = this.state.model._id;
        fetch(`http://${config.host}/api/categories/${id}`, {
            method: 'DELETE'
        })
            .then(() => console.log(`deleted category ${id} successfully`))
            .then(() => this.loadCategories())
            .catch(err => console.error(err))
    };

    componentWillMount = () => this.loadCategories();

    render() {
        const model = this.state.model;
        const newModel = this.state.newModel;
        const rows = [];
        this.state.categories.forEach(item => {
            rows.push(<tr key={item._id} onClick={() => {
                this.setState({
                    model: item
                });
            }}>
                <td>{item.name}</td>
                <td>{item.year}</td>
                <td>{item.sex}</td>
                <td>{item.distance}</td>
            </tr>)
        });
        return (
            <div>
                {/*Create*/}
                <Modal show={Object.entries(newModel).length > 0} onHide={() => this.setState({newModel: {}})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create new category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <CategoryModel model={newModel} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({newModel: {}})}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => {
                            this.createCategory();
                            this.setState({newModel: {}})
                        }}>
                            Create
                        </Button>
                    </Modal.Footer>
                </Modal>
                {/*Update / Delete*/}
                <Modal show={Object.entries(model).length > 0} onHide={() => this.setState({model: {}})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update category {model.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <CategoryModel model={model} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({model: {}})}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={() => {
                            this.deleteCategory();
                            this.setState({model: {}})
                        }}>
                            Delete
                        </Button>
                        <Button variant="primary" onClick={() => {
                            this.updateCategory();
                            this.setState({model: {}})
                        }}>
                            Update
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Button variant="outline-primary" onClick={() => this.setState({
                    newModel: {
                        year: 7,
                        sex: 'm',
                        distance: 50
                    }
                })} >Hinzufügen</Button>

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