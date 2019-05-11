import React, {Component} from "react"
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import config from "../config.json"
import $ from "jquery";

export default class Student extends Component {
    constructor(props) {
        super(props);
        this.state = {
            athlete: []
        };

        this.uploadFile.bind(this);
        this.loadAthlete.bind(this);
        this.createStudent.bind(this);
        this.updateStudent.bind(this);
        this.deleteStudent.bind(this);
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
        fetch(`http://${config.host}/api/students`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => this.setState({athlete: data}))
            .catch(err => console.error(err))
    };

    createStudent = (athlete) => {
        fetch(`http://${config.host}/api/students`, {
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

    updateStudent = (id, athlete) => {
        fetch(`http://${config.host}/api/students/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(athlete)
        })
            .then(() => console.log(`updated student ${id} successfully`))
            .then(() => this.setState({model: {}}))
            .then(() => this.loadAthlete())
            .catch(err => console.error(err))
    };

    deleteStudent = (id) => {
        fetch(`http://${config.host}/api/students/${id}`, {
            method: 'DELETE'
        })
            .then(() => console.log(`deleted student ${id} successfully`))
            .then(() => this.setState({model: {}}))
            .then(() => this.loadAthlete())
            .catch(err => console.error(err))
    };

    componentDidMount = () => this.loadAthlete();

    render() {
        const rows = [];
        this.state.athlete.forEach(item => {
            rows.push(<tr key={item._id} onClick={() => {
                $("#modify-id").val(item._id);
                $("#modify-startNumber").val(item.startNumber);
                $("#modify-firstname").val(item.firstname);
                $("#modify-surname").val(item.surname);
                $("#modify-yearOfBirth").val(item.yearOfBirth);
                $("#modify-classId").val(item.classId);
                $("#modify-categoryId").val(item.categoryId);
                $("#modal-modify").modal();
            }}>
                <td>{item.startNumber}</td>
                <td>{item.firstname}</td>
                <td>{item.surname}</td>
                <td>{item.yearOfBirth}</td>
                <td>{item.classId}</td>
                <td>{item.categoryId}</td>
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
                                <h5 className="modal-title" id="exampleModalCenterTitle">Schüler erstellen</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    <div className="form-group">
                                        <label>Startnummer</label>
                                        <input id="create-startNumber" className="form-control" type="text" defaultValue="0"/>
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
                                        <input id="create-yearOfBirth" className="form-control" type="text" defaultValue="2019"/>
                                    </div>
                                    <div className="form-group">
                                        <label>Klasse</label>
                                        <input id="create-classId" className="form-control" type="text"/>
                                    </div>
                                    <div className="form-group">
                                        <label>Kategorie</label>
                                        <input id="create-categoryId" className="form-control" type="text"/>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Schliessen
                                </button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => {
                                    this.createStudent({
                                        startNumber: parseInt($("#create-startNumber").val()),
                                        firstname: $("#create-firstname").val(),
                                        surname: $("#create-surname").val(),
                                        yearOfBirth: $("#create-yearOfBirth").val(),
                                        classId: $("#create-classId").val(),
                                        categoryId: parseInt($("#create-categoryId").val()),
                                    });
                                }}>Erstellen
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
                                <h5 className="modal-title" id="exampleModalCenterTitle">Schüler bearbeiten</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    <input id="modify-id" type="hidden"/>
                                    <div className="form-group">
                                        <label>Startnummer</label>
                                        <input id="modify-startNumber" className="form-control" type="text" defaultValue="0"/>
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
                                        <input id="modify-yearOfBirth" className="form-control" type="text" defaultValue="2019"/>
                                    </div>
                                    <div className="form-group">
                                        <label>Klasse</label>
                                        <input id="modify-classId" className="form-control" type="text"/>
                                    </div>
                                    <div className="form-group">
                                        <label>Kategorie</label>
                                        <input id="modify-categoryId" className="form-control" type="text"/>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Schliessen
                                </button>
                                <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => {
                                    this.deleteStudent($("#modify-id").val());
                                }}>Löschen</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => {
                                    this.updateStudent($("#modify-id").val(), {
                                        startNumber: parseInt($("#modify-startNumber").val()),
                                        firstname: $("#modify-firstname").val(),
                                        surname: $("#modify-surname").val(),
                                        yearOfBirth: parseInt($("#modify-yearOfBirth").val()),
                                        classId: $("#modify-classId").val(),
                                        categoryId: $("#modify-categoryId").val(),
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