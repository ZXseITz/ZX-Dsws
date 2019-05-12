import React, {Component} from "react"
import config from "../config";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './Block.css'
import $ from "jquery";

export default class Block extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dns: []
        }
    }

    load() {
        Promise.all([
            fetch(`http://${config.host}/api/blocks`, {method: 'GET'})
                .then(res => res.json()),
            fetch(`http://${config.host}/api/students?dns=1`, {method: 'GET'})
                .then(res => res.json())
        ])
            .then(data => this.setState({
                data: data[0],
                dns: data[1]
            }))
            .catch(err => console.error(err))
    };

    createRunOder() {
        fetch(`http://${config.host}/api/runOrder`, {
            method: 'POST'
        })
            .then(() => console.log(`created run order successfully`))
            .then(() => this.load())
            .catch(err => console.error(err))
    };

    createBlock(block) {
        fetch(`http://${config.host}/api/blocks`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(block)
        })
            .then(() => console.log(`created block successfully`))
            .then(() => this.load())
            .catch(err => console.error(err))
    }

    updateBlock(id, block) {
        fetch(`http://${config.host}/api/blocks/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(block)
        })
            .then(() => console.log(`updated block ${id} successfully`))
            .then(() => this.load())
            .catch(err => console.error(err))
    }

    deleteBlock(id) {
        fetch(`http://${config.host}/api/blocks/${id}`, {
            method: 'DELETE'
        })
            .then(() => console.log(`deleted block ${id} successfully`))
            .then(() => this.load())
            .catch(err => console.error(err))
    }

    updateStudentDNS(id) {
        fetch(`http://${config.host}/api/students/${id}/dns`, {
            method: 'PUT',
        })
            .then(() => console.log(`changed student ${id} to DNS`))
            .then(() => this.load())
            .catch(err => console.error(err))
    }

    componentDidMount() {
        // $('#create-datepicker').datetimepicker();
        // $('#modify-datepicker').datetimepicker();
        this.load();
    }

    render() {
        const items = [];
        this.state.data.forEach(item => {
            const date = new Date(item.startTime);
            const rows = [];
            item.students.forEach(a => {
                rows[a.run.track - 1] = <tr key={a._id} onClick={() => {
                    this.updateStudentDNS(a._id);
                }}>
                    <td>{a.run.track}</td>
                    <td>{a.firstname}</td>
                    <td>{a.surname}</td>
                    <td>{a.startNumber}</td>
                    <td>{a.categoryId}</td>
                    <td>{a.yearOfBirth}</td>
                    <td>{a.classId}</td>
                </tr>;
            });
            items.push(<div key={item.blockId} className='row block'>
                <div className='col-4 block-title' onClick={() => {
                    $("#modify-id").val(item._id);
                    $("#modify-blockId").val(item.blockId);
                    $("#modify-startTimeHour").val(date.getHours());
                    $("#modify-startTimeMinute").val(date.getMinutes());
                    $("#modal-modify").modal()
                }}>
                    <h4>Block: {item.blockId}</h4>
                    <p>Startzeit: {date.toLocaleTimeString()}</p>
                    <p>Distanz: {item.distance}m</p>
                </div>
                <div className='col-8'>
                    <table className="table table-bordered">
                        <tbody>
                        {rows}
                        </tbody>
                    </table>
                </div>
            </div>)
        });
        const dns = [];
        this.state.dns.forEach(item => {
            dns.push(<option>{item.startNumber} {item.firstname} {item.surname}</option>)
        });

        return <div>
            {/*Create*/}
            <div className="modal fade" id="modal-create" tabIndex="-1" role="dialog"
                 aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalCenterTitle">Block erstellen</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <div className="form-group">
                                    <label>Block</label>
                                    <input id="create-blockId" className="form-control" type="text" defaultValue="0"/>
                                </div>
                                <div className="form-group">
                                    <label>Startzeit</label>
                                    <div className="form-control">
                                        <input id="create-startTimeHour" type='text'/>
                                        :
                                        <input id="create-startTimeMinute" type='text'/>
                                    </div>
                                    {/*<div id="create-datepicker" className="input-group date">*/}
                                    {/*    <input id="create-startTime" type='text' className="form-control"/>*/}
                                    {/*    <span className="input-group-addon">*/}
                                    {/*        <span className="glyphicon glyphicon-calendar"></span>*/}
                                    {/*    </span>*/}
                                    {/*</div>*/}
                                </div>
                                <div className="form-group">
                                    <label>Bahn 1</label>
                                    <select id="create-track1" className="form-control">
                                        {dns}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Bahn 2</label>
                                    <select id="create-track2" className="form-control">
                                        {dns}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Bahn 3</label>
                                    <select id="create-track3" className="form-control">
                                        {dns}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Bahn 4</label>
                                    <select id="create-track4" className="form-control">
                                        {dns}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Schliessen
                            </button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => {
                                const hour = $("#create-startTimeHour").val();
                                const minute = $("#create-startTimeMinute").val();
                                this.createBlock({
                                    blockId: parseInt($("#create-blockId").val()),
                                    startTime: new Date(Date.parse(`2019-05-24 ${hour}:${minute}:00`))
                                });
                            }}>Erstellen
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/*Update / Delete*/}
            <div className="modal fade" id="modal-modify" tabIndex="-1" role="dialog"
                 aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalCenterTitle">Block bearbeiten</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <input id="modify-id" type="hidden"/>
                            <div className="form-group">
                                <label>Block</label>
                                <input id="modify-blockId" className="form-control" type="text"/>
                            </div>
                            <div className="form-group">
                                <label>Startzeit</label>
                                <div className="form-control">
                                    <input id="modify-startTimeHour" type='text'/>
                                    :
                                    <input id="modify-startTimeMinute" type='text'/>
                                </div>
                                {/*<div id="modify-datepicker" className="input-group date">*/}
                                {/*<input id="modify-startTime" type='text' className="form-control"/>*/}
                                {/*<span className="input-group-addon">*/}
                                {/*    <span className="glyphicon glyphicon-calendar"></span>*/}
                                {/*</span>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Schliessen
                            </button>
                            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => {
                                this.deleteBlock($("#modify-id").val());
                            }}>Löschen
                            </button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => {
                                const hour = $("#modify-startTimeHour").val();
                                const minute = $("#modify-startTimeMinute").val();
                                this.updateBlock($("#modify-id").val(), {
                                    blockId: parseInt($("#modify-blockId").val()),
                                    startTime: new Date(Date.parse(`2019-05-24 ${hour}:${minute}:00`))
                                });
                            }}>Aktualisieren
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <button type="button" className="btn btn-primary" onClick={this.createRunOder}>Startgruppen automatisch
                erstellen
            </button>
            <button type="button" className="btn btn-primary" onClick={() => {
                $('#modal-create').modal()
            }}>
                Erstellen
            </button>
            <div className='container'>
                {items}
            </div>
        </div>;
    };
}