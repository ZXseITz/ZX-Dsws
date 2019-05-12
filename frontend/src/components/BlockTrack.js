import React, {Component} from "react";

export default class BlockTrack extends Component {
    constructor(props) {
        super(props);
        this.state = {
            track: props.track,
            student: props.student,
        }
    }

    render() {
        const track = this.state.track;
        const student = this.state.student;
        let t = "DNS";
        if (student !== undefined) {
            switch (student.run.state) {
                case 0:
                    t = student.run.time;
                    break;
                case 1:
                    t = "P";
                    break;
                case 2:
                    t = "DNF";
                    break;
            }
        }
        return <div className="row block-track">
            <div className="col-2">
                Bahn {track}
            </div>
            <div className="col">{student !== undefined ? student.firstname : ""}</div>
            <div className="col">{student !== undefined ? student.surname : ""}</div>
            <div className="col">{student !== undefined ? student.startNumber : ""}</div>
            <div className="col">{student !== undefined ? student.categoryId : ""}</div>
            <div className="col">{student !== undefined ? student.yearOfBirth : ""}</div>
            <div className="col">{student !== undefined ? student.classId : ""}</div>
            <div className="col">{t}</div>
        </div>
    }
}