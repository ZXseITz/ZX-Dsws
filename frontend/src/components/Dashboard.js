import React, {Component} from "react"

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            athlete: []
        }
    };

    componentWillMount() {
        fetch('http://localhost:8001/api/athlete', {
            method: 'GET'
        })
            .catch(err => console.error(err))
            .then(res => res.json())
            .then(data => this.setState({athlete: data}))
    }

    render() {
        console.log(this.state.athlete);
        const rows = [];
        this.state.athlete.forEach(item => {
            rows.push(<tr>
                <td>{item.firstname}</td>
                <td>{item.surname}</td>
                <td>{item.sex}</td>
                <td>{item.schoolClass}</td>
                <td>{item.category}</td>
                <td>{item.distance}</td>
                <td>0</td>
            </tr>)
        });
        return (
            <div>
                <table>
                    <tr>
                        <th>Vorname</th>
                        <th>Nachname</th>
                        <th>Geschlecht</th>
                        <th>Klasse</th>
                        <th>Kategorie</th>
                        <th>Distanz</th>
                        <th>Zeit</th>
                    </tr>
                    {rows}
                </table>
            </div>
        );
    };
}