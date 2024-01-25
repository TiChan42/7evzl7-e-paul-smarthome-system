import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import './header.css'
import { Routes } from 'react-router-dom';

class Header extends Component {
    state = {  } 

    render() { 
        return (
            <nav className="navbar" style={{backgroundColor: '#218395'}}>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src="assets/img/clearLogoWhite.png" alt="Logo" width="30" height="30" className="d-inline-block align-text-top"/>
                    <span class='logotext'> E-Paul 7EVZL7</span>
                    
                </Link>
                <Routes>
                    <Route path="/about" element={<h2 className='heading-about'>About</h2>}></Route>
                </Routes>
                <form style={{color: '#00BFFF'}}>
                    <a href="/signin">
                        <button className="btn btn-outline-success me-2 btn-sign-up" type="button" >Sign up</button>
                    </a>    

                    <a href="/login">
                        <button className="btn btn-outline-success me-2 btn-login" type="button" >Login</button>    
                    </a>                    
                </form>
            </div>
            </nav>    
  );
};
}
 
export default Header;
