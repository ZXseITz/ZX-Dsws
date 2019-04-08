import React, {Component} from "react"
import {Table, Container, Row, Col, Dropdown} from "react-bootstrap";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import config from "../config.json"

const categories = [
    {
        name: "W7",
        distance: 50
    },
    {
        name: "M7",
        distance: 50
    },
    {
        name: "W8",
        distance: 50
    },
    {
        name: "M8",
        distance: 50
    },
    {
        name: "W9",
        distance: 50
    },
    {
        name: "M9",
        distance: 50
    },
    {
        name: "W10",
        distance: 60
    },
    {
        name: "M10",
        distance: 60
    },
    {
        name: "W11",
        distance: 60
    },
    {
        name: "M11",
        distance: 60
    },
    {
        name: "W12",
        distance: 60
    },
    {
        name: "M12",
        distance: 60
    },
    {
        name: "W13",
        distance: 60
    },
    {
        name: "M13",
        distance: 60
    },
    {
        name: "W14",
        distance: 80
    },
    {
        name: "M14",
        distance: 80
    },
    {
        name: "W15",
        distance: 80
    },
    {
        name: "M15",
        distance: 80
    },
    {
        name: "W16",
        distance: 80
    },
    {
        name: "M16",
        distance: 80
    },
];

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: {},
            data: [],
        };
        this.load.bind(this);
    }

    componentWillMount() {
        this.load(categories[0]);
    }

    load = (category) => {
        console.log('loading data');
        fetch(`http://${config.host}/api/athlete/ranked/${category.name}`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => this.setState({
                category: category,
                data: data
            }))
            .catch(err => console.error(err))
    };

    render() {
        const cats = [];
        categories.forEach(item => {
            cats.push(
                <Dropdown.Item onClick={() => {
                    this.load(item);
                }} action>{item.name}</Dropdown.Item>
            )
        });

        const data = this.state.data;
        const category = this.state.category;
        const rows = [];
        if (data.length > 0) {
            let pTime = data[0].time;
            let rank = 1;
            let aTime;
            data.forEach(item => {
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
                    <Dropdown.Toggle variant="success">
                        {category.name}, {category.distance}m
                    </Dropdown.Toggle>
                    <DropdownMenu>
                        {cats}
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