import React, {Component} from "react"
import config from "../config";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './Main.css'
import $ from "jquery";
import BlockItem from "./BlockItem";

export default class Blocks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idx: 0,
            data: [],
        };
        this.load.bind(this);
        this.initBlocks.bind(this);
        this.createBlock.bind(this);
        this.updateBlock.bind(this);
        this.deleteBlock.bind(this);
    }

    load() {
        fetch(`http://${config.host}/api/blocks`, {method: 'GET'})
            .then(res => res.json())
            .then(data => this.setState({
                data: data
            }))
            .catch(err => console.error(err))
    };

    initBlocks() {
        fetch(`http://${config.host}/api/initBlocks`, {
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
        const data = this.state.data;
        let title = "";
        const teachers = [];
        const items = [];
        data.forEach((item, i) => {
            const teacher = item._id.teacher;
            teachers.push(<a key={i} className="dropdown-item" onClick={() => this.setState({idx: i})}>
                {teacher}
            </a>);
        });
        const current = data[this.state.idx];
        if (current !== undefined) {
            title = current._id.teacher;

            current.blocks.forEach(block => {
                items.push(
                    <BlockItem key={block.blockId} edit={false} item={block}/>
                );
            })
        }

        return <div>
            <button type="button" className="btn btn-primary" onClick={() => this.initBlocks()}>Startgruppen automatisch
                erstellen
            </button>
            <button type="button" className="btn btn-primary" onClick={() => {
                $('#modal-create').modal()
            }}>
                Erstellen
            </button>
            <div className="teacher">
                <div className="dropdown">
                    <button className="btn btn-primary dropdown-toggle" id="dropdownMenuButton" type="button" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">
                        {title}
                    </button>
                    <div className="dropdown-menu">
                        {teachers}
                    </div>
                </div>

                <div className='container'>
                    {items}
                </div>
            </div>
        </div>;
    };
}