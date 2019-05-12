import React, {Component} from "react";

export default class BlockTrackEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: props.items,
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
            <div className="col-2 dropdown">
                <button className="btn btn-primary dropdown-toggle" id="dropdownMenuButton" type="button" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false" onClick={() => {

                }}>
                    Bahn {track}
                </button>
                <div className="dropdown-menu">
                    {this.state.items}
                </div>
            </div>
            <div className="col">{student !== undefined ? student.firstname : ""}</div>
            <div className="col">{student !== undefined ? student.surname : ""}</div>
            <div className="col">{student !== undefined ? student.startNumber : ""}</div>
            <div className="col">{student !== undefined ? student.categoryId : ""}</div>
            <div className="col">{student !== undefined ? student.yearOfBirth : ""}</div>
            <div className="col">{student !== undefined ? student.classId : ""}</div>
            <input readOnly={student === undefined} type="text" className="col form-control"
                   defaultValue={t} onKeyDown={e => {
                if (e.keyCode === 13) {
                    this.saveTime(student._id, e.target.value)
                }
            }}/>
        </div>
    }
}