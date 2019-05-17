import React, {Component} from "react"

export default class SchoolClassItem extends Component {
    constructor(props) {
        super(props);
        this.onSave = props.onSave;
        this.onCancel = props.onCancel;
        this.onDelete = props.onDelete;
        this.state = {
            type: props.type,
            classId: props.item.classId,
            teacher: props.item.teacher,
            loc: props.item.loc,
            locDist: props.item.locDist,
        };

        this.createSaveButton.bind(this);
        this.createCancelButton.bind(this);
        this.createDeleteButton.bind(this);
    }

    render() {
        const type = this.state.type;
        const content = [];

        if (this.state.type === "read") {
            // read category
            content.push(<div key={0} className="col-2">{this.state.classId}</div>);
            content.push(<div key={1} className="col-4">{this.state.teacher}</div>);
            content.push(<div key={2} className="col-1">{this.state.loc}</div>);
            content.push(<div key={3} className="col-1">{this.state.locDist}</div>);
            content.push(<div key={4} className="col-2">
                <button type="button" className="btn btn-primary" onClick={() => {
                    this.setState({type: "mod"});
                }}>
                    Bearbeiten
                </button>
            </div>);
        } else {
            content.push(<input key={0} className="col-2 form-control entry-value" type="text" onChange={e => {
                this.setState({
                    classId: e.target.value,
                });
            }} value={this.state.classId}/>);
            content.push(<input key={1} className="col-4 form-control entry-value" type="text" onChange={e => {
                this.setState({
                    teacher: e.target.value,
                });
            }} value={this.state.teacher}/>);
            content.push(<input key={2} className="col-1 form-control entry-value" type="text" onChange={e => {
                this.setState({
                    loc: e.target.value,
                });
            }} value={this.state.loc}/>);
            content.push(<input key={3} className="col-1 form-control entry-value" type="text" onChange={e => {
                this.setState({
                    locDist: parseInt(e.target.value),
                });
            }} value={this.state.locDist}/>);
            if (type === "add") {
                // add new category
                content.push(<div key={4} className="col-2">
                    {this.createSaveButton("Hinzufügen")}
                    {this.createCancelButton("Abbrechen")}
                </div>);
            } else {
                // modify category
                content.push(<div key={4} className="col-2">
                    {this.createSaveButton("Speichern")}
                    {this.createDeleteButton("Löschen")}
                    {this.createCancelButton("Abbrechen")}
                </div>);
            }
        }

        return <div className="row entry">
            {content}
        </div>
    }

    createSaveButton(title) {
        return <button type="button" className="btn btn-primary" onClick={() => {
            this.setState({type: "read"});
            if (typeof this.onSave === "function") {
                this.onSave({
                    classId: this.state.classId,
                    teacher: this.state.teacher,
                    loc: this.state.loc,
                    locDist: this.state.locDist,
                });
            }
        }}>
            {title}
        </button>
    }

    createCancelButton(title) {
        return <button type="button" className="btn btn-secondary" onClick={() => {
            this.setState({type: "read"});
            if (typeof this.onCancel === "function") {
                this.onCancel();
            }
        }}>
            {title}
        </button>
    }

    createDeleteButton(title) {
        return <button type="button" className="btn btn-danger" onClick={() => {
            this.setState({type: "read"});
            if (typeof this.onDelete === "function") {
                this.onDelete();
            }
        }}>
            {title}
        </button>
    }
}