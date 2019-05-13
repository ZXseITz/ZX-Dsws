import React, {Component} from "react";

export default class BlockTrack extends Component {
    constructor(props) {
        super(props);
        this.track = props.track;
        this.student = props.student;
    }

    render() {
        const track = this.track;
        const student = this.student;
        let t = "";
        if (student !== undefined) {
            switch (student.run.state) {
                case 0:
                    t = student.run.time;
                    break;
                case 1:
                    t = "R";
                    break;
                case 2:
                    t = "DNF";
                    break;
                case 3:
                    t = "DNS";
                    break;
            }
        }
        return <div className="row block-track">
            <div className="col-2">
                Bahn {track}
            </div>
            <div className="col-2">{student !== undefined ? student.firstname : ""}</div>
            <div className="col-2">{student !== undefined ? student.surname : ""}</div>
            <div className="col-1">{student !== undefined ? student.startNumber : ""}</div>
            <div className="col-1">{student !== undefined ? student.categoryId : ""}</div>
            <div className="col-1">{student !== undefined ? student.yearOfBirth : ""}</div>
            <div className="col-2">{student !== undefined ? student.classId : ""}</div>
            <div className="col-1">{t}</div>
        </div>
    }
}