import React, {Component} from "react"
import {Table} from "react-bootstrap";

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
        this.load.bind(this);
    }

    load = () => {
        fetch('http://localhost:8001/api/athlete/ranked', {
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => this.setState({data: data}))
            .catch(err => console.error(err))
    };

    componentWillMount() {
        this.load();
    }

    render() {
        const categories = [];
        this.state.data.forEach(item => {
            const rows = [];
            let pTime = item.athlete[0].time;
            let rank = 1;
            let aTime;
            for (let i = 0; i < item.athlete.length; i++) {
                const athlete = item.athlete[i];
                switch (athlete.state) {
                    case 0:
                        aTime = athlete.time;
                        if (athlete.time > pTime) {
                            rank += 1;
                            pTime = athlete.time;
                        }
                        break;
                    case 1:
                        rank = '-';
                        aTime = '-';
                        break;
                    case 2:
                        rank = '-';
                        aTime = 'DNS';
                        break;
                    case 3:
                        rank = '-';
                        aTime = 'DNF';
                        break;
                }
                rows.push(<tr>
                    <td>{rank}</td>
                    <td>{athlete.firstname}</td>
                    <td>{athlete.surname}</td>
                    <td>{athlete.year}</td>
                    <td>{athlete.schoolClass}</td>
                    <td>{aTime}</td>
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