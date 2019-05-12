import React, {Component} from "react"
import config from "../config";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './Block.css'
import $ from "jquery";
import BlockItem from "./BlockItem";

export default class Blocks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    load() {
        fetch(`http://${config.host}/api/blocks`, {method: 'GET'})
            .then(res => res.json())
            .then(data => this.setState({
                data: data
            }))
            .catch(err => console.error(err))
    };

    loadDNS(distance) {
        return fetch(`http://${config.host}/api/students?distance=${distance}&dns=1`, {method: 'GET'})
            .then(res => res.json())
        .then(data => this.setState({
            dns: data
        }))
        .catch(err => console.error(err))
    };

    createRunOder() {
        fetch(`http://${config.host}/api/runOrder`, {
            method: 'POST'
        })
            .then(() => console.log(`created run order successfully`))
            .then(() => this.load())
            .catch(err => console.error(err))
    };

    createBlock(block) {
        fetch(`http://${config.host}/api/blocks`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(block)
        })
            .then(() => console.log(`created block successfully`))
            .then(() => this.load())
            .catch(err => console.error(err))
    }

    updateBlock(id, block) {
        fetch(`http://${config.host}/api/blocks/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(block)
        })
            .then(() => console.log(`updated block ${id} successfully`))
            .then(() => this.load())
            .catch(err => console.error(err))
    }

    deleteBlock(id) {
        fetch(`http://${config.host}/api/blocks/${id}`, {
            method: 'DELETE'
        })
            .then(() => console.log(`deleted block ${id} successfully`))
            .then(() => this.load())
            .catch(err => console.error(err))
    }

    componentDidMount() {
        this.load();
        $("body").on("click", () => $("#context-dns").hide());
    }

    render() {
        const items = [];
        this.state.data.forEach(item => {
            items.push(
                <BlockItem key={item.blockId} edit={false} item={item}/>
            );
        });

        return <div>
            <button type="button" className="btn btn-primary" onClick={this.createRunOder}>Startgruppen automatisch
                erstellen
            </button>
            <button type="button" className="btn btn-primary" onClick={() => {
                $('#modal-create').modal()
            }}>
                Erstellen
            </button>
            <div className='container'>
                {items}
            </div>
        </div>;
    };
}