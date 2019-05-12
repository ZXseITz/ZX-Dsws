import React, {Component} from "react";

export default class BlockTrackEdit extends Component {
    constructor(props) {
        super(props);
        this.items = props.items;
        this.track = props.track;
        this.onChange = props.onChange;
        this.state = {
            student: props.student
        }
    }

    changeTime(run, time) {
        if (time === "DNF") {
            run.state = 2;
            run.time = 0;
        } else if (time === "R") {
            run.state = 1;
            run.time = 0;
        } else {
            const t = parseFloat(time);
            if (!isNaN(t)) {
                run.state = 0;
                run.time = t;
            }
        }
    }

    render() {
        const track = this.track;
        const student = this.state.student;
        let t = "DNS";
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
            }
        }
        const items = [];
        items.push(<div key={0} className="change-item dropdown-item" onClick={() => {
            this.onChange(this.state.student, undefined);
            this.setState({
                student: undefined
            })
        }}>
            Leer
        </div>);
        this.items.forEach(item => {
            items.push(<div key={item._id} className="change-item dropdown-item" onClick={() => {
                this.onChange(this.state.student, item);
                this.setState({
                    student: item
                })
            }}>
                {item.startNumber} {item.firstname} {item.surname}
            </div>)
        });
        return <div className="row block-track">
            <div className="col-2 dropdown">
                <button className="btn btn-primary dropdown-toggle" id="dropdownMenuButton" type="button" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                    Bahn {track}
                </button>
                <div className="dropdown-menu">
                    {items}
                </div>
            </div>
            <div className="col">{student !== undefined ? student.firstname : ""}</div>
            <div className="col">{student !== undefined ? student.surname : ""}</div>
            <div className="col">{student !== undefined ? student.startNumber : ""}</div>
            <div className="col">{student !== undefined ? student.categoryId : ""}</div>
            <div className="col">{student !== undefined ? student.yearOfBirth : ""}</div>
            <div className="col">{student !== undefined ? student.classId : ""}</div>
            <input readOnly={student === undefined} type="text" className="col form-control"
                   defaultValue={t} onChange={e => {
                       this.changeTime(student.run, e.target.value)
            }}/>
        </div>
    }
}