import React, {Component} from "react"
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import config from "../config.json"
import $ from "jquery";
import StudentItem from "./StudentItem";

export default class Students extends Component {
    constructor(props) {
        super(props);
        this.state = {
            students: [],
            create: {}
        };

        this.uploadFile.bind(this);
        this.loadStudents.bind(this);
        this.createStudent.bind(this);
        this.updateStudent.bind(this);
        this.deleteStudent.bind(this);
    };

    uploadFile = () => {
        const file = $('#upload').prop('files')[0];
        const data = new FormData();
        data.append('csv', file);
        fetch(`http://${config.host}/api/uploadStudents`, {
            method: 'POST',
            body: data
        })
            .then(res => console.log(res.status))
            .catch(err => console.error(err));
    };

    loadStudents = () => {
        fetch(`http://${config.host}/api/students`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => this.setState({
                students: data,
                create: {}
            }))
            .catch(err => console.error(err))
    };

    createStudent = (student) => {
        student.run = {
            blockId: 0,
                track: 0,
                state: 3,
                time:0.0
        };
        fetch(`http://${config.host}/api/students`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(student)
        })
            .then(() => console.log(`crated athlete successfully`))
            .then(() => this.loadStudents())
            .catch(err => console.error(err))
    };

    updateStudent = (id, student) => {
        fetch(`http://${config.host}/api/students/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(student)
        })
            .then(() => console.log(`updated student ${id} successfully`))
            .then(() => this.loadStudents())
            .catch(err => console.error(err))
    };

    deleteStudent = (id) => {
        fetch(`http://${config.host}/api/students/${id}`, {
            method: 'DELETE'
        })
            .then(() => console.log(`deleted student ${id} successfully`))
            .then(() => this.loadStudents())
            .catch(err => console.error(err))
    };

    componentDidMount = () => this.loadStudents();

    render() {
        const rows = [];
        const cs = this.state.create;
        if (Object.entries(cs).length > 0) {
            rows.push(<StudentItem key={-1} type="add" item={cs} onSave={x => {
                this.createStudent(x);
            }} onCancel={() => {
                this.setState({create: {}});
            }} />)
        }
        this.state.students.forEach((item, i) => {
            rows.push(<StudentItem key={i} type="read" item={item} onSave={x => {
                this.updateStudent(item._id, x);
            }} onDelete={() => {
                this.deleteStudent(item._id);
            }} />)
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

                <button type="button" className="btn btn-primary" onClick={() => {
                    $("#modal-upload").modal();
                }}>
                    Hochladen
                </button>
                <button type="button" className="btn btn-primary" onClick={() => {
                    this.setState({create: {
                            startNumber: 0,
                            firstName: "",
                            surname: "",
                            yearOfBirth: 2019,
                            classId: "",
                            categoryId: "",
                        }});
                }}>
                    Hinzufügen
                </button>

                <div className="container">
                    <div className="row">
                        <div className="col"/>
                        <div className="col-10">
                            <div className="row entries-header">
                                <div className="col-1">SN</div>
                                <div className="col-2">Vorname</div>
                                <div className="col-3">Nachname</div>
                                <div className="col-1">Geb.</div>
                                <div className="col-2">Klasse</div>
                                <div className="col-1">Kat.</div>
                                <div className="col-2"/>
                            </div>
                            {rows}
                        </div>
                        <div className="col"/>
                    </div>
                </div>
            </div>
        );
    };
}