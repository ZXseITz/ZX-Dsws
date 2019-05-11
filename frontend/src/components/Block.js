import React, {Component} from "react"
import config from "../config";
import 'bootstrap/dist/css/bootstrap.css';
import './Block.css'

export default class Block extends Component {
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
            items.push(<div className='row block'>
                <div className='col-4 block-title'>
                    <h4>Block: {item._id.block}</h4>
                    <p>Distanz: {item._id.distance}m</p>
                    <p>Startzeit: {(new Date(item._id.startTime)).toLocaleTimeString()}</p>
                </div>
                <div className='col-8'>
                    <table className="table table-bordered">
                        {/*<thead>*/}
                        {/*<tr>*/}
                        {/*    <th>Startnummer</th>*/}
                        {/*    <th>Vorname</th>*/}
                        {/*    <th>Nachname</th>*/}
                        {/*    <th>Jahrgang</th>*/}
                        {/*    <th>Klasse</th>*/}
                        {/*    <th>Kategorie</th>*/}
                        {/*</tr>*/}
                        {/*</thead>*/}
                        <tbody>
                        {rows}
                        </tbody>
                    </table>
                </div>
            </div>)
        });

        return <div>
            <button type="button" className="btn btn-primary" onClick={this.createRunOder}>Create Run Order</button>
            <div className='container'>
                {items}
            </div>
        </div>;
    };
}