import React, { Component } from 'react';

class Footer extends Component {
    state = {  } 
    render() { 
        return (
            //navbar-fixed-bottom für höhere Position des Footers
            <nav className="navbar fixed-bottom" style={{backgroundColor: '#00BFFF'}}> 
            <div className="container-fluid">
                <a className="nav-link active" aria-current="page" href="www.google.com">Impressum</a>
                <a className="nav-link active" aria-current="page" href="www.google.com">About us</a>
            </div>
            </nav>  
        );
    }
}
 
export default Footer;
