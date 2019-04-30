import React, {Component} from "react"
import {Button, Modal, Form, Table} from "react-bootstrap"
import config from "../config.json"

export default class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showUploadModal: false,
            updateItem: null,
            athlete: []
        };

        this.loadAthlete.bind(this);
        this.updateAthlete.bind(this);
        this.handleUploadClose.bind(this);
        this.handleUploadShow.bind(this);
        this.handleUpdateClose.bind(this);
        this.handleUpdateShow.bind(this);
        this.uploadFile.bind(this);
    };

    loadAthlete = () => {
        fetch(`http://${config.host}/api/athlete`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => this.setState({athlete: data}))
            .catch(err => console.error(err))
    };

    handleUploadClose = () => this.setState({showUploadModal: false});

    handleUploadShow = () => this.setState({showUploadModal: true});

    uploadFile = () => {
        const file = document.getElementById('input').files[0];
        const data = new FormData();
        data.append('csv', file);
        fetch(`http://${config.host}/api/athlete/upload`, {
            method: 'POST',
            body: data
        })
            .then(res => console.log(res.status))
            .catch(err => console.error(err));
        this.handleUploadClose();
        this.loadAthlete();
    };

    handleUpdateClose = () => this.setState({updateItem: null});

    handleUpdateShow = (item) => this.setState({updateItem: item});

    updateAthlete = item => {
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

    componentWillMount = () => this.loadAthlete();

    render() {
        const updateItem = this.state.updateItem;
        const rows = [];
        this.state.athlete.forEach(item => {
            rows.push(<tr key={item._id} onClick={() => {
                this.handleUpdateShow(item);
            }}>
                <td>{item.firstname}</td>
                <td>{item.surname}</td>
                <td>{item.year}</td>
                <td>{item.schoolClass}</td>
                <td>{item.category}</td>
                <td>{item.distance}</td>
                <td>{this.getStateText(item.state)}</td>
                <td>{item.time}</td>
            </tr>)
        });
        return (
            <div>
                <Modal show={this.state.showUploadModal} onHide={this.handleUploadClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload Schülerliste</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control id="input" type="file" placeholder="Select file"/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleUploadClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.uploadFile}>
                            Upload
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={updateItem !== null} onHide={this.handleUpdateClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update {updateItem != null ? updateItem._id : ''}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Vorname</Form.Label>
                                <Form.Control type='text'
                                              defaultValue={updateItem !== null ? updateItem.firstname : ''}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Nachname</Form.Label>
                                <Form.Control type='text' defaultValue={updateItem !== null ? updateItem.surname : ''}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Jahrgang</Form.Label>
                                <Form.Control type='text' defaultValue={updateItem !== null ? updateItem.year : ''}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Klasse</Form.Label>
                                <Form.Control type='text'
                                              defaultValue={updateItem !== null ? updateItem.schoolClass : ''}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Kategorie</Form.Label>
                                <Form.Control type='text'
                                              defaultValue={updateItem !== null ? updateItem.category : ''}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Distanz</Form.Label>
                                <Form.Control type='text'
                                              defaultValue={updateItem !== null ? updateItem.distance : ''}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Status</Form.Label>
                                <Form.Control as="select"
                                              defaultValue={updateItem !== null ? this.getStateText(updateItem.state) : "Pending"}
                                >
                                    <option>Finished</option>
                                    <option>Pending</option>
                                    <option>DNS</option>
                                    <option>DNF</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Zeit</Form.Label>
                                <Form.Control type='text' id="formTime"
                                              defaultValue={updateItem !== null ? updateItem.time : ''}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleUpdateClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.updateAthlete(updateItem)}>
                            Update
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Button variant="outline-primary" onClick={this.handleUploadShow}>Upload</Button>

                <Table bordered hover>
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