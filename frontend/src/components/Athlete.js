import React, {Component} from "react"
import {Button, Modal, Form, Table} from "react-bootstrap"
import config from "../config.json"
import AthleteModel from "./AthleteModel";

export default class Athlete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showUploadModal: false,
            model: {},
            newModel: {},
            athlete: []
        };

        this.uploadFile.bind(this);
        this.loadAthlete.bind(this);
        this.createAthlete.bind(this);
        this.updateAthlete.bind(this);
        this.deleteAthlete.bind(this);
    };

    uploadFile = () => {
        const file = document.getElementById('input').files[0];
        const data = new FormData();
        data.append('csv', file);
        fetch(`http://${config.host}/api/upload`, {
            method: 'POST',
            body: data
        })
            .then(res => console.log(res.status))
            .catch(err => console.error(err));
    };

    stringifyAthlete = model => {
        // exclude _id
        return JSON.stringify({
            number: model.number,
            firstname: model.firstname,
            surname: model.surname,
            year: model.year,
            schoolClass: model.schoolClass,
            category: model.category,
            state: model.state,
            time: model.time,
        });
    };

    loadAthlete = () => {
        fetch(`http://${config.host}/api/athlete`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => this.setState({athlete: data}))
            .catch(err => console.error(err))
    };


    createAthlete = () => {
        fetch(`http://${config.host}/api/athlete`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: this.stringifyAthlete(this.state.newModel)
        })
            .then(() => console.log(`crated athlete successfully`))
            .then(() => this.setState({newModel: {}}))
            .then(() => this.loadAthlete())
            .catch(err => console.error(err))
    };

    updateAthlete = () => {
        const id = this.state.model._id;
        fetch(`http://${config.host}/api/athlete/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: this.stringifyAthlete(this.state.model)
        })
            .then(() => console.log(`updated athlete ${id} successfully`))
            .then(() => this.setState({model: {}}))
            .then(() => this.loadAthlete())
            .catch(err => console.error(err))
    };

    deleteAthlete = () => {
        const id = this.state.model._id;
        fetch(`http://${config.host}/api/athlete/${id}`, {
            method: 'DELETE'
        })
            .then(() => console.log(`deleted athlete ${id} successfully`))
            .then(() => this.setState({model: {}}))
            .then(() => this.loadAthlete())
            .catch(err => console.error(err))
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

    componentDidMount = () => this.loadAthlete();

    render() {
        const newModel = this.state.newModel;
        const model = this.state.model;
        const rows = [];
        this.state.athlete.forEach(item => {
            rows.push(<tr key={item._id} onClick={() => {
                this.setState({
                    model: item
                });
            }}>
                <td>{item.number}</td>
                <td>{item.firstname}</td>
                <td>{item.surname}</td>
                <td>{item.year}</td>
                <td>{item.schoolClass}</td>
                <td>{item.category}</td>
                <td>{this.getStateText(item.state)}</td>
                <td>{item.time}</td>
            </tr>)
        });
        return (
            <div>
                <Modal show={this.state.showUploadModal} onHide={() => this.setState({showUploadModal: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload Schülerliste</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control id="input" type="file" placeholder="Select file"/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({showUploadModal: false})}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.uploadFile}>
                            Upload
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={Object.entries(newModel).length > 0} onHide={() => this.setState({model: {}})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create athlete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AthleteModel model={newModel}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({newModel: {}})}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.createAthlete}>
                            Create
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={Object.entries(model).length > 0} onHide={() => this.setState({model: {}})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update {model.number}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AthleteModel model={model}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({model: {}})}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={this.deleteAthlete}>
                            Delete
                        </Button>
                        <Button variant="primary" onClick={this.updateAthlete}>
                            Update
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Button variant="outline-primary" onClick={() => this.setState({showUploadModal: true})}>Upload</Button>
                <Button variant="outline-primary" onClick={() => this.setState({newModel: {
                        number: 0,
                        firstname: '',
                        surname: '',
                        year: 2019,
                        schoolClass: '',
                        category: '',
                        state: 1,
                        time: 0,
                    }})}>Create</Button>

                <Table bordered hover>
                    <thead>
                    <tr>
                        <th>Startnummer</th>
                        <th>Vorname</th>
                        <th>Nachname</th>
                        <th>Jahrgang</th>
                        <th>Klasse</th>
                        <th>Kategorie</th>
                        <th>Status</th>
                        <th>Zeit</th>
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