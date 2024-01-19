import React, { Component } from 'react';

class Header extends Component {
    state = {  } 
    render() { 
        return (
            <nav className="navbar" style={{backgroundColor: '#00BFFF'}}>
            <div className="container-fluid">
                <a className="navbar-brand" href="www.google.com">
                    <img src="assets/img/logo.png" alt="Logo" width="30" height="30" className="d-inline-block align-text-top"/>
                    E-Paul 7EVZL7
                </a>
                <a className="nav-link active ms-auto" aria-current="page" href="www.google.com">About us</a>
                <form className="ms-auto" style={{color: '#00BFFF'}}>
                    <button className="btn btn-outline-success me-2" type="button">Sign in</button>
                    <button className="btn btn-outline-success me-2" type="button">Login</button>
                </form>
            </div>
            </nav>    
  );
};
}
 
export default Header;
