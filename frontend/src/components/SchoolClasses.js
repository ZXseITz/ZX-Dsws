import React, {Component} from "react"
import config from "../config";
import SchoolClassItem from "./SchoolClassItem";


export default class SchoolClasses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            create: {}
        };
        this.load.bind(this);
        this.create.bind(this);
        this.update.bind(this);
        this.delete.bind(this);
    }

    load() {
        fetch(`http://${config.host}/api/classes`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => this.setState({
                data: data,
                create: {},
            }))
            .catch(err => console.error(err))
    };

    create(obj) {
        fetch(`http://${config.host}/api/classes`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: obj
        })
            .then(() => console.log(`created class successfully`))
            .then(() => this.load())
            .catch(err => console.error(err))
    };

    update(id, obj) {
        fetch(`http://${config.host}/api/classes/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: obj
        })
            .then(() => console.log(`updated class ${id} successfully`))
            .then(() => this.load())
            .catch(err => console.error(err))
    };

    delete = (id) => {
        fetch(`http://${config.host}/api/classes/${id}`, {
            method: 'DELETE'
        })
            .then(() => console.log(`deleted class ${id} successfully`))
            .then(() => this.load())
            .catch(err => console.error(err))
    };

    componentDidMount = () => this.load();

    render() {
        const rows = [];
        const cs = this.state.create;
        if (Object.entries(cs).length > 0) {
            rows.push(<SchoolClassItem key={-1} type="add" item={cs} onSave={x => {
                this.create(x);
            }} onCancel={() => {
                this.setState({create: {}});
            }} />)
        }
        this.state.data.forEach((item, i) => {
            rows.push(<SchoolClassItem key={i} type="read" item={item} onSave={x => {
                this.update(item._id, x);
            }} onDelete={() => {
                this.delete(item._id);
            }} />)
        });

        return (
            <div>
                <button type="button" className="btn btn-primary" onClick={() => {
                    this.setState({create: {
                            classId: "",
                            teacher: "",
                            loc: "",
                            locDist: 0,
                        }});
                }}>
                    Hinzufügen
                </button>

                <div className="container">
                    <div className="row">
                        <div className="col"/>
                        <div className="col-10">
                            <div className="row entries-header">
                                <div className="col-2">Klasse</div>
                                <div className="col-4">Lehrperson</div>
                                <div className="col-1">Pos.</div>
                                <div className="col-1">Enf.</div>
                                <div className="col-2"/>
                            </div>
                            {rows}
                        </div>
                        <div className="col"/>
                    </div>
                </div>
            </div>
        );
    }
}