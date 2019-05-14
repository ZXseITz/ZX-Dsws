import React, {Component} from "react";

export default class StudentItem extends Component {
    constructor(props) {
        super(props);
        this.onSave = props.onSave;
        this.onCancel = props.onCancel;
        this.onDelete = props.onDelete;
        this.state = {
            type: props.type,
            startNumber: props.item.startNumber,
            firstname: props.item.firstname,
            surname: props.item.surname,
            yearOfBirth: props.item.yearOfBirth,
            classId: props.item.classId,
            categoryId: props.item.categoryId,
        };

        this.createSaveButton.bind(this);
        this.createCancelButton.bind(this);
        this.createDeleteButton.bind(this);
    }

    render() {
        const type = this.state.type;
        const content = [];
        if (type === "read") {
            // read category
            content.push(<div key={0} className="col-1">{this.state.startNumber}</div>);
            content.push(<div key={1} className="col-2">{this.state.firstname}</div>);
            content.push(<div key={2} className="col-3">{this.state.surname}</div>);
            content.push(<div key={3} className="col-1">{this.state.yearOfBirth}</div>);
            content.push(<div key={4} className="col-2">{this.state.classId}</div>);
            content.push(<div key={5} className="col-1">{this.state.categoryId}</div>);
            content.push(<div key={6} className="col-2">
                <button type="button" className="btn btn-primary" onClick={() => {
                    this.setState({type: "mod"});
                }}>
                    Bearbeiten
                </button>
            </div>);
        } else {
            // write category
            content.push(<input key={0} className="col-1 form-control entry-value" type="text" onChange={e => {
                this.setState({
                    startNumber: parseInt(e.target.value),
                });
            }} value={this.state.startNumber}/>);
            content.push(<input key={1} className="col-2 form-control entry-value" type="text" onChange={e => {
                this.setState({
                    firstname: e.target.value,
                });
            }} value={this.state.firstname}/>);
            content.push(<input key={2} className="col-3 form-control entry-value" type="text" onChange={e => {
                this.setState({
                    surname: e.target.value,
                });
            }} value={this.state.surname}/>);
            content.push(<input key={3} className="col-1 form-control entry-value" type="text" onChange={e => {
                this.setState({
                    yearOfBirth: parseInt(e.target.value),
                });
            }} value={this.state.yearOfBirth}/>);
            content.push(<input key={4} className="col-2 form-control entry-value" type="text" onChange={e => {
                this.setState({
                    classId: e.target.value,
                });
            }} value={this.state.classId}/>);
            content.push(<input key={5} className="col-1 form-control entry-value" type="text" onChange={e => {
                this.setState({
                    categoryId: e.target.value,
                });
            }} value={this.state.categoryId}/>);
            if (type === "add") {
                // add new category
                content.push(<div key={6} className="col-2">
                    {this.createSaveButton("Hinzufügen")}
                    {this.createCancelButton("Abbrechen")}
                </div>);
            } else {
                // modify category
                content.push(<div key={6} className="col-2">
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
                    startNumber: this.state.startNumber,
                    firstname: this.state.firstname,
                    surname: this.state.surname,
                    yearOfBirth: this.state.yearOfBirth,
                    classId: this.state.classId,
                    categoryId: this.state.categoryId,
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