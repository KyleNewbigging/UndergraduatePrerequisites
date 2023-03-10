import React, { Component } from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Home from './Home';
import UniSearch from './UniSearch';
import GraphSearch from './GraphSearch'

export default class NavbarComp extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Navbar id="navbar" bg="dark" variant={"dark"} expand="lg">
                        <Navbar.Brand>CIS 3760 Team 3</Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                            <Nav
                                className="mr-auto my-2 my-lg-1"
                                style={{
                                    maxHeight: '100px'
                                }}
                                navbarScroll
                            >
                                <Nav.Link as={Link} to="/Home">Home</Nav.Link>
                                <Nav.Link as={Link} to="/UniSearch">Course Search</Nav.Link>
                                <Nav.Link as={Link} to="/GraphSearch">Graph Search</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
                <div>
                    <Routes>
                        <Route exact path="/Home" element={<Home/>}/>
                        <Route exact path="/UniSearch" element={<UniSearch/>}/>
                        <Route exact path="/GraphSearch" element={<GraphSearch/>}/>
                    </Routes>
                </div>
            </Router>
        )
    }
}
