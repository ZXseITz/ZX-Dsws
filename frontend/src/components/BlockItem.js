import React, {Component} from "react";
import BlockTrackEdit from "./BlockTrackEdit"
import BlockTrack from "./BlockTrack"
import config from "../config";

export default class BlockItem extends Component {
    constructor(props) {
        super(props);
        this.item = props.item;
        this.state = {
            edit: props.edit,
            dns: []
        };
        this.modify.bind(this);
        this.finalize.bind(this);
    }

    modify() {
        const distance = this.item.distance;
        fetch(`http://${config.host}/api/students/noBlock?distance=${distance}`, {method: 'GET'})
            .then(res => res.json())
            .then(data => this.setState({
                dns: data,
                edit: true
            }))
            .catch(err => console.error(err));
    }

    finalize() {
        this.setState({
            dns: [],
            edit: false
        });
    }

    remove(student) {
        const run = student.run;
        run.blockId = 0;
        run.track = 0;
        fetch(`http://${config.host}/api/students/${student._id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "run.blockId": run.blockId,
                "run.track": run.track,
            })
        })
            .then(() => console.log(`student ${student._id} removed`))
            .catch(err => console.error(err));
    }

    add(student, track) {
        const run = student.run;
        run.blockId = this.item.blockId;
        run.track = track;
        fetch(`http://${config.host}/api/students/${student._id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "run.blockId": run.blockId,
                "run.track": run.track,
            })
        })
            .then(() => console.log(`student ${student._id} added`))
            .catch(err => console.error(err));
    }

    updateTime(student, time) {
        const run = student.run;
        if (time === "DNS") {
            run.state = 3;
            run.time = 0;
        } else if (time === "DNF") {
            run.state = 2;
            run.time = 0;
        }  else if (time === "R") {
            run.state = 1;
            run.time = 0;
        } else {
            const t = parseFloat(time);
            if (!isNaN(t)) {
                run.state = 0;
                run.time = t;
            }
        }
        fetch(`http://${config.host}/api/students/${student._id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "run.state": run.state,
                "run.time": run.time,
            })
        })
            .then(() => console.log(`student ${student._id} dns`))
            .catch(err => console.error(err));
    }

    render() {
        const item = this.item;
        const edit = this.state.edit;
        const dns = this.state.dns;
        const date = new Date(item.startTime);
        const tracks = [];
        for (let i = 1; i <= 4; i++) {
            const student = item.students.find(x => x.run.track === i);
            if (edit) {
                tracks.push(<BlockTrackEdit key={i} items={dns} track={i} onChange={(prev, current) => {
                    const students = item.students;
                    if (prev !== undefined) {
                        this.remove(prev);
                        const index = students.indexOf(prev);
                        if (index > -1) {
                            students.splice(index, 1);
                        }
                    }
                    if (current !== undefined) {
                        this.add(current, i);
                        students.push(current);
                    }
                }} onTimeChange={(current, time) => {
                    this.updateTime(current, time)
                }} student={student}/>)
            } else {
                tracks.push(<BlockTrack key={i} track={i} student={student}/>)
            }
        }

        return <div className='row block'>
            <div className='col-3 block-header'>
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