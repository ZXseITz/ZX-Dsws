import React, {Component} from "react";

export default class BlockTrackEdit extends Component {
    constructor(props) {
        super(props);
        this.items = props.items;
        this.track = props.track;
        this.onChange = props.onChange;
        this.onTimeChange = props.onTimeChange;
        this.state = {
            student: props.student,
            x: this.getTime(props.student)
        }
    }

    getTime(student) {
        if (student === undefined) {
            return ""
        }
        switch (student.run.state) {
            case 0:
                return student.run.time;
            case 1:
                return "R";
            case 2:
                return "DNF";
            case 3:
                return "DNS";
        }
    }

    render() {
        const track = this.track;
        const student = this.state.student;
        const items = [];
        items.push(<div key={0} className="change-item dropdown-item" onClick={() => {
            this.onChange(this.state.student, undefined);
            this.setState({
                student: undefined,
                x: ""
            })
        }}>
            Leer
        </div>);
        this.items.forEach(item => {
            items.push(<div key={item._id} className="change-item dropdown-item" onClick={() => {
                this.onChange(this.state.student, item);
                this.setState({
                    student: item,
                    x: this.getTime(item)
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
            <div className="col-2">{student !== undefined ? student.firstname : ""}</div>
            <div className="col-2">{student !== undefined ? student.surname : ""}</div>
            <div className="col-1">{student !== undefined ? student.startNumber : ""}</div>
            <div className="col-1">{student !== undefined ? student.categoryId : ""}</div>
            <div className="col-1">{student !== undefined ? student.yearOfBirth : ""}</div>
            <div className="col-2">{student !== undefined ? student.classId : ""}</div>
            <input readOnly={student === undefined} type="text" className="col-1 form-control"
                   value={this.state.x} onChange={e => this.setState({x: e.target.value})} onKeyDown={e => {
                       if (e.keyCode === 13) {
                           this.onTimeChange(student, this.state.x)
                       }
            }}/>
        </div>
    }
}