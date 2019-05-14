import React, {Component} from "react"
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import config from "../config.json"


export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idx: 0,
            data: [],
        };
    }

    componentDidMount() {
        fetch(`http://${config.host}/api/students/ranked`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => this.setState({
                data: data
            }))
            .catch(err => console.error(err))
    }

    render() {
        const data = this.state.data;
        const items = [];
        data.forEach((item, i) => {
            items.push(<a key={item.name} className="dropdown-item" onClick={() => this.setState({idx: i})}>
                    {item.categoryId}, {item.distance}m
                </a>)
        });
        let title = '';
        const rows = [];
        const current = data[this.state.idx];
        if (current !== undefined) {
            title = `${current.categoryId}, ${current.distance}m`;
                let pTime = data[0].time;
                let rank = 1;
                let aTime;
                current.students.forEach(item => {
                    switch (item.run.state) {
                        case 0:
                            aTime = item.run.time;
                            if (item.run.time > pTime) {
                                rank += 1;
                                pTime = item.run.time;
                            }
                            break;
                        case 1:
                            rank = '-';
                            aTime = '-';
                            break;
                        case 2:
                            rank = '-';
                            aTime = 'DNF';
                            break;
                        case 3:
                            rank = '-';
                            aTime = 'DNS';
                            break;
                    }
                    rows.push(<tr key={item.number}>
                        <td>{rank}</td>
                        <td>{item.firstname}</td>
                        <td>{item.surname}</td>
                        <td>{item.yearOfBirth}</td>
                        <td>{item.classId}</td>
                        <td>{aTime}</td>
                    </tr>);
                });
        }

        return (
            <div>
                <div className="dropdown">
                    <button className="btn btn-primary dropdown-toggle" id="dropdownMenuButton" type="button" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">
                        {title}
                    </button>
                    <div className="dropdown-menu">
                        {items}
                    </div>
                </div>
                <table className="table">
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
                </table>
            </div>
        );
    };
}