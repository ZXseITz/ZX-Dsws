import React, {Component} from "react"
import {Button, Modal, Form, Table} from "react-bootstrap"

export default class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            athlete: []
        };

        this.loadAthlete.bind(this);
        this.handleClose.bind(this);
        this.handleShow.bind(this);
        this.uploadFile.bind(this);
    };

    loadAthlete = () => {
        fetch('http://localhost:8001/api/athlete', {
            method: 'GET'
        })
            .catch(err => console.error(err))
            .then(res => res.json())
            .then(data => this.setState({athlete: data}))
    };

    handleClose = () => this.setState({showModal: false});

    handleShow = () => this.setState({showModal: true});

    uploadFile = () => {
        const file = document.getElementById('input').files[0];
        const data = new FormData();
        data.append('csv', file);
        fetch('http://localhost:8001/api/athlete/upload', {
            method: 'POST',
            body: data
        })
            .catch(err => console.error(err))
            .then(res => console.log(res.status));
        this.handleClose();
    };

    componentWillMount = () => this.loadAthlete();

    render() {
        // console.log(this.state.athlete);
        const rows = [];
        this.state.athlete.forEach(item => {
            rows.push(<tr>
                <td>{item.firstname}</td>
                <td>{item.surname}</td>
                <td>{item.sex}</td>
                <td>{item.schoolClass}</td>
                <td>{item.category}</td>
                <td>{item.distance}</td>
                <td>0</td>
            </tr>)
        });
        return (
            <div>
                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload Schülerliste</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control id="input" type="file" placeholder="Select file"/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.uploadFile}>
                            Upload
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Table>
                    <thead>
                    <tr>
                        <th>Vorname</th>
                        <th>Nachname</th>
                        <th>Geschlecht</th>
                        <th>Klasse</th>
                        <th>Kategorie</th>
                        <th>Distanz</th>
                        <th>Zeit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </Table><Button variant="outline-primary" onClick={this.handleShow}>Upload</Button>
            </div>
        );
    };
}