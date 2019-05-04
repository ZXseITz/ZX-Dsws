import React, {Component} from "react"
import {Table, Dropdown} from "react-bootstrap";
import DropdownMenu from "react-bootstrap/DropdownMenu";
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
        fetch(`http://${config.host}/api/athlete/ranked`, {
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
            items.push(<Dropdown.Item key={item.name} onClick={() => this.setState({idx: i})}>
                    {item.name}, {item.distance}m
                </Dropdown.Item>)
        });
        let title = '';
        const rows = [];
        const current = data[this.state.idx];
        if (current !== undefined) {
            title = `${current.name}, ${current.distance}m`;
                let pTime = data[0].time;
                let rank = 1;
                let aTime;
                current.athlete.forEach(item => {
                    switch (item.state) {
                        case 0:
                            aTime = item.time;
                            if (item.time > pTime) {
                                rank += 1;
                                pTime = item.time;
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
                        <td>{item.firstname}</td>
                        <td>{item.surname}</td>
                        <td>{item.year}</td>
                        <td>{item.schoolClass}</td>
                        <td>{aTime}</td>
                    </tr>);
                });
        }

        return (
            <div>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id='categories'>
                        {title}
                    </Dropdown.Toggle>
                    <DropdownMenu>
                        {items}
                    </DropdownMenu>
                </Dropdown>
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
            </div>
        );
    };
}