import React, {Component} from "react";
import BlockTrackEdit from "./BlockTrackEdit"
import BlockTrack from "./BlockTrack"
import config from "../config";

export default class BlockItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            edit: props.edit,
            dns: []
        };
        this.modify.bind(this);
        this.finalize.bind(this);
    }

    modify() {
        const distance = this.state.item.distance;
        fetch(`http://${config.host}/api/students?distance=${distance}&dns=1`, {method: 'GET'})
            .then(res => res.json())
            .then(data => this.setState({
                dns: data,
                edit: true
            }))
            .catch(err => console.error(err));
    }

    finalize() {
        //todo save
        this.setState({
            dns: [],
            edit: false
        });
    }

    render() {
        const edit = this.state.edit;
        const item = this.state.item;
        const dns = this.state.dns;
        const date = new Date(item.startTime);
        const tracks = [];
        for (let i = 1; i <= 4; i++) {
            const student = item.students.find(x => x.run.track === i);
            if (edit) {
                tracks.push(<BlockTrackEdit key={i} items={dns} track={i} onChange={(prev, current) => {
                    const students = item.students;
                    if (prev !== undefined) {
                        prev.run.blockId = 0;
                        prev.run.track = 0;
                        const index = students.indexOf(prev);
                        if (index > -1) {
                            students.splice(index, 1);
                        }
                    }
                    if (current !== undefined) {
                        current.run.blockId = item.blockId;
                        current.run.track = i;
                        students.push(current);
                    }
                }} student={student}/>)
            } else {
                tracks.push(<BlockTrack key={i} track={i} student={student}/>)
            }
        }

        return <div className='row block'>
            <div className='col-3 block-title'>
                <h4>Block: {item.blockId}</h4>
                <p>Startzeit: {date.toLocaleTimeString()}</p>
                <p>Distanz: {item.distance}m</p>
                <button type="button" className="btn btn-primary" onClick={() => {
                    if (edit) {
                        this.finalize()
                    } else {
                        this.modify()
                    }
                }}>{edit ? "Fertigstellen" : "Bearbeiten"}</button>
            </div>
            <div className='col'>
                <div className="container">
                    {tracks}
                </div>
            </div>
        </div>
    }
}