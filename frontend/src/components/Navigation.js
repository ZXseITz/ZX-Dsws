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
                        <Nav.Link href="run">Run</Nav.Link>
                        <Nav.Link href="category">Category</Nav.Link>
                        <Nav.Link href="athlete">Athlete</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}