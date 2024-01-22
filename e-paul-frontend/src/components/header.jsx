import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import './header.css'
import { Routes } from 'react-router-dom';

class Header extends Component {
    state = {  } 
    render() { 
        return (
            <nav className="navbar" style={{backgroundColor: '#00BFFF'}}>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src="assets/img/clearLogo.png" alt="Logo" width="30" height="30" className="d-inline-block align-text-top"/>
                    <span className="me-2"> E-Paul 7EVZL7</span>
                    
                </Link>
                <Routes>
                    <Route path="/about" element={<p>Test</p>}></Route>
                </Routes>
                <form className="ms-auto" style={{color: '#00BFFF'}}>
                    <button className="btn btn-outline-success me-2 btn-sign-up" type="button" >Sign up</button>
                    <button className="btn btn-outline-success me-2 btn-login" type="button">Login</button>
                </form>
            </div>
            </nav>    
  );
};
}
 
export default Header;
