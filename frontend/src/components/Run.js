import React, {Component} from "react"
import {Button, Table} from "react-bootstrap";
import config from "../config";

export default class Run extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    load = () => {
        fetch(`http://${config.host}/api/athlete/run`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => this.setState({data: data}))
            .catch(err => console.error(err))
    };

    createRunOder = () => {
        fetch(`http://${config.host}/api/runOrder`, {
            method: 'POST'
        })
            .then(() => console.log(`created run order successfully`))
            .catch(err => console.error(err))
    };

    componentDidMount() {
        this.load();
    }

    render() {
        const items = [];
        this.state.data.forEach(item => {
            const rows = [];
            item.athlete.forEach(a => {
                rows.push(<tr key={a.number}>
                    <td>{a.number}</td>
                    <td>{a.firstname}</td>
                    <td>{a.surname}</td>
                    <td>{a.year}</td>
                    <td>{a.schoolClass}</td>
                    <td>{a.category}</td>
                </tr>)
            });
            items.push(<div>
                <h3>Block: {item._id.block}</h3>
                <h4>Distanz: {item._id.distance}</h4>
                <h4>Startzeit: {item._id.startTime}</h4>
                <br/>
                <Table bordered hover>
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
                </Table>
            </div>)
        });

        return <div>
            <Button variant="outline-primary" onClick={this.createRunOder}>Create Run Order</Button>
            {items}
        </div>;
    };
}