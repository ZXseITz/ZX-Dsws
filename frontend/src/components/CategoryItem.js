import React, {Component} from "react";

export default class CategoryItem extends Component {
    constructor(props) {
        super(props);
        this.onSave = props.onSave;
        this.onCancel = props.onCancel;
        this.onDelete = props.onDelete;
        this.state = {
            type: props.type,
            name: `${props.item.sex}${props.item.categoryAge}`,
            age: props.item.categoryAge,
            sex: props.item.sex,
            distance: props.item.distance,
        };

        this.createSaveButton.bind(this);
        this.createCancelButton.bind(this);
        this.createDeleteButton.bind(this);
    }

    render() {
        const type = this.state.type;
        const content = [];
        content.push(<h5 key={0} className="col-2">{this.state.name}</h5>);
        if (type === "read") {
            // read category
            content.push(<div key={1} className="col-3">{this.state.age}</div>);
            content.push(<div key={2} className="col-3">{this.state.sex}</div>);
            content.push(<div key={3} className="col-2">{this.state.distance}m</div>);
            content.push(<div key={4} className="col-2">
                <button type="button" className="btn btn-primary" onClick={() => {
                    this.setState({type: "mod"});
                }}>
                    Bearbeiten
                </button>
            </div>);
        } else {
            // write category
            content.push(<input key={1} className="col-3 form-control entry-value" type="text" onChange={e => {
                const age = parseInt(e.target.value);
                this.setState({
                    name: `${this.state.sex}${age}`,
                    age: age,
                });
            }} value={this.state.age}/>);
            content.push(<select key={2} className="col-3 form-control entry-value" onChange={e => {
                const sex = e.target.value;
                this.setState({
                    name: `${sex}${this.state.age}`,
                    sex: sex,
                });
            }} value={this.state.sex}>
                <option>m</option>
                <option>w</option>
            </select>);
            content.push(<input key={3} className="col-2 form-control entry-value" type="text" onChange={e => {
                this.setState({
                    distance: parseInt(e.target.value),
                });
            }} value={this.state.distance}/>);
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
                    categoryId: this.state.name,
                    categoryAge: this.state.age,
                    sex: this.state.sex,
                    distance: this.state.distance,
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