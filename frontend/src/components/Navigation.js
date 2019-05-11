import React, {Component} from "react"
import {Navbar, Nav} from "react-bootstrap";

export default class Navigation extends Component {
    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#home">DSWS</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="blocks">Blocks</Nav.Link>
                        <Nav.Link href="categories">Categories</Nav.Link>
                        <Nav.Link href="students">Students</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}