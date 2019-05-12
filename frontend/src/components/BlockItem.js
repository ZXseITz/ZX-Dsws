import React, {Component} from "react";
import BlockTrackEdit from "./BlockTrackEdit"
import BlockTrack from "./BlockTrack"
import config from "../config";

export default class BlockItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: props.edit,
            item: props.item
        }
    }

    modify() {
        console.log("modify");
        this.setState({
            edit: true
        });
    }

    save() {
        console.log("save");
        this.setState({
            edit: false
        });
    }

    saveTime(id, time) {
        let payload;
        if (time === "DNF") {
            payload = {
                "run.state": 2,
                "run.time": 0,
            }
        } else if (time === "P") {
            payload = {
                "run.state": 1,
                "run.time": 0,
            }
        } else {
            const t = parseFloat(time);
            if (isNaN(t)) {
                console.error(`time ${t} is not a number`);
            }
            payload = {
                "run.state": 0,
                "run.time": t,
            }
        }

        fetch(`http://${config.host}/api/students/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        })
            .then(() => console.log(`updated time of student ${id} successfully`))
            .then(() => this.load())
            .catch(err => console.error(err))
    }

    render() {
        const edit = this.state.edit;
        const item = this.state.item;
        const date = new Date(item.startTime);
        const tracks =[];
        for (let i = 1; i <= 4; i++) {
            const student = item.students.find(s => s.run.track === i);
            if (edit) {
                tracks.push(<BlockTrackEdit key={i} items={[]} track={i} student={student} />)
            } else {
                tracks.push(<BlockTrack key={i} track={i} student={student} />)
            }
        }

        return <div className='row block'>
            <div className='col-3 block-title'>
                <h4>Block: {item.blockId}</h4>
                <p>Startzeit: {date.toLocaleTimeString()}</p>
                <p>Distanz: {item.distance}m</p>
                <button type="button" className="btn btn-primary" onClick={() => {
                    if (edit) {
                        this.save()
                    } else {
                        this.modify()
                    }
                }}>{edit ? "Speichern" : "Bearbeiten"}</button>
            </div>
            <div className='col'>
                <div className="container">
                    {tracks}
                </div>
            </div>
        </div>
    }
}