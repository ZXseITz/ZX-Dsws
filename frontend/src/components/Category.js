import React, {Component} from "react"
import $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import config from "../config.json"

export default class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            name: `${model.sex}${model.age}`,
            age: model.age,
            sex: model.sex,
            distance: model.distance,
        });
    };

    createCategory = (category) => {
        fetch(`http://${config.host}/api/categories`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: this.stringifyCategory(category)
        })
            .then(() => console.log(`created category successfully`))
            .then(() => this.loadCategories())
            .catch(err => console.error(err))
    };

    updateCategory = (id, category) => {
        fetch(`http://${config.host}/api/categories/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: this.stringifyCategory(category)
        })
            .then(() => console.log(`updated category ${id} successfully`))
            .then(() => this.loadCategories())
            .catch(err => console.error(err))
    };

    deleteCategory = (id) => {
        fetch(`http://${config.host}/api/categories/${id}`, {
            method: 'DELETE'
        })
            .then(() => console.log(`deleted category ${id} successfully`))
            .then(() => this.loadCategories())
            .catch(err => console.error(err))
    };

    componentDidMount = () => this.loadCategories();

    render() {
        const rows = [];
        this.state.categories.forEach(item => {
            rows.push(<tr key={item._id} onClick={() => {
                $("#modify-id").val(item._id);
                $("#modify-age").val(item.age);
                $("#modify-sex").val(item.sex);
                $("#modify-distance").val(item.distance);
                $("#modal-modify").modal();
            }}>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>{item.sex}</td>
                <td>{item.distance}</td>
            </tr>)
        });
        return (
            <div>
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
                                        <label>Alter</label>
                                        <input id="create-age" className="form-control" type="text" defaultValue="7"/>
                                    </div>
                                    <div className="form-group">
                                        <label>Geschlecht</label>
                                        <select id="create-sex" className="form-control">
                                            <option>m</option>
                                            <option>w</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Distanz</label>
                                        <input id="create-distance" className="form-control" type="text"
                                               defaultValue="50"/>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Schliessen
                                </button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => {
                                    this.createCategory({
                                        age: $("#create-age").val(),
                                        sex: $("#create-sex").val(),
                                        distance: $("#create-distance").val()
                                    });
                                }}>Hinzufügen
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
                                <h5 className="modal-title" id="exampleModalCenterTitle">Modal title</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <input id="modify-id" type="hidden"/>
                                <div className="form-group">
                                    <label>Alter</label>
                                    <input id="modify-age" className="form-control" type="text"/>
                                </div>
                                <div className="form-group">
                                    <label>Geschlecht</label>
                                    <select id="modify-sex" className="form-control">
                                        <option>m</option>
                                        <option>w</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Distanz</label>
                                    <input id="modify-distance" className="form-control" type="text"/>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Schliessen
                                </button>
                                <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => {
                                    this.deleteCategory($("#modify-id").val());
                                }}>Löschen</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => {
                                    this.updateCategory($("#modify-id").val(), {
                                        age: $("#modify-age").val(),
                                        sex: $("#modify-sex").val(),
                                        distance: $("#modify-distance").val()
                                    });
                                }}>Aktualisieren</button>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="button" className="btn btn-primary" onClick={() => {
                    $('#modal-create').modal()
                }}>
                    Hinzufügen
                </button>

                <table className="table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Alter</th>
                        <th>Geschlecht</th>
                        <th>Distanz</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
            </div>
        );
    }
    ;
}