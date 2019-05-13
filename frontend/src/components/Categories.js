import React, {Component} from "react"
import 'bootstrap/dist/css/bootstrap.css';
import './Category.css';
import 'bootstrap/dist/js/bootstrap.js';
import config from "../config.json"
import CategoryItem from "./CategoryItem";

export default class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            newCat: {}
        };

        this.loadCategories.bind(this);
        this.createCategory.bind(this);
        this.updateCategory.bind(this);
        this.deleteCategory.bind(this);
    };

    loadCategories = () => {
        fetch(`http://${config.host}/api/categories`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => this.setState({
                categories: data,
                newCat: {},
            }))
            .catch(err => console.error(err))
    };

    stringifyCategory = model => {
        // exclude _id
        return JSON.stringify({
            categoryId: `${model.sex}${model.categoryAge}`,
            categoryAge: model.categoryAge,
            sex: model.sex,
            distance: model.distance,
        });
    };

    createCategory = (category) => {
        fetch(`http://${config.host}/api/categories`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: this.stringifyCategory(category)
        })
            .then(() => console.log(`created category successfully`))
            .then(() => this.loadCategories())
            .catch(err => console.error(err))
    };

    updateCategory = (id, category) => {
        fetch(`http://${config.host}/api/categories/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: this.stringifyCategory(category)
        })
            .then(() => console.log(`updated category ${id} successfully`))
            .then(() => this.loadCategories())
            .catch(err => console.error(err))
    };

    deleteCategory = (id) => {
        fetch(`http://${config.host}/api/categories/${id}`, {
            method: 'DELETE'
        })
            .then(() => console.log(`deleted category ${id} successfully`))
            .then(() => this.loadCategories())
            .catch(err => console.error(err))
    };

    componentDidMount = () => this.loadCategories();

    render() {
        const rows = [];
        if (Object.entries(this.state.newCat).length > 0) {
            rows.push(<CategoryItem key={-1} item={this.state.newCat} type="add" onSave={x => {
                this.createCategory(x);
            }} onCancel={() => {
                this.setState({newCat: {}})
            }}/>);
            console.log(this.state.newCat);
        }
        this.state.categories.forEach((item, i) => {
            rows.push(<CategoryItem key={i} item={item} type="read" onSave={x => {
                this.updateCategory(item._id, x);
            }} onDelete={() => {
                this.deleteCategory(item._id);
            }}/>);
        });

        return (
            <div>
                <button type="button" className="btn btn-secondary" onClick={() => {
                    this.setState({
                        newCat: {
                            categoryAge: 0,
                            sex: "m",
                            distance: 50,
                        }
                    })
                }}>
                    Hinzufügen
                </button>

                <div className="container">
                    <div className="row">
                        <div className="col"/>
                        <div className="col-10">
                            <div className="row category-header">
                                <div className="col-2">Name</div>
                                <div className="col-3">Altersklasse</div>
                                <div className="col-3">Geschlecht</div>
                                <div className="col-2">Distanz</div>
                                <div className="col-2"/>
                            </div>
                            {rows}
                        </div>
                        <div className="col"/>
                    </div>
                </div>
            </div>
        );
    }
    ;
}