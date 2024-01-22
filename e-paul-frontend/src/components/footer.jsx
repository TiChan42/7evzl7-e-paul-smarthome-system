import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Footer extends Component {
    state = {  } 
    render() { 
        return (
            //navbar-fixed-bottom für höhere Position des Footers
            <nav className="navbar fixed-bottom" style={{backgroundColor: '#00BFFF'}}> 
            <div className="container-fluid">
                <a className="nav-link active" aria-current="page" href="www.google.com">Impressum</a>
                <Link className="nav-link active" aria-current="page" to="/about">About us</Link>
            </div>
            </nav>
        );
    }
}
 
export default Footer;
