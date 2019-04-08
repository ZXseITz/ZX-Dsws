import React, {Component} from "react"
import {Button, Modal, Form, Table} from "react-bootstrap"
import config from "../config.json"

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
            .then(res => res.json())
            .then(data => this.setState({athlete: data}))
            .catch(err => console.error(err))
    };

    handleClose = () => this.setState({showModal: false});

    handleShow = () => this.setState({showModal: true});

    uploadFile = () => {
        const file = document.getElementById('input').files[0];
        const data = new FormData();
        data.append('csv', file);
        fetch(`http://${config}/api/athlete/upload`, {
            method: 'POST',
            body: data
        })
            .then(res => console.log(res.status))
            .catch(err => console.error(err));
        this.handleClose();
        this.loadAthlete();
    };

    componentWillMount = () => this.loadAthlete();

    render() {
        // console.log(this.state.athlete);
        const rows = [];
        this.state.athlete.forEach(item => {
            let state;
            switch (item.state) {
                case 0:
                    state = 'Finished';
                    break;
                case 1:
                    state = 'Pending';
                    break;
                case 2:
                    state = 'DNS';
                    break;
                case 3:
                    state = 'DNF';
                    break;
            }
            rows.push(<tr>
                <td>{item.firstname}</td>
                <td>{item.surname}</td>
                <td>{item.year}</td>
                <td>{item.schoolClass}</td>
                <td>{item.category}</td>
                <td>{item.distance}</td>
                <td>{state}</td>
                <td>{item.time}</td>
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

                <Button variant="outline-primary" onClick={this.handleShow}>Upload</Button>

                <Table>
                    <thead>
                    <tr>
                        <th>Vorname</th>
                        <th>Nachname</th>
                        <th>Jahrgang</th>
                        <th>Klasse</th>
                        <th>Kategorie</th>
                        <th>Distanz</th>
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