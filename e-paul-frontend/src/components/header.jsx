import React, { Component } from 'react';
import './header.css'

class Header extends Component {
    state = {  } 
    render() { 
        return (
            <nav className="navbar" style={{backgroundColor: '#00BFFF'}}>
            <div className="container-fluid">
                <a className="navbar-brand" href="www.google.com">
                    <img src="assets/img/clearLogo.png" alt="Logo" width="30" height="30" className="d-inline-block align-text-top"/>
                    <span className="me-2"> E-Paul 7EVZL7</span>
                </a>
                <form className="ms-auto" style={{color: '#00BFFF'}}>
                    <button className="btn btn-outline-success me-2 btn-sign-in" type="button">Sign in</button>
                    <button className="btn btn-outline-success me-2 btn-login" type="button">Login</button>
                </form>
            </div>
            </nav>    
  );
};
}
 
export default Header;
