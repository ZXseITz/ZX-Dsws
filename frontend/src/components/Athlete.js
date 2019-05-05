import React, {Component} from "react"
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import config from "../config.json"
import $ from "jquery";

export default class Athlete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            athlete: []
        };

        this.uploadFile.bind(this);
        this.loadAthlete.bind(this);
        this.createAthlete.bind(this);
        this.updateAthlete.bind(this);
        this.deleteAthlete.bind(this);
    };

    uploadFile = () => {
        const file = $('#upload').prop('files')[0];
        const data = new FormData();
        data.append('csv', file);
        fetch(`http://${config.host}/api/upload`, {
            method: 'POST',
            body: data
        })
            .then(res => console.log(res.status))
            .catch(err => console.error(err));
    };

    loadAthlete = () => {
        fetch(`http://${config.host}/api/athlete`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => this.setState({athlete: data}))
            .catch(err => console.error(err))
    };

    createAthlete = (athlete) => {
        fetch(`http://${config.host}/api/athlete`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(athlete)
        })
            .then(() => console.log(`crated athlete successfully`))
            .then(() => this.setState({newModel: {}}))
            .then(() => this.loadAthlete())
            .catch(err => console.error(err))
    };

    updateAthlete = (id, athlete) => {
        fetch(`http://${config.host}/api/athlete/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(athlete)
        })
            .then(() => console.log(`updated athlete ${id} successfully`))
            .then(() => this.setState({model: {}}))
            .then(() => this.loadAthlete())
            .catch(err => console.error(err))
    };

    deleteAthlete = (id) => {
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

    getStateId = state => {
        switch (state) {
            case 'Finished':
                return 0;
            case 'Pending':
                return 1;
            case 'DNS':
                return 2;
            case 'DNF':
                return 3;
        }
    };

    componentDidMount = () => this.loadAthlete();

    render() {
        const rows = [];
        this.state.athlete.forEach(item => {
            rows.push(<tr key={item._id} onClick={() => {
                $("#modify-id").val(item._id);
                $("#modify-number").val(item.number);
                $("#modify-firstname").val(item.firstname);
                $("#modify-surname").val(item.surname);
                $("#modify-year").val(item.year);
                $("#modify-schoolclass").val(item.schoolClass);
                $("#modify-category").val(item.category);
                $("#modify-state").val(this.getStateText(item.state));
                $("#modify-time").val(item.time);
                $("#modal-modify").modal();
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
                {/*Upload*/}
                <div className="modal fade" id="modal-upload" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalCenterTitle">Schülerliste hochladen</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    <input className="form-control-file" id="upload" type="file" placeholder="Select file"/>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Schliessen
                                </button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => {
                                    this.uploadFile()
                                }}>Hochladen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/*Create*/}
                <div className="modal fade" id="modal-create" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalCenterTitle">Modal title</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    <div className="form-group">
                                        <label>Startnummer</label>
                                        <input id="create-number" className="form-control" type="text" defaultValue="0"/>
                                    </div>
                                    <div className="form-group">
                                        <label>Vorname</label>
                                        <input id="create-firstname" className="form-control" type="text"/>
                                    </div>
                                    <div className="form-group">
                                        <label>Nachname</label>
                                        <input id="create-surname" className="form-control" type="text"/>
                                    </div>
                                    <div className="form-group">
                                        <label>Jahrgang</label>
                                        <input id="create-year" className="form-control" type="text" defaultValue="2019"/>
                                    </div>
                                    <div className="form-group">
                                        <label>Klasse</label>
                                        <input id="create-schoolclass" className="form-control" type="text"/>
                                    </div>
                                    <div className="form-group">
                                        <label>Kategorie</label>
                                        <input id="create-category" className="form-control" type="text"/>
                                    </div>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select id="create-state" className="form-control" defaultValue="Pending">
                                            <option>Finished</option>
                                            <option>Pending</option>
                                            <option>DNS</option>
                                            <option>DNF</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Zeit</label>
                                        <input id="create-time" className="form-control" type="text" defaultValue="0"/>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Schliessen
                                </button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => {
                                    this.createAthlete({
                                        number: $("#create-number").val(),
                                        firstname: $("#create-firstname").val(),
                                        surname: $("#create-surname").val(),
                                        year: $("#create-year").val(),
                                        schoolClass: $("#create-schoolclass").val(),
                                        category: $("#create-category").val(),
                                        state: this.getStateId($("#create-state").val()),
                                        time: $("#create-time").val(),
                                    });
                                }}>Hinzufügen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="modal-modify" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalCenterTitle">Modal title</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    <input id="modify-id" type="hidden"/>
                                    <div className="form-group">
                                        <label>Startnummer</label>
                                        <input id="modify-number" className="form-control" type="text" defaultValue="0"/>
                                    </div>
                                    <div className="form-group">
                                        <label>Vorname</label>
                                        <input id="modify-firstname" className="form-control" type="text"/>
                                    </div>
                                    <div className="form-group">
                                        <label>Nachname</label>
                                        <input id="modify-surname" className="form-control" type="text"/>
                                    </div>
                                    <div className="form-group">
                                        <label>Jahrgang</label>
                                        <input id="modify-year" className="form-control" type="text" defaultValue="2019"/>
                                    </div>
                                    <div className="form-group">
                                        <label>Klasse</label>
                                        <input id="modify-schoolclass" className="form-control" type="text"/>
                                    </div>
                                    <div className="form-group">
                                        <label>Kategorie</label>
                                        <input id="modify-category" className="form-control" type="text"/>
                                    </div>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select id="modify-state" className="form-control">
                                            <option>Finished</option>
                                            <option>Pending</option>
                                            <option>DNS</option>
                                            <option>DNF</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Zeit</label>
                                        <input id="modify-time" className="form-control" type="text" defaultValue="0"/>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Schliessen
                                </button>
                                <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => {
                                    this.deleteAthlete($("#modify-id").val());
                                }}>Löschen</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => {
                                    this.updateAthlete($("#modify-id").val(), {
                                        number: $("#modify-number").val(),
                                        firstname: $("#modify-firstname").val(),
                                        surname: $("#modify-surname").val(),
                                        year: $("#modify-year").val(),
                                        schoolClass: $("#modify-schoolclass").val(),
                                        category: $("#modify-category").val(),
                                        state: this.getStateId($("#modify-state").val()),
                                        time: $("#modify-time").val(),
                                    });
                                }}>Aktualisieren</button>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="button" className="btn btn-primary" onClick={() => {
                    $("#modal-upload").modal();
                }}>
                    Hochladen
                </button>
                <button type="button" className="btn btn-primary" onClick={() => {
                    $("#modal-create").modal();
                }}>
                    Hinzufügen
                </button>

                <table className="table table-bordered table-hover">
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
                </table>
            </div>
        );
    };
}