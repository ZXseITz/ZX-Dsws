import React, {Component} from "react"
import {Table} from "react-bootstrap";

export default class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        };
        this.load.bind(this);
    }

    load() {
        fetch('http://localhost:8001/api/athlete/grouped', {
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => this.setState({data: data}))
            .catch(err => console.error(err))
    }

    componentWillMount() {
        this.load();
    }

    render() {
        const categories = [];
        this.state.data.forEach(item => {
            const rows = [];
            let rank = 1;
            let athlete = item.athlete[0];
            let time = athlete.time;
                rows.push(<tr>
                <td>{rank}</td>
                <td>{athlete.firstname}</td>
                <td>{athlete.surname}</td>
                <td>{athlete.year}</td>
                <td>{athlete.schoolClass}</td>
                <td>{time > 0 ? time : 'n/a'}</td>
            </tr>);
            for (let i = 1; i < item.athlete.length; i++) {
                athlete = item.athlete[i];
                if (athlete.time > time) rank++;
                time = athlete.time;
                rows.push(<tr>
                    <td>{rank}</td>
                    <td>{athlete.firstname}</td>
                    <td>{athlete.surname}</td>
                    <td>{athlete.year}</td>
                    <td>{athlete.schoolClass}</td>
                    <td>{time > 0 ? time : 'n/a'}</td>
                </tr>);
            }

            categories.push(
                <div>
                    <h3>{item._id.category}, {item._id.distance}m</h3>
                    <Table>
                        <thead>
                        <tr>
                            <th>Rang</th>
                            <th>Vorname</th>
                            <th>Nachname</th>
                            <th>Jahrgang</th>
                            <th>Klasse</th>
                            <th>Zeit</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows}
                        </tbody>
                    </Table>
                    <br />
                </div>
            );
        });

        return (
            <div>
                {categories}
            </div>
        );
    };
}